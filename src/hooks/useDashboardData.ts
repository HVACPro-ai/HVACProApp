import { useState, useEffect } from 'react';
import { Task } from '@/src/types/Task';
import { getWeather, WeatherData } from '@/src/api/weatherApi';
import { getDashboardStats } from '../api/statsApi';
import { getRecentActivities } from '../api/activitiesApi';
import { getTodaysTasks } from '@/src/api/tasksApi';
import * as Location from 'expo-location';

export interface Weather {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
  location: string;
}

export interface DashboardStat {
  label: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
}

export interface Activity {
  id: string;
  type: 'service_call' | 'installation' | 'maintenance' | 'quote';
  description: string;
  timestamp: string;
  status: 'completed' | 'in_progress' | 'scheduled';
}

const MOCK_TASKS: Task[] = [
  {
    id: '1',
    title: 'AC Maintenance',
    description: 'Annual maintenance check for cooling system',
    dueDate: '2024-03-15',
    dueTime: '09:00',
    priority: 'high',
    status: 'pending',
    customerId: 'cust123',
    equipmentId: 'equip456'
  },
  {
    id: '2',
    title: 'Heat Pump Installation',
    description: 'New heat pump installation and setup',
    dueDate: '2024-03-15',
    dueTime: '13:30',
    priority: 'medium',
    status: 'pending',
    customerId: 'cust789',
    equipmentId: 'equip012'
  }
];

export function useDashboardData() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get location permission and current position
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission is required');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      
      // Load weather data and today's tasks
      const [weatherData, todaysTasks] = await Promise.all([
        getWeather(location.coords.latitude, location.coords.longitude),
        getTodaysTasks()
      ]);

      setWeather(weatherData);
      setTasks(todaysTasks);

      // Load stats data
      const statsData = await getDashboardStats();
      setStats(statsData);

      // Load activities data
      const activitiesData = await getRecentActivities();
      setActivities(activitiesData);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  return {
    tasks,
    weather,
    stats,
    activities,
    loading,
    error,
    refreshData: loadDashboardData,
  };
} 