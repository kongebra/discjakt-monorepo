import { Disc, Product, Store } from 'database';

const blacklistWords = [
  // Nettsider
  'discshopen.no',
  'wearediscgolf.no',
  'Spinnvill',

  // Diverse
  ' - ',
  '[',
  ']',
  'Fairway Driver',
  'Distance Driver',
  'Lightweight',
  'Stamp',
  'Signature',
  'World Champion',
  'Ledgestone',
  'Limited Edition',

  // Årstall
  '2023',
  '2022',
  '2021',
  '2020',

  // Pro players
  'Aaron Gossage',
  'Adam Hammes',
  'Anthon Barela',
  'Brodie Smith',
  'Cale Leiviska',
  'Calvin Heimburg',
  'Catrina Allen',
  'Chris Dickerson',
  'Corey Ellis',
  'Eagle McMahon',
  'Elaine King',
  'Ezra Aderhold',
  'Garrett Gurthie',
  'Hailey King',
  'Heather Young',
  'Holyn Handley',
  'James Conrad',
  'Jessica Weese',
  'Kevin Jones',
  'Kona Panis',
  'Kristin Tattar',
  'Missy Gannon',
  'Nate Sexton',
  'Nikko Locastro',
  'Paige Pierce',
  'Paul McBeth',
  'Paul Ulibarri',
  'Philo Brathwaite',
  'Ricky Wysocki',
  'Sarah Hokom',
  'Simon Lizotte',
  'Valerie Mandujano',

  // Plastics
  'Arctic Line',
  'Big Z',
  'BT Medium',
  'C-Line',
  'Champion',
  'Chrome Line',
  'Cosmic Neutron',
  'D-Line',
  'DX',
  'ESP',
  'ESP FLX',
  'Flex 2',
  'Flex 3',
  'Fission',
  'Glow',
  'Gold Burst',
  'Gold',
  'INNfuse',
  'Lucid',
  'Neo',
  'Neutron',
  'Nebula Ethereal',
  'Opto Air',
  'Opto Glimmer',
  'Opto X',
  'Opto-X',
  'Opto',
  'Retro Burst',
  'X-Line',
  'Z-Line',
  'Z Line',
  'Z Metallic',
  'Z Swirl',
  'Viking Armor',
  'Viking Ground',
  'Viking Storm',
  'VIP',
  'VIP-X',
  'X-Out',

  // Brands
  'Latitude 64',
  'Infinite',
  'Innova',
];

const specialCompareRules = [
  'it',
  'wei',
  'fl',
  'link',
  'roc',
  'phi',
  'bi',
  'md',
  'ion',
  'd1',
  'fd',
  'mako',
  'fu',
  'd3',
  'hawk',
  'rive',
  'leopard',
  'king',
  'pulse',
  'tl',
  'hu',
  'orc',
  'rat',
  'limit',
  'teebird',
  'wombat',
  'roc',
  'rhyno',
  'axis',
  'ape',
  'amp',
  'bi',
  'magic',
  'ra',
];

const prodigyV2discs = ['h1v2', 'h2v2', 'h3v2', 'h4v2'];

export function searchDiscs(
  product: Product & { store: Store },
  discs: (Disc & {
    speed: number;
    glide: number;
    turn: number;
    fade: number;
  })[],
) {
  let lowerCaseProductName = product.name.toLowerCase();
  for (const word of blacklistWords) {
    if (lowerCaseProductName.includes(word.toLowerCase())) {
      lowerCaseProductName = lowerCaseProductName.replace(word.toLowerCase(), '');
    }
  }

  const productWords = lowerCaseProductName
    .split(' ')
    .map((word) => word.trim())
    .filter((word) => word);

  if (prodigyV2discs.some((name) => productWords.includes(name))) {
    const index = productWords.findIndex((name) => prodigyV2discs.includes(name));
    if (index != -1) {
      // split word "h1v2" into "h1" and "v2"
      const word = productWords[index];
      const [a, b, c, d] = word.split('');

      productWords[index] = `${a}${b} ${c}${d}`;
    }
  }

  if (productWords.includes('banger-gt')) {
    const index = productWords.findIndex((name) => name === 'banger-gt');
    if (index != -1) {
      productWords[index] = 'banger gt';
    }
  }

  const suggestions: (Disc & {
    speed: number;
    glide: number;
    turn: number;
    fade: number;
  })[] = [];

  const productName = productWords.join(' ');

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

    // ["flow motion", "motion"] matches "motion", this will remove that
    const discNameSplit = lowerCaseDiscName.split(' ');
    if (discNameSplit.length > 1) {
      if (!productName.includes(lowerCaseDiscName)) {
        isMatch = false;
      }
    }

    if (isMatch) {
      suggestions.push(disc);
    }
  }

  if (suggestions.length > 1) {
    // Discraft SS/OS discs
    const DISCRAFT_ID = 5;
    if (suggestions.every((disc) => disc.brandId === DISCRAFT_ID)) {
      const types = ['ss', 'os', 'gt'];
      if (types.some((type) => productName.includes(type))) {
        const index = suggestions.findIndex(
          (disc) => !types.some((type) => disc.name.toLowerCase().includes(type)),
        );
        if (index != -1) {
          suggestions.splice(index, 1);
        }
      }
    }

    if (productName.includes("Captain's Raptor".toLowerCase())) {
      const index = suggestions.findIndex((disc) => disc.slug !== 'captains-raptor');
      if (index != -1) {
        suggestions.splice(index, 1);
      }
    }

    // This will help us remove discs that is a part of the word
    // Examples: [["uplink", "link"], ["glitch", "it"], ["weight", "wei"], ["flex", "fl"]]
    for (const rule of specialCompareRules) {
      const ruleLowerCase = rule.toLowerCase();
      const ruleHitIndex = suggestions.findIndex(
        (disc) => disc.name.toLowerCase() === ruleLowerCase,
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
