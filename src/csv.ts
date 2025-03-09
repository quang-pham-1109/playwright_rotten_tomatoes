import { Movie, MovieWithScores } from './parse';
import * as fs from 'fs';
import csv from 'csv-parser';

// Function to read the CSV and return an array of Movie objects
export const readMoviesFromCSV = (filePath: string): Promise<Movie[]> => {
  return new Promise((resolve, reject) => {
    const movies: Movie[] = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        // Map each row to the Movie interface
        const movie: Movie = {
          movieTitle: String(row.movie_title).trim(), // Trim whitespace from the movieTitle
          titleYear: parseInt(row.title_year), // Convert year to number
        };
        movies.push(movie);
      })
      .on('end', () => {
        resolve(movies); // Resolve with the array of movies
      })
      .on('error', (err) => {
        reject(err); // Reject if there's an error
      });
  });
};

// Function to export movie scores to a CSV
export const exportMovieScoresToCSV = (
  outputFilePath: string,
  movies: MovieWithScores[],
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const header = [
      'movie_title',
      'title_year',
      'audience_score',
      'critics_score',
    ];

    // Create the writable stream
    const writeStream = fs.createWriteStream(outputFilePath);

    // Write the header first
    writeStream.write(header.join(',') + '\n');

    // Iterate over the movies array and write each movie's data to the CSV
    movies.forEach((movie) => {
      const movieData = [
        movie.movieTitle,
        movie.titleYear,
        movie.audienceScore !== null ? movie.audienceScore : '', // Ensure null values are empty
        movie.criticsScore !== null ? movie.criticsScore : '', // Ensure null values are empty
      ];
      writeStream.write(movieData.join(',') + '\n');
    });

    // Finish writing to the file
    writeStream.end();

    // Handle success or errors during the write operation
    writeStream.on('finish', () => {
      console.log('CSV file was written successfully');
      resolve();
    });

    writeStream.on('error', (err) => {
      console.error('Error writing CSV file:', err);
      reject(err);
    });
  });
};

export const exportSingleMovieScoreToCSV = (
  outputFilePath: string,
  movie: MovieWithScores
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const header = 'movie_title,title_year,audience_score,critics_score\n';
    const movieData = `${movie.movieTitle},${movie.titleYear},${movie.audienceScore ?? ''},${movie.criticsScore ?? ''}\n`;

    // Check if file exists to determine if we need to add the header
    const fileExists = fs.existsSync(outputFilePath);

    // Open file in append mode, create if it doesn’t exist
    const writeStream = fs.createWriteStream(outputFilePath, { flags: 'a' });

    // If file does not exist, write header first
    if (!fileExists) {
      writeStream.write(header);
    }

    // Write the movie data to the CSV
    writeStream.write(movieData);

    // Finish writing
    writeStream.end();

    // Handle completion or errors
    writeStream.on('finish', () => {
      console.log(`Added movie: ${movie.movieTitle} (${movie.titleYear}) to CSV.`);
      resolve();
    });

    writeStream.on('error', (err) => {
      console.error('Error writing to CSV file:', err);
      reject(err);
    });
  });
};
