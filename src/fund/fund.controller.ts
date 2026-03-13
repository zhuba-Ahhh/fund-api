import { Controller, Post, Body } from '@nestjs/common';
import { FundService } from './fund.service';

@Controller('fund')
export class FundController {
  constructor(private readonly fundService: FundService) {}

  /**
   * 批量获取基金估值
   * POST /fund/estimate
   * @param body - { codes: '000001,000002' }
   */
  @Post('estimate')
  async getFundEstimates(@Body() body: { codes: string[] }) {
    if (!body.codes) {
      return {};
    }
    const codes = body.codes.filter((c) => c.length > 0);
    return this.fundService.fetchFundEstimates(codes);
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
