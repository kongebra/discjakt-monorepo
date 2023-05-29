import Queue from "bull";
import { prisma } from "database";
import type { Product } from "database";
import { scrapeAceshopProduct } from "../jobs/aceshop/product";
import { scrapeDgshopProduct } from "../jobs/dgshop/product";
import { scrapeDiscgolfDynastyProduct } from "../jobs/discgolfdynasty/product";
import { scrapeDiscoverDiscsProduct } from "../jobs/discoverdiscs/product";
import { scrapeDiscshopenProduct } from "../jobs/discshopen/product";
import { scrapeDiscsjappaProduct } from "../jobs/discsjappa/product";
import { scrapeFrisbeebutikkenProduct } from "../jobs/frisbeebutikken/product";
import { scrapeFrisbeesorProduct } from "../jobs/frisbeesor/product";
import { scrapeGolfdiscerProduct } from "../jobs/golfdiscer/product";
import { scrapeProdiscProduct } from "../jobs/prodisc/product";
import { scrapeSendskiveProduct } from "../jobs/sendeskive/product";
import { scrapeSpinnvilldgProduct } from "../jobs/spinnvilldg/product";
import { scrapeStarframeProduct } from "../jobs/starframe/product";
import { scrapeWearediscgolfProduct } from "../jobs/wearediscgolf/product";

// bull: Message queue
if (!process.env.REDIS_URL) {
  throw new Error("REDIS_URL is not set");
}
export const productQueue = new Queue<Product>(
  "product",
  process.env.REDIS_URL,
  {
    defaultJobOptions: {
      removeOnComplete: true,
    },
  }
);

productQueue.process(5, async (job) => {
  const { data } = job;

  const site = await prisma.site.findUnique({
    where: { id: data.siteId },
  });

  if (!site) {
    throw new Error(`Site with id ${data.siteId} not found`);
  }

  switch (site.slug) {
    case "aceshop":
      return scrapeAceshopProduct(data);
    case "dgshop":
      return scrapeDgshopProduct(data);
    case "discgolfdynasty":
      return scrapeDiscgolfDynastyProduct(data);
    case "discoverdiscs":
      return scrapeDiscoverDiscsProduct(data);
    case "discshopen":
      return scrapeDiscshopenProduct(data);
    case "discsjappa":
      return scrapeDiscsjappaProduct(data);
    case "frisbeebutikken":
      return scrapeFrisbeebutikkenProduct(data);
    case "frisbeesor":
      return scrapeFrisbeesorProduct(data);
    case "golfdiscer":
      return scrapeGolfdiscerProduct(data);
    case "prodisc":
      return scrapeProdiscProduct(data);
    case "sendeskive":
      return scrapeSendskiveProduct(data);
    case "spinnvilldg":
      return scrapeSpinnvilldgProduct(data);
    case "starframe":
      return scrapeStarframeProduct(data);
    case "wearediscgolf":
      return scrapeWearediscgolfProduct(data);

    default:
      throw new Error(
        `product scraper not implemented for this site ${site.slug}`
      );
  }
});
