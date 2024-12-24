import axios from 'axios';
import { BloodMetrics } from '../../types/biometrics';

const BIOSENSE_API_URL = 'https://api.mybiosense.com/v1';

export class BiosenseClient {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  async getKetoneData(startDate: Date, endDate: Date): Promise<BloodMetrics[]> {
    const response = await axios.get(`${BIOSENSE_API_URL}/measurements`, {
      headers: {
        Authorization: `Bearer ${this.token}`
      },
      params: {
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString()
      }
    });

    // Group readings by day
    const dailyReadings = response.data.measurements.reduce((acc: any, reading: any) => {
      const date = new Date(reading.timestamp).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = [];
      }
      // Convert ACEs (Biosense's proprietary unit) to mmol/L equivalent
      acc[date].push(reading.ace_value * 0.1);
      return acc;
    }, {});

    return Object.entries(dailyReadings).map(([date, readings]: [string, number[]]) => ({
      id: `${date}-ketones`,
      createdAt: new Date(date),
      updatedAt: new Date(date),
      glucose: [], // Biosense doesn't measure glucose
      ketones: calculateAverageKetones(readings as number[]),
      lactate: 0,
      inflammation: estimateInflammation(readings as number[]),
      lipidPanel: {
        totalCholesterol: 0,
        ldl: 0,
        hdl: 0,
        triglycerides: 0
      },
      hormones: {
        cortisol: 0,
        testosterone: 0,
        igf1: 0,
        insulin: estimateInsulinFromKetones(readings as number[])
      }
    }));
  }

  private calculateAverageKetones(readings: number[]): number {
    return readings.reduce((a, b) => a + b, 0) / readings.length;
  }

  private estimateInflammation(ketoneReadings: number[]): number {
    // Higher ketones generally indicate lower inflammation
    const avgKetones = this.calculateAverageKetones(ketoneReadings);
    // Scale from 0-100 where higher ketones = lower inflammation
    return Math.max(0, 100 - (avgKetones * 20));
  }

  private estimateInsulinFromKetones(ketoneReadings: number[]): number {
    // Higher ketones generally indicate lower insulin levels
    const avgKetones = this.calculateAverageKetones(ketoneReadings);
    // Scale from 0-100 where higher ketones = lower insulin
    return Math.max(0, 100 - (avgKetones * 25));
  }
} 