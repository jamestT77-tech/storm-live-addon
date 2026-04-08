export type RiskLimits = {
  maxDailyLoss: number;
  maxPositionSize: number;
};

export class RiskEngine {
  constructor(private readonly limits: RiskLimits) {}

  assertTrade(runningDailyPnl: number, proposedPositionSize: number) {
    if (runningDailyPnl <= -this.limits.maxDailyLoss) {
      throw new Error('Risk limit: daily loss exceeded');
    }
    if (proposedPositionSize > this.limits.maxPositionSize) {
      throw new Error('Risk limit: position size exceeded');
    }
  }
}
