import axios from 'axios';
import { BloodMetrics } from '../../types/biometrics';

const DEXCOM_API_URL = 'https://api.dexcom.com/v2';

export class DexcomClient {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  async getGlucoseData(startDate: Date, endDate: Date): Promise<BloodMetrics[]> {
    const response = await axios.get(`${DEXCOM_API_URL}/users/self/egvs`, {
      headers: {
        Authorization: `Bearer ${this.token}`
      },
      params: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      }
    });

    // Group readings by day
    const dailyReadings = response.data.records.reduce((acc: any, reading: any) => {
      const date = new Date(reading.systemTime).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(reading.value);
      return acc;
    }, {});

    return Object.entries(dailyReadings).map(([date, readings]: [string, number[]]) => ({
      id: `${date}-glucose`,
      createdAt: new Date(date),
      updatedAt: new Date(date),
      glucose: readings as number[],
      ketones: 0, // Dexcom doesn't provide ketone data
      lactate: 0, // Dexcom doesn't provide lactate data
      inflammation: calculateInflammation(readings as number[]),
      lipidPanel: {
        totalCholesterol: 0,
        ldl: 0,
        hdl: 0,
        triglycerides: 0
      },
      hormones: {
        cortisol: estimateCortisol(readings as number[]),
        testosterone: 0,
        igf1: 0,
        insulin: estimateInsulin(readings as number[])
      }
    }));
  }

  private calculateInflammation(glucoseReadings: number[]): number {
    // Estimate inflammation based on glucose variability
    const variance = calculateVariance(glucoseReadings);
    return Math.min(100, variance / 2);
  }

  private estimateCortisol(glucoseReadings: number[]): number {
    // Estimate cortisol based on morning glucose levels
    const morningReadings = glucoseReadings.slice(0, 4);
    return calculateAverage(morningReadings);
  }

  private estimateInsulin(glucoseReadings: number[]): number {
    // Estimate insulin levels based on glucose variability
    const variance = calculateVariance(glucoseReadings);
    return Math.min(100, variance);
  }

  private calculateVariance(numbers: number[]): number {
    const avg = calculateAverage(numbers);
    const squareDiffs = numbers.map(value => Math.pow(value - avg, 2));
    return calculateAverage(squareDiffs);
  }

  private calculateAverage(numbers: number[]): number {
    return numbers.reduce((a, b) => a + b, 0) / numbers.length;
  }
} 