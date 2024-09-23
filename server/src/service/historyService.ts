import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises'
import path from 'path'; // imports path module
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// TODO: Define a City class with name and id properties - DONE
class City {
  name: string;
  id: string;

  constructor (name: string, id: string) {
    this.name = name;
    this.id = id;
  }
}
// TODO: Complete the HistoryService class
class HistoryService {
  private filePath: string;

  constructor(filePath: string){
    this.filePath = filePath;
  }

  // TODO: Define a read method that reads from the searchHistory.json file
   private async read(): Promise<City[]> {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      if (!data) {
        return[];}
        
      const cities: City[] = JSON.parse(data);
      return cities;
    } catch (error) {
      console.error('Error reading search history:', error);
      return [];
    }
   }
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]): Promise<void> {
    const filePath = this.filePath;
    
    try{
      const jsonData = JSON.stringify(cities, null, 2);
      await fs.writeFile(filePath, jsonData, 'utf8');
      console.log('File has been written successfully');
    } catch (error) {
      console.error('Error writing file: ', error);
    }

  }
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
   async getCities(): Promise<City[]> {
    try {
      const cities = await this.read();
      return cities;
    } catch (error) {
      console.error('Error getting cities:', error);
      return [];
    }
   }

  // TODO Define an addCity method that adds a city to the searchHistory.json file
   async addCity(city: City): Promise<void> {
    try {
      const cities = await this.read();
      const cityExists = cities.some(existingCity => existingCity.name.toLowerCase() === city.name.toLowerCase());
  
      if (cityExists) {
        console.log(`City "${city.name}" already exists in the search history.`);
        return; 
      }
      const newCity = new City(city.name, uuidv4());
      cities.push(newCity);
      await this.write(cities);
      console.log(`City "${city.name}" has been added to the search history.`);
    } catch (error) {
      console.error('Error adding city:', error);
    }
  }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string): Promise<void> {
    const filePath = path.join(__dirname, '../../searchHistory.json');
    const data = await fs.readFile(filePath, 'utf8');
    let cities: City[] = JSON.parse(data);
    
    // Filter out the city with the matching name (case insensitive)
    cities = cities.filter((city: City) => city.id !== id);
  
    await fs.writeFile(filePath, JSON.stringify(cities, null, 2), 'utf8');
  }
}

export default new HistoryService('searchHistory.json');
