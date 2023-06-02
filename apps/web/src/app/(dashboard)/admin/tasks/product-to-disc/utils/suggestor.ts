import { Disc, Product, Store } from "database";

const blacklistWords = [
  // Nettsider
  "discshopen.no",
  "wearediscgolf.no",

  // Diverse
  " - ",
  "Fairway Driver",
  "Distance Driver",
  "Lightweight",
  "Stamp",
  "Signature",
  "World Champion",

  // Årstall
  "2023",
  "2022",
  "2021",
  "2020",

  // Pro players
  "Aaron Gossage",
  "Adam Hammes",
  "Anthon Barela",
  "Brodie Smith",
  "Calvin Heimburg",
  "Catrina Allen",
  "Chris Dickerson",
  "Corey Ellis",
  "Eagle McMahon",
  "Ezra Aderhold",
  "Garrett Gurthie",
  "Hailey King",
  "Heather Young",
  "Holyn Handley",
  "James Conrad",
  "Jessica Weese",
  "Kevin Jones",
  "Kona Panis",
  "Kristin Tattar",
  "Missy Gannon",
  "Nate Sexton",
  "Nikko Locastro",
  "Paige Pierce",
  "Paul McBeth",
  "Philo Brathwaite",
  "Ricky Wysocki",
  "Sarah Hokom",
  "Simon Lizotte",
  "Valerie Mandujano",

  // Plastics
  "Arctic Line",
  "Big Z",
  "BT Medium",
  "C-Line",
  "Champion",
  "Chrome Line",
  "D-Line",
  "DX",
  "ESP",
  "ESP FLX",
  "Flex 2",
  "Flex 3",
  "Fission",
  "Glow",
  "Gold Burst",
  "Gold",
  "Neo",
  "Neutron",
  "Opto",
  "Retro Burst",
  "X-Line",
  "Z-Line",
  "Z Line",

  // Brands
  "Latitude 64",
  "Infinite",
  "Innova",
];

const specialCompareRules = [
  "it",
  "wei",
  "fl",
  "link",
  "roc",
  "phi",
  "bi",
  "md",
  "ion",
  "d1",
  "fd",
  "mako",
  "fu",
  "d3",
  "hawk",
  "rive",
  "leopard",
  "king",
];

export function searchDiscs(
  product: Product & { store: Store },
  discs: (Disc & {
    speed: number;
    glide: number;
    turn: number;
    fade: number;
  })[]
) {
  let lowerCaseProductName = product.name.toLowerCase();
  for (const word of blacklistWords) {
    if (lowerCaseProductName.includes(word.toLowerCase())) {
      lowerCaseProductName = lowerCaseProductName.replace(
        word.toLowerCase(),
        ""
      );
    }
  }

  const productWords = lowerCaseProductName
    .split(" ")
    .map((word) => word.trim())
    .filter((word) => word);

  const suggestions: (Disc & {
    speed: number;
    glide: number;
    turn: number;
    fade: number;
  })[] = [];

  const productName = productWords.join(" ");

  for (const disc of discs) {
    const lowerCaseDiscName = disc.name.toLowerCase();

    let isMatch = true;

    for (const word of productWords) {
      if (!lowerCaseDiscName.includes(word)) {
        isMatch = false;
        break;
      }
    }

    if (!isMatch && productName.includes(lowerCaseDiscName)) {
      isMatch = true;
    }

    if (isMatch) {
      suggestions.push(disc);
    }
  }

  if (suggestions.length > 1) {
    // This will help us remove discs that is a part of the word
    // Examples: [["uplink", "link"], ["glitch", "it"], ["weight", "wei"], ["flex", "fl"]]
    for (const rule of specialCompareRules) {
      const ruleLowerCase = rule.toLowerCase();
      const ruleHitIndex = suggestions.findIndex(
        (disc) => disc.name.toLowerCase() === ruleLowerCase
      );
      // we have found one of our special rules
      if (ruleHitIndex !== -1) {
        let isMatch = false;
        // we need to check if it is only a part of the name
        for (const word of productWords) {
          if (word === ruleLowerCase) {
            isMatch = true;
            break;
          }
        }

        if (!isMatch) {
          suggestions.splice(ruleHitIndex, 1);
        }
      }
    }
  }

  return suggestions;
}
