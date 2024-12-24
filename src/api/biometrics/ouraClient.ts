import axios from 'axios';
import { SleepMetrics, PhysicalMetrics } from '../../types/biometrics';

const OURA_API_URL = 'https://api.ouraring.com/v2';

export class OuraClient {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  async getSleepData(startDate: Date, endDate: Date): Promise<SleepMetrics[]> {
    const response = await axios.get(`${OURA_API_URL}/usercollection/daily_sleep`, {
      headers: {
        Authorization: `Bearer ${this.token}`
      },
      params: {
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0]
      }
    });

    return response.data.data.map((sleep: any) => ({
      id: sleep.id,
      createdAt: new Date(sleep.timestamp),
      updatedAt: new Date(sleep.timestamp),
      startTime: new Date(sleep.bedtime_start),
      endTime: new Date(sleep.bedtime_end),
      duration: sleep.duration,
      deepSleep: sleep.deep_sleep_duration,
      remSleep: sleep.rem_sleep_duration,
      lightSleep: sleep.light_sleep_duration,
      awakeDuration: sleep.awake_duration,
      hrv: sleep.hrv_samples,
      respiratoryRate: sleep.average_breath,
      restingHeartRate: sleep.lowest_heart_rate,
      sleepScore: sleep.score,
      temperature: sleep.temperature_delta,
      readiness: sleep.readiness_score
    }));
  }

  async getReadinessData(startDate: Date, endDate: Date): Promise<PhysicalMetrics[]> {
    const response = await axios.get(`${OURA_API_URL}/usercollection/daily_readiness`, {
      headers: {
        Authorization: `Bearer ${this.token}`
      },
      params: {
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0]
      }
    });

    return response.data.data.map((readiness: any) => ({
      id: readiness.id,
      createdAt: new Date(readiness.timestamp),
      updatedAt: new Date(readiness.timestamp),
      hrv: readiness.hrv_balance_score,
      recovery: readiness.score,
      temperature: readiness.temperature_deviation,
      restingHeartRate: readiness.resting_heart_rate
    }));
  }
} 