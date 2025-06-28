// components/weather-table.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Thermometer, Wind, Droplet, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import type { WeatherData } from "@/lib/weather";
import { montenegrinCities } from "@/lib/weather";

interface WeatherTableProps {
  initialWeatherData: Record<string, WeatherData>;
}

export default function WeatherTable({ initialWeatherData }: WeatherTableProps) {
  const [expanded, setExpanded] = useState(false);
  const [weatherData, setWeatherData] = useState<Record<string, WeatherData>>(initialWeatherData);
  const [isLoading, setIsLoading] = useState(false);

  const visibleCities = expanded ? montenegrinCities : montenegrinCities.slice(0, 2);

  useEffect(() => {
    const checkAndUpdateWeatherData = async () => {
      const cacheKey = 'weatherDataCache';
      const timestampKey = 'weatherDataLastUpdated';
      const threeHours = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
      const now = new Date().getTime();

      try {
        // Check if we have cached data and if it's still valid
        const cachedData = localStorage.getItem(cacheKey);
        const lastUpdated = localStorage.getItem(timestampKey);
        
        if (cachedData && lastUpdated && (now - parseInt(lastUpdated)) < threeHours) {
          // Use cached data if it's still fresh
          setWeatherData(JSON.parse(cachedData));
          return;
        }

        // Otherwise fetch new data
        setIsLoading(true);
        const response = await fetch('/api/weather');
        if (!response.ok) throw new Error('Failed to fetch weather data');
        
        const newData = await response.json();
        setWeatherData(newData);
        
        // Update cache
        localStorage.setItem(cacheKey, JSON.stringify(newData));
        localStorage.setItem(timestampKey, now.toString());
      } catch (error) {
        console.error('Failed to update weather data:', error);
        // Fall back to initial props if available
        if (initialWeatherData) {
          setWeatherData(initialWeatherData);
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAndUpdateWeatherData();
    
    // Set up interval to check periodically (every 30 minutes)
    const interval = setInterval(checkAndUpdateWeatherData, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [initialWeatherData]);

  return (
    <div className="mt-6 p-4 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Thermometer className="text-blue-500" /> Current Weather in Montenegro
        </h2>
        {isLoading && (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Updating weather data...
          </span>
        )}
      </div>

      <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">City</th>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Temp (°C)</th>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Feels Like (°C)</th>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Conditions</th>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Wind (km/h)</th>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Humidity (%)</th>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Last Updated</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {visibleCities.map((city) => {
              const cityWeather = weatherData[city.name];
              const feelsLikeTemp = cityWeather?.feelslike;
              const isHotWarning = feelsLikeTemp !== undefined && feelsLikeTemp > 32;

              return (
                <tr key={city.name} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {city.name}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    <div className="flex items-center gap-1">
                      <Thermometer size={16} className="text-gray-500 dark:text-gray-400" />
                      {cityWeather?.temp !== undefined ? cityWeather.temp.toFixed(1) : 'N/A'}
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    <div className={`flex items-center gap-1 ${isHotWarning ? 'text-red-600 dark:text-red-400 font-bold' : ''}`}>
                      {feelsLikeTemp !== undefined ? feelsLikeTemp.toFixed(1) : 'N/A'}
                      {isHotWarning && <AlertTriangle size={16} className="ml-1" />}
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    <div className="flex items-center gap-1">
                      {cityWeather?.icon && <img src={cityWeather.icon} alt={cityWeather.conditions} className="w-6 h-6 inline-block" />}
                      {cityWeather?.conditions || 'N/A'}
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    <div className="flex items-center gap-1">
                      <Wind size={16} className="text-gray-500 dark:text-gray-400" />
                      {cityWeather?.windSpeed !== undefined ? cityWeather.windSpeed.toFixed(0) : 'N/A'} ({cityWeather?.windDir || 'N/A'})
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    <div className="flex items-center gap-1">
                      <Droplet size={16} className="text-gray-500 dark:text-gray-400" />
                      {cityWeather?.humidity !== undefined ? cityWeather.humidity : 'N/A'}
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {cityWeather?.lastUpdated ? new Date(cityWeather.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {montenegrinCities.length > 2 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-4 flex items-center justify-center w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
        >
          {expanded ? (
            <>
              Show Less <ChevronUp className="ml-2 h-4 w-4" />
            </>
          ) : (
            <>
              Show More <ChevronDown className="ml-2 h-4 w-4" />
            </>
          )}
        </button>
      )}
    </div>
  );
}