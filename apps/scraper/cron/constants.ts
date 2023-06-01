import { SitemapHandlerArgs } from "../utils/sitemap";

export type SitemapHandlerArrayArgs = SitemapHandlerArgs & {
  disabled?: boolean;
};

export const sitemapHandlerArgsArray: SitemapHandlerArrayArgs[] = [
  // Aceshop
  {
    disabled: false,
    store: {
      url: "https://aceshop.no",
      name: "Aceshop",
      slug: "aceshop",
    },
    itemCondition: ({ loc }) => {
      return loc.includes("/products/");
    },
  },

  // DGShop
  {
    disabled: false,
    store: {
      url: "https://dgshop.no",
      name: "DGShop",
      slug: "dgshop",
    },
    itemCondition: ({ loc, priority, lastmod }) => {
      return (
        priority === "1.0" && loc !== "https://dgshop.no" && lastmod !== null
      );
    },
  },

  // Discgolf Dynasty
  {
    disabled: false,
    store: {
      url: "https://discgolfdynasty.no",
      name: "Discgolf Dynasty",
      slug: "discgolfdynasty",
    },
    itemCondition: ({ loc }) => {
      return loc.includes("/products/");
    },
    sitemapSearch(value) {
      return value.includes("/sitemap_products_1.xml");
    },
  },

  // Discover Discs
  {
    disabled: false,
    store: {
      url: "https://discoverdiscs.no",
      name: "Discover Discs",
      slug: "discoverdiscs",
    },
    itemCondition: ({ loc }) => {
      return loc.includes("/products/");
    },
    sitemapSearch(value) {
      return value.includes("/sitemap_products_1.xml");
    },
  },

  // Discshopen
  {
    disabled: false,
    store: {
      url: "https://discshopen.no",
      name: "Disc Shopen",
      slug: "discshopen",
    },
    itemCondition: ({ loc }) => {
      return loc.includes("/produkt/");
    },
    sitemapSearch(value) {
      return value.includes("/product-sitemap.xml");
    },
  },

  // Discsjappa
  {
    disabled: false,
    store: {
      url: "https://discsjappa.no",
      name: "Disc Sjappa",
      slug: "discsjappa",
    },
    itemCondition: ({ loc }) => {
      return loc.includes("/products/");
    },
    sitemapSearch(value) {
      return value.includes("/sitemap_products_1.xml");
    },
  },

  // Frisbeebutikken
  {
    disabled: false,
    store: {
      url: "https://frisbeebutikken.no",
      name: "Frisbeebutikken",
      slug: "frisbeebutikken",
    },
    itemCondition: ({ loc }) => {
      return loc.includes("/products/");
    },
  },

  // Frisbeesør
  {
    disabled: false,
    store: {
      url: "https://frisbeesor.no",
      name: "Frisbee Sør",
      slug: "frisbeesor",
    },
    itemCondition: ({ loc }) => {
      return loc.includes("/produkt/");
    },
    sitemapSearch(value) {
      return value.includes("/product-sitemap");
    },
  },

  // Golfdiscer
  {
    disabled: false,
    store: {
      url: "https://golfdiscer.no",
      name: "Golf Discer",
      slug: "golfdiscer",
    },
    itemCondition: ({ loc }) => {
      return loc.includes("/products/");
    },
    sitemapSearch(value) {
      return value.includes("/sitemap_products_1.xml");
    },
  },

  // Krokhol Disc Golf Shop
  {
    disabled: false,
    store: {
      url: "https://krokholdgs.no",
      name: "Krokhol Disc Golf Shop",
      slug: "krokholdgs",
    },
    itemCondition: ({ loc }) => {
      return loc.includes("/products/");
    },
  },

  // Prodisc
  {
    disabled: false,
    store: {
      url: "https://prodisc.no",
      name: "Prodisc",
      slug: "prodisc",
    },
    itemCondition: ({ loc }) => {
      return loc.includes("/products/");
    },
    sitemapSearch(value) {
      return value.includes("/sitemap_products_1.xml");
    },
  },

  // Sendeskive
  {
    disabled: false,
    store: {
      url: "https://sendeskive.no",
      name: "Sendeskive",
      slug: "sendeskive",
    },
    itemCondition: ({ loc }) => {
      return loc.includes("/products/");
    },
    sitemapSearch(value) {
      return value.includes("/sitemap_products_1.xml");
    },
  },

  // Skippy Disc Golf
  {
    disabled: false,
    store: {
      url: "https://skippydg.no",
      name: "Skippy Disc Golf",
      slug: "skippydg",
    },
    itemCondition(item) {
      return item.loc.includes("/products/");
    },
    sitemapSearch(value) {
      return value.includes("/sitemap_products_1.xml");
    },
  },

  // Spinnvill DG
  {
    disabled: false,
    store: {
      url: "https://spinnvilldg.no",
      name: "Spinnvill DG",
      slug: "spinnvilldg",
    },
    itemCondition: ({ loc }) => {
      return loc.includes("/product-page/");
    },
    sitemapSearch(value) {
      return value.includes("/store-products-sitemap");
    },
  },

  // Starframe
  {
    disabled: false,
    store: {
      url: "https://starframe.no",
      name: "Starframe",
      slug: "starframe",
    },
    itemCondition: ({ loc }) => {
      return loc.includes("/products/");
    },
  },

  // We are Disc Golf
  {
    disabled: false,
    store: {
      url: "https://wearediscgolf.no",
      name: "We are Disc Golf",
      slug: "wearediscgolf",
    },
    itemCondition: ({ loc }) => {
      return loc.includes("/produkt/");
    },
    sitemapSearch(value) {
      return value.includes("/product-sitemap");
    },
  },
];