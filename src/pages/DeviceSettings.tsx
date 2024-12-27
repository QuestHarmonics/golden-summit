import { useState, useEffect } from 'react';
import { BiometricDeviceService } from '../services/biometrics/deviceIntegration';
import { MetricSource } from '../types/biometrics';

interface DeviceConnection {
  source: MetricSource;
  isConnected: boolean;
  lastSync?: Date;
  token?: string;
}

export function DeviceSettings() {
  const [connections, setConnections] = useState<DeviceConnection[]>([]);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    loadDeviceConnections();
  }, []);

  const loadDeviceConnections = () => {
    const sources: MetricSource[] = [
      'OURA', 'WHOOP', 'APPLE_HEALTH', 'GARMIN', 
      'FITBIT', 'DEXCOM', 'BIOSENSE', 'LEVELS'
    ];

    const deviceConnections = sources.map(source => ({
      source,
      isConnected: !!localStorage.getItem(`${source.toLowerCase()}_token`),
      lastSync: new Date(localStorage.getItem(`${source.toLowerCase()}_last_sync`) || 0)
    }));

    setConnections(deviceConnections);
  };

  const handleConnect = async (source: MetricSource) => {
    try {
      // Implement OAuth flow for each device
      const token = await initiateOAuth(source);
      if (token) {
        localStorage.setItem(`${source.toLowerCase()}_token`, token);
        loadDeviceConnections();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setErrorMessage(`Failed to connect to ${source}: ${errorMessage}`);
    }
  };

  const handleDisconnect = (source: MetricSource) => {
    localStorage.removeItem(`${source.toLowerCase()}_token`);
    loadDeviceConnections();
  };

  const handleSync = async () => {
    setSyncStatus('syncing');
    setErrorMessage('');

    try {
      const service = new BiometricDeviceService();
      const endDate = new Date();
      const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000); // Last 7 days
      await service.syncData(startDate, endDate);
      
      connections.forEach(conn => {
        if (conn.isConnected) {
          localStorage.setItem(`${conn.source.toLowerCase()}_last_sync`, new Date().toISOString());
        }
      });
      
      loadDeviceConnections();
      setSyncStatus('idle');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setErrorMessage(`Sync failed: ${errorMessage}`);
      setSyncStatus('error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Device Connections</h1>
        <button
          onClick={handleSync}
          disabled={syncStatus === 'syncing'}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {syncStatus === 'syncing' ? 'Syncing...' : 'Sync All Devices'}
        </button>
      </div>

      {errorMessage && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {errorMessage}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {connections.map(({ source, isConnected, lastSync }) => (
          <div key={source} className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium">{source}</h3>
                <p className="text-sm text-gray-500">
                  {isConnected 
                    ? `Last synced: ${lastSync?.toLocaleString() || 'Never'}`
                    : 'Not connected'}
                </p>
              </div>
              <button
                onClick={() => isConnected ? handleDisconnect(source) : handleConnect(source)}
                className={`px-3 py-1 rounded-lg ${
                  isConnected 
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                {isConnected ? 'Disconnect' : 'Connect'}
              </button>
            </div>
            
            {isConnected && (
              <div className="text-sm text-gray-600">
                <h4 className="font-medium mb-2">Available Metrics:</h4>
                <ul className="list-disc list-inside">
                  {getAvailableMetrics(source).map(metric => (
                    <li key={metric}>{metric}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function getAvailableMetrics(source: MetricSource): string[] {
  switch (source) {
    case 'OURA':
      return ['Sleep', 'Readiness', 'Activity', 'HRV'];
    case 'WHOOP':
      return ['Recovery', 'Strain', 'Sleep', 'HRV'];
    case 'APPLE_HEALTH':
      return ['Sleep', 'Activity', 'Heart Rate', 'Blood Oxygen'];
    case 'GARMIN':
      return ['Sleep', 'Activity', 'Heart Rate', 'Stress'];
    case 'FITBIT':
      return ['Sleep', 'Activity', 'Heart Rate', 'Stress'];
    case 'DEXCOM':
      return ['Glucose'];
    case 'BIOSENSE':
      return ['Ketones'];
    case 'LEVELS':
      return ['Glucose', 'Metabolic Score'];
    default:
      return [];
  }
}

async function initiateOAuth(source: MetricSource): Promise<string | null> {
  // Basic OAuth implementation
  const oauthUrls: Record<MetricSource, string> = {
    OURA: 'https://cloud.ouraring.com/oauth/authorize',
    WHOOP: 'https://api.whoop.com/oauth/authorize',
    APPLE_HEALTH: 'app-specific-auth',
    GARMIN: 'https://connect.garmin.com/oauthConfirm',
    FITBIT: 'https://www.fitbit.com/oauth2/authorize',
    DEXCOM: 'https://api.dexcom.com/v2/oauth2/login',
    BIOSENSE: 'https://api.biosense.com/oauth2/authorize',
    LEVELS: 'https://api.levelshealth.com/auth',
    MANUAL: 'manual-entry'
  };

  try {
    window.open(oauthUrls[source], '_blank');
    return 'dummy-token'; // Replace with actual OAuth flow
  } catch (error) {
    console.error(`OAuth failed for ${source}:`, error);
    return null;
  }
} 