import axios from 'axios';
import { PhysicalMetrics } from '../../types/biometrics';

const WHOOP_API_URL = 'https://api.whoop.com/v2';

export class WhoopClient {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  async getRecoveryData(startDate: Date, endDate: Date): Promise<PhysicalMetrics[]> {
    const response = await axios.get(`${WHOOP_API_URL}/cycles`, {
      headers: {
        Authorization: `Bearer ${this.token}`
      },
      params: {
        start: startDate.toISOString(),
        end: endDate.toISOString()
      }
    });

    return response.data.cycles.map((cycle: any) => ({
      id: cycle.id,
      createdAt: new Date(cycle.created_at),
      updatedAt: new Date(cycle.updated_at),
      hrv: cycle.recovery.hrv_rmssd,
      recovery: cycle.recovery.score,
      strain: cycle.strain.score,
      restingHeartRate: cycle.recovery.resting_heart_rate
    }));
  }
} 