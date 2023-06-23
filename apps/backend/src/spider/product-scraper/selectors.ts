export const Selectors = {
  Product: {
    OutOfStock: ['.stock.out-of-stock', '.out-of-stock', '.stock.unavailable'],
    Name: ['h1', 'title'],
    Description: ["meta[name='description']", '.description'],
    Price: ['.product-price', '.summary .price'],
    ImageUrl: ['img.img-fluid'],
  },
  OGTags: {
    Product: {
      Name: ["meta[property='og:title']"],
      Description: ["meta[property='og:description']"],
      Price: [
        "meta[property='og:price:amount']",
        "meta[property='product:price:amount']",
      ],
      ImageUrl: [
        "meta[property='og:image']",
        "meta[property='og:image:secure_url']",
      ],
    },
  },
};
