import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises'

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
      const cities: City[] = JSON.parse(data);
      return cities;
    } catch (error) {
      console.error('Error reading search history:', error);
      return [];
    }
   }
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]): Promise<void> {
    const filePath = 'searchHistory.json';
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
    try{
      const cities = await this.read();
      const newCity = new City(city.name, uuidv4());
      cities.push(newCity);
      await this.write(cities);
      console.log(`City "${city.name}" has been aded to the search history.`);

    }catch (error) {
      console.error('Error adding city:', error);
    }
   }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  // async removeCity(id: string) {}
}

export default new HistoryService('searchHistory.json');
