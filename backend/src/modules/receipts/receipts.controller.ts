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
import { ReceiptsService } from './receipts.service';
import { CreateReceiptDto } from './dto/create-receipt.dto';
import { UpdateReceiptDto } from './dto/update-receipt.dto';
import { QueryReceiptDto } from './dto/query-receipt.dto';
import { CoupleTenantGuard } from '../../common/guards/couple-tenant.guard';
import { CoupleId } from '../../common/decorators/couple-id.decorator';

@ApiTags('receipts')
@ApiHeader({
  name: 'x-couple-id',
  description: 'UUID identifier of the couple tenant',
  required: true,
})
@UseGuards(CoupleTenantGuard)
@Controller('receipts')
export class ReceiptsController {
  constructor(private readonly receiptsService: ReceiptsService) {}

  @Post()
  @ApiOperation({ summary: 'Save a new receipt to The Jar' })
  @ApiResponse({ status: 201, description: 'Receipt successfully saved' })
  create(
    @CoupleId() coupleId: string,
    @Body() createReceiptDto: CreateReceiptDto,
  ) {
    return this.receiptsService.create(coupleId, createReceiptDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all receipts in The Jar with filtering' })
  @ApiResponse({ status: 200, description: 'List of receipts' })
  findAll(
    @CoupleId() coupleId: string,
    @Query() query: QueryReceiptDto,
  ) {
    return this.receiptsService.findAll(coupleId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get receipt details by ID' })
  @ApiResponse({ status: 200, description: 'Receipt details' })
  findOne(
    @CoupleId() coupleId: string,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.receiptsService.findOne(coupleId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a receipt' })
  @ApiResponse({ status: 200, description: 'Updated receipt' })
  update(
    @CoupleId() coupleId: string,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateReceiptDto: UpdateReceiptDto,
  ) {
    return this.receiptsService.update(coupleId, id, updateReceiptDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a receipt' })
  @ApiResponse({ status: 200, description: 'Receipt deleted successfully' })
  remove(
    @CoupleId() coupleId: string,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.receiptsService.remove(coupleId, id);
  }
}
