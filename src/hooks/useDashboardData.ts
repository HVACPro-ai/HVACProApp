import { useState, useEffect } from 'react';
import { getWeather } from '@/src/api/weatherApi';
import { getDashboardStats } from '@/src/api/statsApi';
import { getRecentActivities } from '@/src/api/activitiesApi';
import { getTodaysTasks } from '@/src/api/tasksApi';

export interface Weather {
  temperature: number;
  condition: string;
  icon: string;
  high: number;
  low: number;
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

export interface Task {
  id: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  dueTime: string;
  status: 'pending' | 'in_progress' | 'completed';
  type: 'service_call' | 'installation' | 'maintenance' | 'quote';
}

export function useDashboardData() {
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [weatherData, statsData, activitiesData, tasksData] = await Promise.all([
        getWeather(),
        getDashboardStats(),
        getRecentActivities(),
        getTodaysTasks(),
      ]);

      setWeather(weatherData);
      setStats(statsData);
      setActivities(activitiesData);
      setTasks(tasksData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const refreshData = () => {
    loadData();
  };

  return {
    weather,
    stats,
    activities,
    tasks,
    loading,
    refreshData,
  };
} 