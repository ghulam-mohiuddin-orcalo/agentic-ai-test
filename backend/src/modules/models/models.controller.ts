import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ModelsService } from './models.service';
import { FilterModelsDto, CreateModelDto, CreateReviewDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Models')
@Controller('models')
export class ModelsController {
  constructor(private readonly modelsService: ModelsService) {}

  @Get()
  @ApiOperation({ summary: 'List all models with filtering and pagination' })
  async findAll(@Query() query: FilterModelsDto) {
    return this.modelsService.findAll(query);
  }

  @Get('providers')
  @ApiOperation({ summary: 'Get all available providers' })
  async getProviders() {
    return this.modelsService.getProviders();
  }

  @Get('tags')
  @ApiOperation({ summary: 'Get all available tags' })
  async getTags() {
    return this.modelsService.getTags();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get model by ID with reviews' })
  async findById(@Param('id') id: string) {
    return this.modelsService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new model' })
  async create(@Body() dto: CreateModelDto) {
    return this.modelsService.create(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a model' })
  async update(@Param('id') id: string, @Body() dto: Partial<CreateModelDto>) {
    return this.modelsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a model' })
  async delete(@Param('id') id: string) {
    return this.modelsService.delete(id);
  }

  // --- Reviews ---

  @Post(':id/reviews')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a review for a model' })
  async createReview(
    @Param('id') modelId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: CreateReviewDto,
  ) {
    return this.modelsService.createReview(modelId, userId, dto);
  }

  @Get(':id/reviews')
  @ApiOperation({ summary: 'Get reviews for a model' })
  async getReviews(
    @Param('id') modelId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.modelsService.getReviews(modelId, page || 1, limit || 20);
  }
}
