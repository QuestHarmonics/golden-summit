import { OuraClient } from '../../api/biometrics/ouraClient';
import { WhoopClient } from '../../api/biometrics/whoopClient';
import { AppleHealthClient } from '../../api/biometrics/appleHealthClient';
import { GarminClient } from '../../api/biometrics/garminClient';
import { FitbitClient } from '../../api/biometrics/fitbitClient';
import { DexcomClient } from '../../api/biometrics/dexcomClient';
import { useBiometricsStore } from '../../store/biometricsStore';
import { MetricSource } from '../../types/biometrics';

export class BiometricDeviceService {
  private clients: {
    oura?: OuraClient;
    whoop?: WhoopClient;
    appleHealth?: AppleHealthClient;
    garmin?: GarminClient;
    fitbit?: FitbitClient;
    dexcom?: DexcomClient;
  } = {};

  private store = useBiometricsStore.getState();

  constructor() {
    this.initializeClients();
  }

  private initializeClients() {
    const tokens = {
      oura: localStorage.getItem('oura_token'),
      whoop: localStorage.getItem('whoop_token'),
      garmin: localStorage.getItem('garmin_token'),
      fitbit: localStorage.getItem('fitbit_token'),
      dexcom: localStorage.getItem('dexcom_token'),
      useAppleHealth: localStorage.getItem('use_apple_health') === 'true'
    };

    if (tokens.oura) this.clients.oura = new OuraClient(tokens.oura);
    if (tokens.whoop) this.clients.whoop = new WhoopClient(tokens.whoop);
    if (tokens.garmin) this.clients.garmin = new GarminClient(tokens.garmin);
    if (tokens.fitbit) this.clients.fitbit = new FitbitClient(tokens.fitbit);
    if (tokens.dexcom) this.clients.dexcom = new DexcomClient(tokens.dexcom);
    if (tokens.useAppleHealth) this.clients.appleHealth = new AppleHealthClient();
  }

  async syncData(startDate: Date, endDate: Date) {
    const promises = [];

    // Oura sync
    if (this.clients.oura) {
      promises.push(
        this.clients.oura.getSleepData(startDate, endDate)
          .then(metrics => this.addMetricsWithSource(metrics, 'SLEEP', 'OURA')),
        this.clients.oura.getReadinessData(startDate, endDate)
          .then(metrics => this.addMetricsWithSource(metrics, 'PHYSICAL', 'OURA'))
      );
    }

    // Whoop sync
    if (this.clients.whoop) {
      promises.push(
        this.clients.whoop.getRecoveryData(startDate, endDate)
          .then(metrics => this.addMetricsWithSource(metrics, 'PHYSICAL', 'WHOOP'))
      );
    }

    // Fitbit sync
    if (this.clients.fitbit) {
      promises.push(
        this.clients.fitbit.getSleepData(startDate, endDate)
          .then(metrics => this.addMetricsWithSource(metrics, 'SLEEP', 'FITBIT')),
        this.clients.fitbit.getPhysicalData(startDate, endDate)
          .then(metrics => this.addMetricsWithSource(metrics, 'PHYSICAL', 'FITBIT')),
        this.clients.fitbit.getStressData(startDate, endDate)
          .then(metrics => this.addMetricsWithSource(metrics, 'COGNITIVE', 'FITBIT'))
      );
    }

    // Dexcom sync
    if (this.clients.dexcom) {
      promises.push(
        this.clients.dexcom.getGlucoseData(startDate, endDate)
          .then(metrics => this.addMetricsWithSource(metrics, 'BLOOD', 'DEXCOM'))
      );
    }

    // Apple Health sync
    if (this.clients.appleHealth) {
      promises.push(
        this.clients.appleHealth.getSleepData(startDate, endDate)
          .then(metrics => this.addMetricsWithSource(metrics, 'SLEEP', 'APPLE_HEALTH')),
        this.clients.appleHealth.getPhysicalData(startDate, endDate)
          .then(metrics => this.addMetricsWithSource(metrics, 'PHYSICAL', 'APPLE_HEALTH')),
        this.clients.appleHealth.getBloodMetrics(startDate, endDate)
          .then(metrics => this.addMetricsWithSource(metrics, 'BLOOD', 'APPLE_HEALTH'))
      );
    }

    // Garmin sync
    if (this.clients.garmin) {
      promises.push(
        this.clients.garmin.getSleepData(startDate, endDate)
          .then(metrics => this.addMetricsWithSource(metrics, 'SLEEP', 'GARMIN')),
        this.clients.garmin.getPhysicalData(startDate, endDate)
          .then(metrics => this.addMetricsWithSource(metrics, 'PHYSICAL', 'GARMIN'))
      );
    }

    try {
      await Promise.all(promises);
    } catch (error) {
      console.error('Error syncing device data:', error);
      throw error;
    }
  }

  private addMetricsWithSource(metrics: any[], type: string, source: MetricSource) {
    metrics.forEach(metric => {
      const metricWithSource = { ...metric, source };
      switch (type) {
        case 'SLEEP':
          this.store.addSleepMetrics(metricWithSource);
          break;
        case 'PHYSICAL':
          this.store.addPhysicalMetrics(metricWithSource);
          break;
        case 'COGNITIVE':
          this.store.addCognitiveMetrics(metricWithSource);
          break;
        case 'BLOOD':
          this.store.addBloodMetrics(metricWithSource);
          break;
      }
    });
  }
} 