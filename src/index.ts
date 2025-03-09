import { readMoviesFromCSV } from './csv';
import { Movie } from './parse';
import { scrapeMovies } from './scrape';

// Path to your CSV file
const filePath = 'assets/movie_metadata.csv';
export const outputFilePath = 'output/movie_scores.csv';

// Step 1: Read the CSV file and get an array of movies
readMoviesFromCSV(filePath)
  .then(async (movies: Movie[]) => {
    // Step 2: Pass the array of movies to the scrape function
    await scrapeMovies(movies);

    console.log('Finished scraping.');
  })
  .catch((err) => {
    console.error('Error reading CSV file:', err);
  });
