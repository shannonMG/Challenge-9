import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

const router = Router();

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req, res): Promise<void> => { 
  try {
    const { cityName: city } = req.body
    
    const weatherData = await WeatherService.getWeatherForCity(city);

    await HistoryService.addCity({ name: city, id: uuidv4() });
    res.status(200).json( weatherData );

  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).json({ error: 'Failed to retrieve weather data' });
  }
});


// TODO: GET search history
router.get('/history', async (__, res) => {
  try {
    const searchHistory = await HistoryService.getCities();

    res.status(200).json(searchHistory);
  } catch (error) {
    console.error('Error retrieving search history:', error);
    res.status(500).json({ error: 'Failed to retrieve search history' });
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`DELETE request received for city with ID: ${id}`);
  try {
    await HistoryService.removeCity(id);
    res.status(200).json({ message: `City with ID ${id} has been removed from history.` });
  } catch (error) {
    console.error('Error removing city:', error);
    res.status(500).json({ message: 'Error removing city from history.' });
  }
});

export default router;

