import { Router } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data - DONE
router.post('/', (req, res) => {
  const cityName = req.body.city;
  // TODO: GET weather data from city name - DONE
  try {
    const weatherData = await WeatherService.getWeather(cityName);
  // TODO: save city to search history - DONE
    await HistoryService.saveCity(cityName);
    res.status(200).json(weatherData)
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'Error when retrieving weather data'});
  }
});

// TODO: GET search history
router.get('/history', async (req, res) => {});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req, res) => {});

export default router;
