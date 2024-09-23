import dotenv from 'dotenv';

dotenv.config();
// TODO: Define a class for the Weather object - DONE
class Weather {
    constructor(temp, wind, humidity) {
        this.temp = temp;
        this.wind = wind;
        this.humidity = humidity;
    }
}
// TODO: Complete the WeatherService class
class WeatherService {
    constructor(baseURL, cityName) {
        this.apiKey = process.env.API_KEY || '';
        this.baseURL = baseURL;
        this.cityName = cityName;
    }
    ;
    // TODO: Create fetchLocationData method - DONE
    async fetchLocationData(_cityName) {
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
            }
            else {
                throw new Error('No location data found for the specified city.');
            }
        }
        catch (error) {
            console.error('Error fetching location data:', error);
            throw error;
        }
    }
    // TODO: Create destructureLocationData method - DONE
    destructureLocationData(locationData) {
        const { lat, lon } = locationData;
        return {
            latitude: lat,
            longitude: lon
        };
    }
    // TODO: Create buildGeocodeQuery method - DONE
    buildGeocodeQuery() {
        const endpoint = `${this.baseURL}/geo/1.0/direct`;
        const query = `?q=${encodeURIComponent(this.cityName)}&appid=${this.apiKey}`;
        return `${endpoint}${query}`;
    }
    // TODO: Create buildWeatherQuery method - DONE
    buildWeatherQuery(coordinates) {
        const endpoint = `${this.baseURL}/data/2.5/weather`;
        const query = `?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${this.apiKey}`;
        return `${endpoint}${query}`;
    }
    // TODO: Create fetchAndDestructureLocationData method - DONE
    async fetchAndDestructureLocationData(cityName) {
        try {
            const locationData = await this.fetchLocationData(cityName);
            return this.destructureLocationData(locationData);
        }
        catch (error) {
            console.error('Error fetching and destructuring location data:', error);
            throw error;
        }
    }
    // TODO: Create fetchWeatherData method - DONE
    async fetchWeatherData(coordinates) {
        try {
            const weatherQueryUrl = this.buildWeatherQuery(coordinates);
            const response = await fetch(weatherQueryUrl);
            if (!response.ok) {
                throw new Error(`Failed to fetch weather data: ${response.statusText}`);
            }
            const weatherData = await response.json();
            const temp = weatherData.main.temp;
            const wind = weatherData.main.wind;
            const humidity = weatherData.main.humidity;
            return new Weather(temp, wind, humidity);
        }
        catch (error) {
            console.error('Error fetching weather data: 1', error);
            throw error;
        }
    }
    // TODO: Build parseCurrentWeather method - DONE
    parseCurrentWeather(rawWeatherData) {
        try {
            const temp = rawWeatherData.main.temp;
            const wind = rawWeatherData.wind.speed;
            const humidity = rawWeatherData.main.humidity;
            return new Weather(temp, wind, humidity);
        }
        catch (error) {
            console.error('Error parsing weather data: ', error);
            throw new Error('Failed to parse current weather data');
        }
    }
    // TODO: Complete buildForecastArray method - DONE
    buildForecastArray(weatherData) {
        const forecastArray = [];
        weatherData.forEach((data) => {
            const temp = data.main.temp;
            const wind = data.wind.speed;
            const humidity = data.main.humidity;
            const forecastWeather = new Weather(temp, wind, humidity);
            forecastArray.push(forecastWeather);
        });
        return forecastArray;
    }
    // TODO: Complete getWeatherForCity method
    async getWeatherForCity(city) {
        try {
            this.cityName = city;
            if (!this.cityName) {
                throw new Error('City name is not set');
            }
            console.log(`Fetching data for city: ${this.cityName}`);
            const coordinates = await this.fetchAndDestructureLocationData(this.cityName);
            const rawWeatherData = await this.fetchWeatherData(coordinates);
            const parsedCurrentWeather = this.parseCurrentWeather(rawWeatherData);
            const forecastQueryUrl = `${this.baseURL}/data/2.5/forecast?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${this.apiKey}`;
            const forecastResponse = await fetch(forecastQueryUrl);
            if (!forecastResponse.ok) {
                throw new Error(`Failed to fetch forecast data: ${forecastResponse.statusText}`);
            }
            const forecastData = await forecastResponse.json();
            const dailyData = forecastData.list.filter((_, index) => index % 8 === 0).slice(0, 6);
            const forecastArray = this.buildForecastArray(dailyData);
            return [parsedCurrentWeather, ...forecastArray];
        }
        catch (error) {
            console.error('Error in getWeatherForCity:', error);
            throw new Error('Failed to get weather for city');
        }
    }
}
;
export default new WeatherService('https://api.openweathermap.org', 'San Diego');
