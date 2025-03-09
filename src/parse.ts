import * as cheerio from 'cheerio';

// Define the Movie interface
export interface Movie {
  movieTitle: string;
  titleYear: number;
}

export interface MovieScores {
  audienceScore: number | null;
  criticsScore: number | null;
}

export interface MovieWithScores extends Movie, MovieScores {}

/**
 * Extracts audience and critic scores from a Rotten Tomatoes score object.
 *
 * @param data - The Rotten Tomatoes score object.
 * @returns An object containing `audienceScore` and `criticsScore`.
 */
const extractScores = (
  data: any,
): { audienceScore: number | null; criticsScore: number | null } => {
  try {
    // Extract audience and critic scores if they exist
    const audienceScore = data.audienceAll?.score || null;
    const criticsScore = data.criticsAll?.score || null;

    return { audienceScore, criticsScore };
  } catch (error) {
    console.error('Error extracting scores:', error);
    return { audienceScore: null, criticsScore: null };
  }
};

/**
 * Extracts the JSON data inside <media-scorecard-manager> from an HTML string.
 *
 * @param htmlString - The HTML content as a string.
 * @returns Parsed JSON object if found, otherwise null.
 */
export const extractMediaScorecardJson = (
  htmlString: string,
): MovieScores | null => {
  try {
    // Load the HTML string into Cheerio
    const $ = cheerio.load(htmlString);

    // Find the <script> tag inside <media-scorecard-manager>
    const scriptContent = $(
      'media-scorecard-manager > script#media-scorecard-json',
    ).html();

    if (scriptContent) {
      // Parse and return the JSON data
      const mediaOverlay = JSON.parse(scriptContent).overlay;
      const { audienceScore, criticsScore } = extractScores(mediaOverlay);

      return {
        audienceScore,
        criticsScore,
      };
    } else {
      console.error('Error: media-scorecard JSON not found in the HTML.');
      return null;
    }
  } catch (error) {
    console.error('Error parsing HTML:', error);
    return null;
  }
};

/**
 * Function to combine the movie titles and the scores given scores
 */
export const addScoresToMovies = (
  movieScores: MovieScores | null,
  movie: Movie,
): MovieWithScores => {
  return {
    ...movie,
    audienceScore: movieScores ? movieScores.audienceScore : null,
    criticsScore: movieScores ? movieScores.criticsScore : null,
  };
};
