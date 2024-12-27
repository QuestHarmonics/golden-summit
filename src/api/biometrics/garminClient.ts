import axios from 'axios';
import { PhysicalMetrics, SleepMetrics } from '../../types/biometrics';

const GARMIN_API_URL = 'https://apis.garmin.com/wellness-api/rest';

export class GarminClient {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  async getSleepData(startDate: Date, endDate: Date): Promise<SleepMetrics[]> {
    const response = await axios.get(`${GARMIN_API_URL}/sleep`, {
      headers: {
        Authorization: `Bearer ${this.token}`
      },
      params: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      }
    });

    return response.data.sleeps.map((sleep: any) => ({
      id: sleep.summaryId,
      createdAt: new Date(sleep.startTimeInSeconds * 1000),
      updatedAt: new Date(sleep.startTimeInSeconds * 1000),
      startTime: new Date(sleep.startTimeInSeconds * 1000),
      endTime: new Date((sleep.startTimeInSeconds + sleep.durationInSeconds) * 1000),
      duration: sleep.durationInSeconds,
      deepSleep: sleep.deepSleepDurationInSeconds,
      remSleep: sleep.remSleepInSeconds,
      lightSleep: sleep.lightSleepDurationInSeconds,
      awakeDuration: sleep.awakeDurationInSeconds,
      sleepScore: sleep.sleepScoreInPoints,
      restingHeartRate: sleep.averageRestingHeartRateInBeatsPerMinute
    }));
  }

  async getPhysicalData(startDate: Date, endDate: Date): Promise<PhysicalMetrics[]> {
    const response = await axios.get(`${GARMIN_API_URL}/dailies`, {
      headers: {
        Authorization: `Bearer ${this.token}`
      },
      params: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      }
    });

    return response.data.dailies.map((daily: any) => ({
      id: daily.summaryId,
      createdAt: new Date(daily.calendarDate),
      updatedAt: new Date(daily.calendarDate),
      hrv: daily.averageHeartRateVariabilityInMilliseconds,
      heartRate: daily.averageHeartRateInBeatsPerMinute,
      steps: daily.totalSteps,
      activeCalories: daily.activeKilocalories,
      bloodOxygen: daily.averageSpO2Value,
      respiratoryRate: daily.averageRespirationInBreathsPerMinute
    }));
  }
} 