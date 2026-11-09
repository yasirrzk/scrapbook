import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiHeader,
} from '@nestjs/swagger';
import { MemoriesService } from './memories.service';
import { OnThisDayQueryDto } from './dto/on-this-day-query.dto';
import { CoupleTenantGuard } from '../../common/guards/couple-tenant.guard';
import { CoupleId } from '../../common/decorators/couple-id.decorator';

@ApiTags('memories')
@ApiHeader({
  name: 'x-couple-id',
  description: 'UUID identifier of the couple tenant',
  required: true,
})
@UseGuards(CoupleTenantGuard)
@Controller('memories')
export class MemoriesController {
  constructor(private readonly memoriesService: MemoriesService) {}

  @Get('on-this-day')
  @ApiOperation({
    summary: 'Get "On This Day" flashback memories from previous years',
    description:
      'Finds receipts and scrapbooks sharing the same month and day from years prior to the current year.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of matching memories and how many years ago they took place',
  })
  getOnThisDay(
    @CoupleId() coupleId: string,
    @Query() query: OnThisDayQueryDto,
  ) {
    return this.memoriesService.getOnThisDay(coupleId, query.date);
  }
}
