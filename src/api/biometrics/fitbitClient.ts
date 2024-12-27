import axios from 'axios';
import { PhysicalMetrics, SleepMetrics, CognitiveMetrics } from '../../types/biometrics';

const FITBIT_API_URL = 'https://api.fitbit.com/1/user/-';

export class FitbitClient {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  async getSleepData(startDate: Date, endDate: Date): Promise<SleepMetrics[]> {
    const response = await axios.get(`${FITBIT_API_URL}/sleep/date/${startDate.toISOString().split('T')[0]}/${endDate.toISOString().split('T')[0]}.json`, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });

    return response.data.sleep.map((sleep: any) => ({
      id: sleep.logId,
      createdAt: new Date(sleep.startTime),
      updatedAt: new Date(sleep.startTime),
      startTime: new Date(sleep.startTime),
      endTime: new Date(sleep.endTime),
      duration: sleep.duration / 1000, // Convert from ms to seconds
      deepSleep: sleep.levels.summary.deep.minutes * 60,
      remSleep: sleep.levels.summary.rem.minutes * 60,
      lightSleep: sleep.levels.summary.light.minutes * 60,
      awakeDuration: sleep.levels.summary.wake.minutes * 60,
      sleepScore: sleep.efficiency,
      restingHeartRate: sleep.restingHeartRate
    }));
  }

  async getPhysicalData(startDate: Date, endDate: Date): Promise<PhysicalMetrics[]> {
    const promises = [
      axios.get(`${FITBIT_API_URL}/activities/heart/date/${startDate.toISOString().split('T')[0]}/${endDate.toISOString().split('T')[0]}/1min.json`),
      axios.get(`${FITBIT_API_URL}/activities/date/${startDate.toISOString().split('T')[0]}.json`)
    ];

    const [heartData, activityData] = await Promise.all(promises.map(p => 
      p.then(res => res.data)
    ));

    return heartData['activities-heart'].map((day: any, index: number) => ({
      id: `${day.dateTime}-physical`,
      createdAt: new Date(day.dateTime),
      updatedAt: new Date(day.dateTime),
      hrv: day.value.restingHeartRate, // Fitbit doesn't provide HRV directly
      heartRate: day.value.restingHeartRate,
      steps: activityData.summary.steps,
      activeCalories: activityData.summary.activityCalories,
      respiratoryRate: day.value.respiratoryRate,
      recovery: day.value.restingHeartRate < 60 ? 85 : 70, // Simple recovery score estimation
      strain: activityData.summary.veryActiveMinutes > 60 ? 15 : 8 // Simple strain score estimation
    }));
  }

  async getStressData(startDate: Date, endDate: Date): Promise<CognitiveMetrics[]> {
    const response = await axios.get(`${FITBIT_API_URL}/activities/heart/date/${startDate.toISOString().split('T')[0]}/${endDate.toISOString().split('T')[0]}/1min.json`, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });

    return response.data['activities-heart'].map((day: any) => ({
      id: `${day.dateTime}-stress`,
      createdAt: new Date(day.dateTime),
      updatedAt: new Date(day.dateTime),
      stressLevel: calculateStressLevel(day.value.heartRateZones),
      mood: estimateMood(day.value.restingHeartRate, day.value.heartRateZones)
    }));
  }

  private calculateStressLevel(heartRateZones: any[]): number {
    // Implement stress level calculation based on time spent in different HR zones
    return 50; // Placeholder
  }

  private estimateMood(restingHR: number, heartRateZones: any[]): number {
    // Implement mood estimation based on HR patterns
    return 70; // Placeholder
  }
} 