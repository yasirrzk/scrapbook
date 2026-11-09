import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiHeader,
} from '@nestjs/swagger';
import { ScrapbooksService } from './scrapbooks.service';
import { CreateScrapbookDto } from './dto/create-scrapbook.dto';
import { UpdateScrapbookDto } from './dto/update-scrapbook.dto';
import { QueryScrapbookDto } from './dto/query-scrapbook.dto';
import { CoupleTenantGuard } from '../../common/guards/couple-tenant.guard';
import { CoupleId } from '../../common/decorators/couple-id.decorator';

@ApiTags('scrapbooks')
@ApiHeader({
  name: 'x-couple-id',
  description: 'UUID identifier of the couple tenant',
  required: true,
})
@UseGuards(CoupleTenantGuard)
@Controller('scrapbooks')
export class ScrapbooksController {
  constructor(private readonly scrapbooksService: ScrapbooksService) {}

  @Post()
  @ApiOperation({ summary: 'Save a new scrapbook collage page' })
  @ApiResponse({ status: 201, description: 'Scrapbook saved successfully' })
  create(
    @CoupleId() coupleId: string,
    @Body() createScrapbookDto: CreateScrapbookDto,
  ) {
    return this.scrapbooksService.create(coupleId, createScrapbookDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all scrapbook collages' })
  @ApiResponse({ status: 200, description: 'List of scrapbooks' })
  findAll(
    @CoupleId() coupleId: string,
    @Query() query: QueryScrapbookDto,
  ) {
    return this.scrapbooksService.findAll(coupleId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get scrapbook canvas state by ID' })
  @ApiResponse({ status: 200, description: 'Scrapbook details with canvas JSON' })
  findOne(
    @CoupleId() coupleId: string,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.scrapbooksService.findOne(coupleId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a scrapbook collage' })
  @ApiResponse({ status: 200, description: 'Updated scrapbook' })
  update(
    @CoupleId() coupleId: string,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateScrapbookDto: UpdateScrapbookDto,
  ) {
    return this.scrapbooksService.update(coupleId, id, updateScrapbookDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a scrapbook collage' })
  @ApiResponse({ status: 200, description: 'Scrapbook deleted successfully' })
  remove(
    @CoupleId() coupleId: string,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.scrapbooksService.remove(coupleId, id);
  }
}
