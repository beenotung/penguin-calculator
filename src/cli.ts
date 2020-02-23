import { getRL, createRL } from '@beenotung/tslib/io';
import { catchMain } from '@beenotung/tslib/node';
import { format_time_duration } from '@beenotung/tslib/format';


let rl = createRL({ input: process.stdin, output: process.stdout });
let question = (query: string) => new Promise<string>(resolve => rl.question(query, resolve));

function parseValue(s: string): number {
  if (!s) {
    return 0;
  }
  let baseValue = parseFloat(s);
  let unit = s.replace(baseValue.toString(), '');
  if (!unit) {
    return baseValue;
  }
  let unitValue = parseInt(unit, 36) - 9;
  return baseValue * 1000 ** unitValue;
}

function formatValue(x: number): string {
  let unit = 9;
  for (; x >= 1000;) {
    unit++;
    x /= 1000;
  }
  return Math.round(x * 100) / 100 + (unit.toString(36));
}

async function main(): Promise<void> {
  let mode = await question('mode (full / cost / upgrade): ');
  let costMode = mode.startsWith('f') || mode.startsWith('c');
  let upgradeMode = mode.startsWith('f') || mode.startsWith('u');
  if (!costMode && !upgradeMode) {
    return main();
  }
  let productionRate!: number;
  if (costMode) {
    productionRate = parseValue(await question('production rate: ')) / 1000;
  }
  for (; ;) {
    if (costMode) {
      let target = parseValue(await question('target: '));
      if (!target) {
        break;
      }
      let timeNeeded = target / productionRate;
      console.log('> time needed:', format_time_duration(timeNeeded));
    }
    if (!upgradeMode) {
      continue;
    }
    let frequency = parseInt(await question('frequency per sec: '));
    if (!frequency) {
      break;
    }
    let effect = parseValue(await question('upgrade effect: '));
    let avgEffect = effect / (frequency);
    console.log('> average effect:', formatValue(avgEffect));
  }
  rl.close();
}

catchMain(main());
