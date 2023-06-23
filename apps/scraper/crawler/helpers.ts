import { isCurrency, parsePrice } from '../utils/price';
import { CrawlerParserFunc } from './types';

type CrawlerParserFuncHelperType = {
  product: {
    name: CrawlerParserFunc<string>;
    description: CrawlerParserFunc<string>;
    price: CrawlerParserFunc<number>;
    currency: CrawlerParserFunc<string>;
    imageUrl: CrawlerParserFunc<string>;

    outOfStock: CrawlerParserFunc<boolean>;
  };
};

export const CrawlerParserFuncHelper: CrawlerParserFuncHelperType = {
  product: {
    name: ($) => {
      const ogName = $('meta[property="og:title"]').attr('content');
      if (ogName) {
        return ogName;
      }

      const titleSelectors = [
        'h1',
        '.product-title',
        '.product_title',
        '.product-title-v1',
        'title',
        '#productTitle', // Amazon
        '.product-info-title', // Walmart
        '.product-detail-title', // Best Buy
        '.product-name', // Target
        '.product_name', // Target (alternative)
        '.product_title', // WooCommerce
        '.product_title.entry-title', // WooCommerce
        '.product_title.single-product-title', // WooCommerce
        '.productTitle', // Wix
        '.title.product-title', // Wix
        '.productTitle.product-title', // Wix
        '.product-single__title', // Shopify
        '.product-title', // Shopify
        '.product-single__title.product_title', // Shopify
        '.product_title.product-single__title', // Shopify
      ];

      for (const selector of titleSelectors) {
        const potentialTitle = $(selector).first().text().trim();

        if (potentialTitle) {
          return potentialTitle;
        }
      }

      return '';
    },
    description: ($) => {
      const ogSelectors = ["meta[property='og:description']", "meta[name='description']"];
      for (const selector of ogSelectors) {
        const ogDescription = $(selector).attr('content');
        if (ogDescription) {
          return ogDescription;
        }
      }

      const descriptionSelectors = [
        '.product-description',
        '.product-description-container',
        '.product-detail-description',
        '#product-description',
        '#description',
        '.product-single__description', // Shopify
        '.product-single__description.rte', // Shopify
      ];

      for (const selector of descriptionSelectors) {
        const potentialDescription = $(selector).first().text().trim();
        if (potentialDescription) {
          return potentialDescription;
        }
      }

      // This field can be blank
      return '';
    },
    price: ($) => {
      const ogSelectors = [
        'meta[property="product:price:amount"]',
        'meta[property="og:price:amount"]',
      ];
      for (const selector of ogSelectors) {
        const ogPrice = $(selector).attr('content');
        if (ogPrice) {
          return parsePrice(ogPrice);
        }
      }

      const priceSelectors = [
        '.product-price',
        '.price',
        '.price-container',
        '.product-price-container',
        '.product-price-text',
        '.product-price span',
        '.product-price .amount',
        '.product-price .price',
        '.product-single__price', // Shopify
        '.product-single__price.price', // Shopify
      ];

      for (const selector of priceSelectors) {
        const potentialPrice = $(selector).first().text().trim();
        if (potentialPrice) {
          return parsePrice(potentialPrice);
        }
      }

      return -1;
    },

    currency: ($) => {
      const ogSelectors = [
        'meta[property="product:price:currency"]',
        'meta[property="og:price:currency"]',
      ];
      for (const selector of ogSelectors) {
        const ogCurrency = $(selector).attr('content');
        if (ogCurrency) {
          return ogCurrency;
        }
      }

      const currencySelectors = [
        '.currency-symbol',
        '.product-price .currency',
        '.product-price .currency-symbol',
        '.product-single__price .money .currency',
        '.product-single__price .money .currency-symbol',
        '.woocommerce-Price-currencySymbol',
        '.price .woocommerce-Price-currencySymbol',
        '.price-symbol',
        '.product-price-symbol',
        '.money .currency',
        '.money .currency-symbol',
      ];

      for (const selector of currencySelectors) {
        const potentialCurrency = $(selector).first().text().trim();
        if (potentialCurrency) {
          if (isCurrency(potentialCurrency)) {
            return potentialCurrency;
          }

          return 'NOK'; // Default to NOK
        }
      }

      return 'NOK'; // Default to NOK
    },
    imageUrl: ($) => {
      const ogSelectors = ['meta[property="og:image"]', 'meta[property="og:image:secure_url"]'];
      for (const selector of ogSelectors) {
        const ogImage = $(selector).attr('content');
        if (ogImage) {
          return ogImage;
        }
      }

      const imageSelectors = [
        '.product-image',
        '.product-image-container',
        '.product-detail-image',
        '#product-image',
        '.product-single__photo', // Shopify
        '.product-single__photo.img-fluid', // Shopify
        '.product_image', // WooCommerce
        '.product_image img', // WooCommerce
        '.image-carousel-image', // Wix
        '.product-image-container img', // Wix
        '.img-fluid.fit-prod-page.fit-prod-page5050', // Frisbeebutikken & Starframe
        '.product-media-modal__content img', // Discover Discs
        '.product__media img', // Prodisc
        '.image-magnify-none', // Prodisc
      ];
      for (const selector of imageSelectors) {
        const potentialImage = $(selector).first().attr('src');
        if (potentialImage) {
          return potentialImage;
        }
      }

      return '';
    },
    outOfStock: ($) => {
      const outOfStockSelectors = ['.out-of-stock', '.out-of-stock-text', '.product-out-of-stock'];

      for (const selector of outOfStockSelectors) {
        const potentialOutOfStock = $(selector).first().text().trim();
        if (potentialOutOfStock) {
          return true;
        }
      }

      return false;
    },
  },
};
