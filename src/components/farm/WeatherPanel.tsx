import React, { useEffect, useState } from 'react';
import { TexasWeatherService, WeatherForecast } from '../../services/texasWeatherService';
import { MoonPhaseService } from '../../services/moonPhaseService';

export function WeatherPanel() {
  const [forecast, setForecast] = useState<WeatherForecast[]>([]);
  const [moonPhase, setMoonPhase] = useState(MoonPhaseService.getInstance().getCurrentPhase());

  useEffect(() => {
    const loadForecast = async () => {
      const weatherService = TexasWeatherService.getInstance();
      const forecast = await weatherService.getWeatherForecast(5);
      setForecast(forecast);
    };
    loadForecast();
  }, []);

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h2 className="font-pixel text-white mb-4">WEATHER & CONDITIONS</h2>

      {/* Moon Phase */}
      <div className="mb-4 bg-gray-700 rounded-lg p-3">
        <div className="flex items-center justify-between">
          <span className="text-gray-400 font-pixel">MOON PHASE</span>
          <span className="text-blue-300 font-pixel">
            {moonPhase.phase.toUpperCase()}
          </span>
        </div>
        <div className="mt-2 text-sm text-gray-500">
          Optimal for: {moonPhase.optimalActivities.join(', ')}
        </div>
      </div>

      {/* Weather Forecast */}
      <div className="space-y-2">
        {forecast.map((day, index) => (
          <div key={index} className="bg-gray-700 rounded-lg p-3">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-gray-400 font-pixel">
                  {formatDate(day.date)}
                </div>
                <div className="text-sm text-gray-500">
                  {day.condition}
                </div>
              </div>
              <div className="text-right">
                <div className="text-yellow-400 font-pixel">
                  {day.temperature.high}°F
                </div>
                <div className="text-blue-400 font-pixel">
                  {day.temperature.low}°F
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', { 
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  }).format(date);
} 