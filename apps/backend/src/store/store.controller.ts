import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Store } from 'database';
import { CreateStoreDto } from './dto/create-store.dto';
import { StoreDto } from './dto/store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { StoreService } from './store.service';

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  private mapStore(store: Store & { _count: { products: number } }): StoreDto {
    return {
      name: store.name,
      slug: store.slug,
      url: store.url,

      productsCount: store._count.products,
    };
  }

  @Post()
  async create(@Body() createStoreDto: CreateStoreDto) {
    const store = await this.storeService.create(createStoreDto);

    return this.mapStore(store);
  }

  @Get()
  async findAll() {
    return (await this.storeService.findAll({})).map(this.mapStore);
  }

  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    const store = await this.storeService.findOne(slug);

    if (!store) {
      return null;
    }

    return this.mapStore(store);
  }

  @Patch(':slug')
  async update(
    @Param('slug') slug: string,
    @Body() updateStoreDto: UpdateStoreDto,
  ) {
    const store = await this.storeService.update(slug, updateStoreDto);

    if (!store) {
      return null;
    }

    return this.mapStore(store);
  }

  @Delete(':slug')
  async remove(@Param('slug') slug: string) {
    const store = await this.storeService.remove(slug);

    if (!store) {
      return null;
    }

    return this.mapStore(store);
  }
}
