import execa from 'execa';
import { EventEmitter } from 'events';
import { BatteryStatus } from './BatteryStatus';

const ON_AC_POWER = "Now drawing from 'AC Power'";
const ON_BATTERY_POWER = "Now drawing from 'UPS Power'";

export async function getBatteryStatus(): Promise<BatteryStatus> {
  const { stdout } = await execa('pmset', ['-g', 'batt']);
  const status = extractStatus(stdout);
  verifyStatus(status);
  return status;
}

function verifyStatus(status: BatteryStatus): void {
  if (status.isOnACPower && status.isOnUPSPower || !status.isOnACPower && !status.isOnUPSPower) {
    throw new Error('Battery status is invalid');
  }
}

export async function isOnAc(): Promise<boolean> {
  const status = await getBatteryStatus();
  return status.isOnACPower && !status.isOnUPSPower;
}

export async function isOnBattery(): Promise<boolean> {
  const status = await getBatteryStatus();
  return !status.isOnACPower && status.isOnUPSPower;
}

function extractStatus(batteryStatus: string): BatteryStatus {
  const isOnACPower = batteryStatus.includes(ON_AC_POWER);
  const isOnUPSPower = batteryStatus.includes(ON_BATTERY_POWER);
  return { isOnACPower, isOnUPSPower };
}

export class UpsEmitter extends EventEmitter {
  isOnACPower = true;
  private pslogProcess: execa.ExecaChildProcess<string>;

  constructor() {
    super();
    const pslog = this.pslogProcess = execa('pmset', ['-g', 'pslog'], {
      buffer: false,
    });

    if (pslog && pslog instanceof Error) {
      throw pslog;
    }

    if (pslog.stdout != null) {
      pslog.stdout.on('data', (data) => {
        const text = data.toString();

        for (const line of text.split('\n')) {
          if (line.includes(ON_AC_POWER)) {
            this.emit('ac', true);
            this.isOnACPower = true;
            break;
          }

          if (line.includes(ON_BATTERY_POWER)) {
            this.emit('ac', false);
            this.isOnACPower = false;
            break;
          }
        }
      });
    }
  }

  stop(): void {
    this.pslogProcess.cancel();
  }
}
