import { chromium } from 'playwright';
import 'dotenv/config';
import { addScoresToMovies, extractMediaScorecardJson, Movie } from './parse';
import { exportSingleMovieScoreToCSV } from './csv';
import { outputFilePath } from '.';

export async function scrapeMovies(movies: Movie[]) {
  // 1. Launch the browser
  const browser = await chromium.launch({ headless: process.env.IS_HEADLESS === 'true' });
  // Set headless to 'true' if you want the browser to run without UI

  // 2. Create a new page
  const page = await browser.newPage();

  // an array of movies information with scores
  const movieScoresOutput = [];

  for (const movie of movies) {
    console.log('Scraping', movie.movieTitle, movie.titleYear);

    const searchQuery = `${movie.movieTitle} ${movie.titleYear} Rotten Tomatoes`;

    // Use Google’s "I'm Feeling Lucky" to get the first result
    await page.goto(
      `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}&btnI`,
    );

    // Wait a random amount of time to avoid detection
    await page.waitForTimeout(3000 + Math.random() * 2000);

    // Click on redirect link

    await Promise.all([
      page.click('a'),
      page.waitForNavigation({ timeout: 20000 }),
    ]);

    // For rotten tomatoes pages we need to extract the scorecard
    if (page.url().includes('rottentomatoes')) {
      // get the html content, this is for cheerio
      const html = await page.content();

      const movieScores = extractMediaScorecardJson(html);
      const movieWithScores = addScoresToMovies(movieScores, movie);

      // Step 3: Write the scores to a CSV file
      exportSingleMovieScoreToCSV(outputFilePath, movieWithScores);

      movieScoresOutput.push(movieWithScores);      
      console.log('Finished scraping', movie.movieTitle, movie.titleYear);

      continue;
    }

    console.log(
      'No rotten tomatoes link found for',
      movie.movieTitle,
      movie.titleYear,
    );
    continue;
  }

  // Close the browser when done
  await browser.close();

  return movieScoresOutput;
}
