import { config } from 'dotenv';
import { z } from 'zod';

import { StormClient } from '@storm-live-addon/storm-client';
import { RiskEngine } from '@storm-live-addon/risk-engine';

config();

const EnvSchema = z.object({
  MODE: z.enum(['paper', 'live']).default('paper'),
  STORM_API_KEY: z.string().min(1),
  STORM_API_SECRET: z.string().min(1),
  STORM_BASE_URL: z.string().min(1).optional(),
  MAX_DAILY_LOSS: z.string().default('500'),
  MAX_POSITION_SIZE: z.string().default('1'),
  ALERT_WEBHOOK: z.string().url().optional(),
});

type Env = z.infer<typeof EnvSchema>;

function parseEnv(): Env {
  return EnvSchema.parse(process.env);
}

function parseLimits(env: Env) {
  return {
    maxDailyLoss: Number(env.MAX_DAILY_LOSS),
    maxPositionSize: Number(env.MAX_POSITION_SIZE),
  };
}

async function main() {
  const env = parseEnv();
  const mode = env.MODE;

  const storm = new StormClient({
    apiKey: env.STORM_API_KEY,
    apiSecret: env.STORM_API_SECRET,
    baseUrl: env.STORM_BASE_URL,
  });

  const risk = new RiskEngine(parseLimits(env));

  if (mode === 'paper') {
    await runPaper(storm, risk);
    return;
  }

  await runLive(storm, risk);
}

async function runPaper(storm: StormClient, risk: RiskEngine) {
  // Paper mode: logs only. This is where strategy + execution wiring goes first.
  // Do not upgrade to live until risk controls are hard-wired.
  const markets = await storm.getMarkets();
  if (!markets?.length) {
    console.log('No markets available yet.');
    return;
  }

  const positions = await storm.getPositions();
  console.log('markets', markets.length);
  console.log('positions', positions?.length ?? 0);
}

async function runLive(_storm: StormClient, _risk: RiskEngine) {
  // Live mode is intentionally empty for safety. Build all wiring in paper mode first.
  console.log('Live mode: not yet implemented.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
