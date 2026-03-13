import { Injectable } from '@nestjs/common';
import axios from 'axios';

export interface FundEstimate {
  /** 基金代码 */
  fund_code: string;
  /** 基金名称 */
  fund_name?: string;
  /** 估算净值 */
  estimate_nav?: string;
  /** 估算涨幅 */
  estimate_growth?: string;
  /** 估算时间 */
  estimate_time?: string;
  /** 最新净值 */
  latest_nav?: string;
  /** 最新净值日期 */
  latest_nav_date?: string;
  /** 是否来自缓存 */
  from_cache?: boolean;
  /** 错误信息 */
  error?: string;
}

@Injectable()
export class FundService {
  private readonly XIAOBEI_API_BASE = 'https://api.xiaobeiyangji.com/yangji-api/api';

  /**
   * 批量获取基金估值
   * @param fundCodes 基金代码数组
   */
  async fetchFundEstimates(fundCodes: string[]): Promise<Record<string, FundEstimate>> {
    if (!fundCodes?.length) {
      return {};
    }

    const tasks = fundCodes.map(async (code) => {
      const estimate = await this.fetchSingleFundEstimate(code);
      return [code, estimate] as const;
    });

    const entries = await Promise.all(tasks);
    return Object.fromEntries(entries);
  }

  private async fetchSingleFundEstimate(code: string): Promise<FundEstimate> {
    try {
      // 天天基金估值接口
      // 添加时间戳防止缓存
      const url = `http://fundgz.1234567.com.cn/js/${code}.js?rt=${Date.now()}`;

      const response = await fetch(url, {
        method: 'GET',
        // 模拟浏览器 User-Agent，防止部分环境被拦截
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`);
      }

      const text = await response.text();

      // 解析 JSONP 格式: jsonpgz({...});
      const match = text.match(/jsonpgz\((.*)\);/);

      if (match && match[1]) {
        const data = JSON.parse(match[1]);

        return {
          fund_code: data.fundcode,
          fund_name: data.name,
          estimate_nav: data.gsz,      // 估算净值 (gsz)
          estimate_growth: data.gszzl, // 估算涨幅 (gszzl)
          estimate_time: data.gztime,  // 估算时间 (gztime)
          latest_nav: data.dwjz,       // 最新净值 (dwjz)
          latest_nav_date: data.jzrq,  // 最新净值日期 (jzrq)
          from_cache: false,
        };
      } else {
        return {
          fund_code: code,
          error: '数据格式解析失败',
        };
      }
    } catch (error) {
      return {
        fund_code: code,
        error: error instanceof Error ? `请求失败: ${error.message}` : '请求失败: 未知错误',
      };
    }
  }

  async getMarketIndex() {
    return this.fetchFromXiaobei('/get-market-index-list');
  }

  async getHoldList(body: any) {
    return this.fetchFromXiaobei('/get-hold-list', body);
  }

  private async fetchFromXiaobei(endpoint: string, body: any = {}) {
    const { data } = await axios.post(`${this.XIAOBEI_API_BASE}${endpoint}`, body, {
      headers: {
        'Content-Type': 'application/json',
        'xweb_xhr': '1',
      }
    });
    return data;
  }
}
