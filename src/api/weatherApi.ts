import { ENV } from '../config/env';
const API_KEY = ENV.WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export interface WeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
  location: string;
}

export const getWeather = async (latitude: number, longitude: number): Promise<WeatherData> => {
  try {
    const url = `${BASE_URL}/weather?lat=${latitude}&lon=${longitude}&units=imperial&appid=${API_KEY}`;
    
    const response = await fetch(url);
    const responseText = await response.text();
    
    if (!response.ok) {
      throw new Error(`Weather API failed: ${responseText}`);
    }

    const data = JSON.parse(responseText);
    return {
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed),
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      location: data.name,
    };
  } catch (error) {
    console.error('Detailed weather error:', error);
    throw error;
  }
}; 