import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { CheerioAPI, load } from 'cheerio';
import { Prisma, Product, ProductPrice } from 'database';
import { Selectors } from './selectors';

type ScrapedProduct = Partial<
  Pick<Product, 'name' | 'description' | 'imageUrl'> & {
    price: Pick<ProductPrice, 'price' | 'availability' | 'currency'>;
  }
>;

@Injectable()
export class ProductScraperService {
  private readonly logger = new Logger(ProductScraperService.name);

  constructor(private readonly http: HttpService) {}

  public async scrapeProduct(loc: string): Promise<ScrapedProduct> {
    const result: ScrapedProduct = {};

    const response = await this.http.axiosRef.get(loc);
    if (response.status !== 200) {
      if (response.status === 404) {
        this.logger.error(`Error 404, product not found`);
        throw new Error('Error 404, product not found');
      }

      this.logger.error(`Failed to fetch ${loc}`);
      throw new Error(`Failed to fetch ${loc}`);
    }

    const html = response.data;
    const $ = load(html);

    const outOfStock = this.extractValueFromSelectors(
      $,
      Selectors.Product.OutOfStock,
    );

    if (outOfStock) {
      this.logger.debug(`Product is out of stock`);
      result.price = {
        price: new Prisma.Decimal(0),
        currency: 'NOK',
        availability: 'OutOfStock',
      };
    }

    const jsonLDScripts = $('script[type="application/ld+json"]');
    jsonLDScripts.each((_, el) => {
      const jsonLD = $(el).text().trim();
      const cleanedJsonLD = jsonLD.replace(
        /\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/g,
        (m, g) => (g ? '' : m),
      );

      if (cleanedJsonLD) {
        const product = this.parseJsonLdProduct(cleanedJsonLD);
        if (product) {
          result.name = product.name;
          result.description = product.description;
          result.imageUrl = product.imageUrl;
          result.price = product.price;

          return; // stop iterating
        }
      }
    });

    if (!result.name) {
      const name = this.extractProductName($);
      if (name) {
        result.name = name;
      } else {
        throw new Error(`Failed to extract product name from ${loc}`);
      }
    }

    if (!result.description) {
      const description = this.extractProductDescription($);
      result.description = description || '';
    }

    if (!result.imageUrl) {
      const imageUrl = this.extractProductImageUrl($);
      if (imageUrl) {
        result.imageUrl = imageUrl;
      } else {
        throw new Error(`Failed to extract product image URL from ${loc}`);
      }
    }

    if (!result.price?.price) {
      const price = this.extractProductPrice($);

      if (price !== null) {
        result.price = {
          price: new Prisma.Decimal(price),
          currency: 'NOK',
          availability: price ? 'InStock' : 'OutOfStock',
        };
      } else {
        throw new Error(`Failed to extract product price from ${loc}`);
      }
    }

    return result;
  }

  private extractProductName($: CheerioAPI) {
    const ogValue = this.extractMetaTagContent(
      $,
      Selectors.OGTags.Product.Name,
    );
    if (ogValue) {
      return ogValue;
    }

    return this.extractValueFromSelectors($, Selectors.Product.Name);
  }

  private extractProductDescription($: CheerioAPI) {
    const ogValue = this.extractMetaTagContent(
      $,
      Selectors.OGTags.Product.Description,
    );
    if (ogValue) {
      return ogValue;
    }

    return (
      this.extractValueFromSelectors($, Selectors.Product.Description) || ''
    );
  }

  private extractProductPrice($: CheerioAPI) {
    const ogValue = this.extractMetaTagContent(
      $,
      Selectors.OGTags.Product.Price,
    );
    if (ogValue) {
      const numValue = parseFloat(ogValue);
      if (!isNaN(numValue)) {
        return numValue;
      }
    }

    const value = this.extractValueFromSelectors(
      $,
      Selectors.Product.Description,
    );

    if (value) {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        return numValue;
      }
    }

    return 0;
  }

  private extractProductImageUrl($: CheerioAPI) {
    const ogValue = this.extractMetaTagContent(
      $,
      Selectors.OGTags.Product.ImageUrl,
    );
    if (ogValue) {
      return ogValue;
    }

    for (const selector of Selectors.Product.ImageUrl) {
      const value = $(selector).attr('src');
      if (value) {
        return value;
      }
    }

    return null;
  }

  private extractValueFromSelectors(
    $: CheerioAPI,
    selectors: string[],
  ): string | null {
    for (const selector of selectors) {
      const value = $(selector).text().trim();
      if (value) {
        return value;
      }
    }

    return null;
  }

  private extractMetaTagContent($: CheerioAPI, selectors: string[]) {
    for (const selector of selectors) {
      const value = $(selector).attr('content');
      if (value) {
        return value;
      }
    }

    return null;
  }

  private parseJsonLdProduct(text: string): ScrapedProduct | null {
    try {
      const parsedJsonLd = JSON.parse(text);

      if (parsedJsonLd['@type'] === 'Product') {
        const product: ScrapedProduct = {
          name: parsedJsonLd?.name,
          description: parsedJsonLd?.description,
          imageUrl: parsedJsonLd?.image,
          price: {
            price: new Prisma.Decimal(parsedJsonLd?.price || 0),
            currency: 'NOK',
            availability: parsedJsonLd?.price ? 'InStock' : 'OutOfStock',
          },
        };

        if (parsedJsonLd?.offers && Array.isArray(parsedJsonLd.offers)) {
          const offer = parsedJsonLd.offers[0];

          if (offer['@type'] === 'Offer') {
            product.price = {
              price: new Prisma.Decimal(offer?.price || 0),
              currency: 'NOK',
              availability: 'InStock',
            };
          }
        }

        return product;
      }

      return null;
    } catch (error) {
      this.logger.error(`Failed to parse JSON-LD`);

      return null;
    }
  }
}
