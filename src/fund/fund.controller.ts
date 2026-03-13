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

  /**
   * 获取市场行情指数
   */
  @Post('get-market-index-list')
  async getMarketIndex() {
    return this.fundService.getMarketIndex();
  }

  /**
   * 获取持仓列表
   * @param body 请求体
   */
  @Post('get-hold-list')
  async getHoldList(@Body() body: any) {
    return this.fundService.getHoldList(body);
  }
}
