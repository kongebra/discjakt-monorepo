import { Injectable } from '@nestjs/common';
import { Prisma } from 'database';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

@Injectable()
export class StoreService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createStoreDto: CreateStoreDto) {
    return await this.prisma.store.create({
      data: createStoreDto,

      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });
  }

  async findAll(
    args: Pick<Prisma.StoreFindManyArgs, 'where' | 'take' | 'skip' | 'orderBy'>,
  ) {
    return await this.prisma.store.findMany({
      ...args,
      where: {
        deletedAt: null,
        ...args.where,
      },

      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });
  }

  async findOne(slug: string) {
    const store = await this.prisma.store.findUnique({
      where: {
        slug,
      },

      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    if (store?.deletedAt !== null) {
      return null;
    }

    return store;
  }

  async update(slug: string, updateStoreDto: UpdateStoreDto) {
    return await this.prisma.store.update({
      where: {
        slug,
      },
      data: updateStoreDto,

      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });
  }

  async remove(slug: string) {
    return await this.prisma.store.update({
      where: {
        slug,
      },
      data: {
        deletedAt: new Date(),
      },

      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });
  }
}
