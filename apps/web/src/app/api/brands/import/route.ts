import { NextResponse } from 'next/server';

import alfadiscs from './data/alfadiscs.json';
import axiom from './data/axiom.json';
import clashdiscs from './data/clashdiscs.json';
import discmania from './data/discmania.json';
import discraft from './data/discraft.json';
import dynamicdiscs from './data/dynamicdiscs.json';
import ev7 from './data/ev7.json';
import innova from './data/innova.json';
import kastaplast from './data/kastaplast.json';
import latitude64 from './data/latitude64.json';
import mvp from './data/mvp.json';
import prodigy from './data/prodigy.json';
import rpmdiscs from './data/rpmdiscs.json';
import streamline from './data/streamline.json';
import thoughspaceathletics from './data/thoughspaceathletics.json';
import westsidediscs from './data/westsidediscs.json';
import yikun from './data/yikun.json';

type Item = {
  slug: string;
  name: string;
  data: any;
};

const brands: Item[] = [
  {
    slug: 'alfadiscs',
    name: 'Alfa Discs',
    data: alfadiscs,
  },
  {
    slug: 'axiom',
    name: 'Axiom',
    data: axiom,
  },
  {
    slug: 'clashdiscs',
    name: 'Clash Discs',
    data: clashdiscs,
  },
  {
    slug: 'discmania',
    name: 'Discmania',
    data: discmania,
  },
  {
    slug: 'discraft',
    name: 'Discraft',
    data: discraft,
  },
  {
    slug: 'dynamicdiscs',
    name: 'Dynamic Discs',
    data: dynamicdiscs,
  },
  {
    slug: 'ev7',
    name: 'EV-7',
    data: ev7,
  },
  {
    slug: 'innova',
    name: 'Innova',
    data: innova,
  },
  {
    slug: 'kastaplast',
    name: 'Kastaplast',
    data: kastaplast,
  },
  {
    slug: 'latitude64',
    name: 'Latitude 64',
    data: latitude64,
  },
  {
    slug: 'mvp',
    name: 'MVP',
    data: mvp,
  },
  {
    slug: 'prodigy',
    name: 'Prodigy',
    data: prodigy,
  },
  {
    slug: 'rpmdiscs',
    name: 'RPM Discs',
    data: rpmdiscs,
  },
  {
    slug: 'streamline',
    name: 'Streamline',
    data: streamline,
  },
  {
    slug: 'thoughspaceathletics',
    name: 'Though Space Athletics',
    data: thoughspaceathletics,
  },
  {
    slug: 'westsidediscs',
    name: 'West Side Discs',
    data: westsidediscs,
  },
  {
    slug: 'yikun',
    name: 'Yikun',
    data: yikun,
  },
];

export async function GET() {
  //   for (const { slug, name, data } of brands) {
  //     const brand = await prisma.brand.create({
  //       data: {
  //         slug,
  //         name,
  //         imageUrl: "",
  //       },
  //     });

  //     const discData = data.map((disc: any) => ({
  //       name: disc.name,
  //       slug: slugify(disc.name),
  //       brandId: brand.id,
  //       imageUrl: "",
  //       speed: disc.speed,
  //       glide: disc.glide,
  //       turn: disc.turn,
  //       fade: disc.fade,
  //       type: convertType(disc.type),
  //     }));

  //     await prisma.disc.createMany({
  //       data: discData,
  //       skipDuplicates: true,
  //     });
  //   }

  return NextResponse.json({ inactive: true });
}

// enum DiscType {
//   Putter
//   Midrange
//   FairwayDriver
//   DistanceDriver
// }

const convertType = (type: string) => {
  switch (type) {
    case 'PUTT_APPROACH':
      return 'Putter';
    case 'MIDRAGE':
    case 'MIDRANGE':
      return 'Midrange';
    case 'FAIRWAY_DRIVER':
      return 'FairwayDriver';
    case 'DISTANCE_DRIVER':
      return 'DistanceDriver';
    default:
      return 'Putter';
  }
};
