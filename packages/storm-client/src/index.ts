// Storm client wrapper (stub)
export type StormClientConfig = {
  apiKey: string;
  apiSecret: string;
  baseUrl?: string;
};

export class StormClient {
  constructor(private cfg: StormClientConfig) {}

  async getMarkets() {
    // TODO: call Storm REST API
    return [];
  }

  async getPositions() {
    // TODO: call Storm REST API
    return [];
  }

  async placeOrder(params: Record<string, unknown>) {
    // TODO: call Storm REST API
    return { ok: true, params };
  }
}
