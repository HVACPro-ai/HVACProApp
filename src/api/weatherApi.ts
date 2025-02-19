export const getWeather = async () => {
  // Simulated API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    temperature: 72,
    condition: 'Partly Cloudy',
    icon: 'partly-cloudy',
    high: 78,
    low: 65,
  };
}; 