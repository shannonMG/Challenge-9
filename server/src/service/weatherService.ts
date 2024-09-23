import dotenv from 'dotenv';
dotenv.config();

// console.log('API KEY:', process.env.API_KEY);


// TODO: Define an interface for the Coordinates object - DONE
interface Coordinate {
  lat: number;
  lon: number;
}

interface Coordinates {
  latitude: number;
  longitude: number;
}
// TODO: Define a class for the Weather object - DONE
class Weather {
  city: string;
  date: string;
  icon: string;
  iconDescription: string;
  tempF: number;
  windSpeed: number;
  humidity: number;

  constructor(city:string, date:string, icon: string, iconDescription: string, tempF: number, windSpeed: number, humidity: number) {
    this.city = city;
    this.date = date;
    this.icon = icon;
    this.iconDescription = iconDescription;
    this.tempF = tempF;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
  }

}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties - DONE
  private apiKey: string;
  baseURL: string;
  cityName: string;

  constructor (baseURL: string, cityName: string) {
    this.apiKey = process.env.API_KEY || '';
    this.baseURL= baseURL;
    this.cityName = cityName;
    
  };
    // TODO: Create fetchLocationData method - DONE
    private async fetchLocationData(_cityName: string): Promise<Coordinate> {
      try {
        const geocodeQuery = this.buildGeocodeQuery();
        const response = await fetch(geocodeQuery);
    
        if (!response.ok) {
          throw new Error(`Failed to fetch location data: ${response.statusText}`);
        }
    
        const data = await response.json();
    
        if (Array.isArray(data) && data.length > 0) {
          const { lat, lon } = data[0]; 
          return { lat, lon }; 
        } else {
          throw new Error('No location data found for the specified city.');
        }
      } catch (error) {
        console.error('Error fetching location data:', error);
        throw error;
      }
    }
    // TODO: Create destructureLocationData method - DONE
    private destructureLocationData(locationData: Coordinate): Coordinates {
      const {lat, lon} = locationData;
      return {
        latitude: lat,
        longitude: lon
      };
    }
    // TODO: Create buildGeocodeQuery method - DONE
    private buildGeocodeQuery(): string {
      const endpoint = `${this.baseURL}/geo/1.0/direct`;
      const query = `?q=${encodeURIComponent(this.cityName)}&appid=${this.apiKey}`;
      return `${endpoint}${query}`
    } 
    // TODO: Create buildWeatherQuery method - DONE
    private buildWeatherQuery(coordinates: Coordinates): string {
      const endpoint = `${this.baseURL}/data/2.5/weather`;
      const query = `?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${this.apiKey}`;
      return `${endpoint}${query}`
    }
    // TODO: Create fetchAndDestructureLocationData method - DONE
    private async fetchAndDestructureLocationData(cityName: string): Promise<Coordinates> {
      try {
        
        const locationData = await this.fetchLocationData(cityName);
        
        return this.destructureLocationData(locationData); 
      } catch (error) {
        console.error('Error fetching and destructuring location data:', error);
        throw error;
      }
    }

    // TODO: Create fetchWeatherData method - DONE
    private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
        try {
          const weatherQueryUrl = this.buildWeatherQuery(coordinates);
          const response = await fetch(weatherQueryUrl);
          
          if (!response.ok) {
              throw new Error(`Failed to fetch weather data: ${response.statusText}`);
          }
  
          const rawWeatherData = await response.json(); // Get raw data
          console.log('Raw Weather Data:', rawWeatherData);
          return this.parseCurrentWeather(rawWeatherData); // Use parseCurrentWeather here
      } catch (error) {
          console.error('Error fetching weather data:', error);
          throw error;
      }
  }
  
  // TODO: Build parseCurrentWeather method - DONE
  private parseCurrentWeather(rawWeatherData: any): Weather {
    try {
      if (!rawWeatherData.main || typeof rawWeatherData.main.temp === 'undefined') {
        throw new Error('Missing temperature data');
      }
      const city = rawWeatherData.name
      const date = new Date(rawWeatherData.dt *1000).toLocaleDateString();
      const icon = rawWeatherData.weather[0].icon
      const iconDescription = rawWeatherData.weather[0].description
      const tempK = rawWeatherData.main.temp;
      const rawtempF = (tempK -273) * (9/5)+ 32;
      const tempF = Math.round(rawtempF * 10) / 10;
      const windSpeed = rawWeatherData.wind.speed;
      const humidity = rawWeatherData.main.humidity;

      return new Weather(city, date, icon, iconDescription, tempF, windSpeed, humidity);
    } catch (error) {
      console.error('Error parsing weather data:', error);
      throw new Error('Failed to parse current weather data');
    }
  }
  // TODO: Complete buildForecastArray method - DONE
  private buildForecastArray(weatherData: any[]) {
    const forecastArray: Weather [] = [];
    
    weatherData.forEach((data) => {
    const city = data.name
    const date = new Date(data.dt *1000).toLocaleDateString();
    const icon = data.weather[0].icon
    const iconDescription = data.weather[0].description
    const tempK = data.main.temp;    
    const rawtempF = (tempK -273) * (9/5)+ 32;
    const tempF = Math.round(rawtempF * 10) / 10;    
    const windSpeed = data.wind.speed;       
    const humidity = data.main.humidity; 
    const forecastWeather = new Weather(city,date, icon, iconDescription,tempF, windSpeed, humidity);
    forecastArray.push(forecastWeather);
  });
    return forecastArray;
  }

  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string): Promise<Weather[]> {
    try {
      this.cityName = city;
      
      if (!this.cityName) {
        throw new Error('City name is not set');
      }

      console.log(`Fetching data for city: ${this.cityName}`);
     
      const coordinates = await this.fetchAndDestructureLocationData(this.cityName);
     const parsedCurrentWeather = await this.fetchWeatherData(coordinates);
      
      const forecastQueryUrl = `${this.baseURL}/data/2.5/forecast?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${this.apiKey}`;
      const forecastResponse = await fetch(forecastQueryUrl);
      if (!forecastResponse.ok) {
        throw new Error(`Failed to fetch forecast data: ${forecastResponse.statusText}`);
      }

      const forecastData = await forecastResponse.json();
      const dailyData = forecastData.list.filter((_: any, index: number) => index% 8 === 0).slice(0,6);

      const forecastArray = this.buildForecastArray(dailyData);
      return [parsedCurrentWeather, ...forecastArray];

    } catch (error) {
      console.error('Error in getWeatherForCity:', error);
      throw new Error('Failed to get weather for city');
    }
  }
};
export default new WeatherService('https://api.openweathermap.org', 'San Diego');
