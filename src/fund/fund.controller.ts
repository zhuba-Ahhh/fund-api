import { Controller, Get, Query, Post, Body } from '@nestjs/common';
import { FundService } from './fund.service';

@Controller('fund')
export class FundController {
  constructor(private readonly fundService: FundService) {}

  /**
   * 批量获取基金估值
   * GET /fund/estimate?codes=000001,000002
   */
  @Get('estimate')
  async getFundEstimates(@Query('codes') codes: string) {
    if (!codes) {
      return {};
    }
    const codeList = codes.split(',').map((c) => c.trim()).filter((c) => c.length > 0);
    return this.fundService.fetchFundEstimates(codeList);
  }

  @Post('get-market-index-list')
  async getMarketIndex() {
    return this.fundService.getMarketIndex();
  }

  @Post('get-hold-list')
  async getHoldList(@Body() body: any) {
    return this.fundService.getHoldList(body);
  }
}
