// app/api/weather/route.ts
import { NextResponse } from 'next/server';
import { fetchAllCitiesWeather } from '@/lib/weather';

export const revalidate = 10800; // 3 hours in seconds

export async function GET() {
  try {
    const weatherData = await fetchAllCitiesWeather();
    return NextResponse.json(weatherData);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}