import dotenv from 'dotenv';
dotenv.config();

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
  temp: number;
  wind: number;
  humidity: number;

  constructor(temp: number, wind: number, humidity: number) {
    this.temp = temp;
    this.wind = wind;
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
    private async fetchLocationData(cityName: string): Promise<any> {
      try{
        const response = await fetch(`${this.baseURL}/data/2.5/weather?q=${cityName}&appid=${this.apiKey}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch location data: ${response.statusText}`);
        }
        const locationData= await response.json();
        return locationData;
      } catch (error) {
        console.error('Error fetching location data: ', error);
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
        const coordinates = this.destructureLocationData(locationData);
        return coordinates;
      } catch (error) {
        console.error('Error fetching and destructuring location data:');
        throw error;
      }
    }
    // TODO: Create fetchWeatherData method - DONE
    private async fetchWeatherData(coordinates: Coordinates): Promise<Weather> {
      try {
        const weatherQueryUrl = this.buildWeatherQuery(coordinates);
        const response = await fetch(weatherQueryUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch weatehr data: ${response.statusText}`);
        }

        const weatherData = await response.json();
        const temp = weatherData.main.temp;
        const wind = weatherData.main.wind;
        const humidity = weatherData.main.humidity

        return new Weather(temp, wind, humidity);
    } catch (error) {
      console.error ('Error fetching weather data: 1', error);
      throw error;
    }
   }
  
  // TODO: Build parseCurrentWeather method - DONE
   private parseCurrentWeather(rawWeatherData: any): Weather {
    try { 
    const temp = rawWeatherData.main.temp;        // Adjust based on API's structure
    const wind = rawWeatherData.wind.speed;       // Adjust based on API's structure
    const humidity = rawWeatherData.main.humidity; // Adjust based on API's structure
    return new Weather(temp, wind, humidity);

  } catch (error) {
    console.error('Error parsing weather data: ', error);
    throw new Error('Failed to parse current weather data');

    }
   }


  // TODO: Complete buildForecastArray method
  // private buildForecastArray(currentWeather: Weather, weatherData: any[]) {}

  // TODO: Complete getWeatherForCity method
  // async getWeatherForCity(city: string) {}

  
export default new WeatherService();
