# 🎬 Rotten Tomatoes Scraper  

## What is this?  
This is a  Rotten Tomatoes scraper built using **Playwright** and **Cheerio**.  

It allows you to input a list of films via a `.csv` file**, and it will output the same list but enriched with Rotten Tomatoes audience and critic scores.

## How It Works  

1. The scraper leverages Playwright to automate web interactions and extract information from Rotten Tomatoes.  
2. We use **Google's "I'm Feeling Lucky" feature**, which takes us directly to the first search result based on a query.
3. The search query format is:  

   ```
   <Movie Title> + <Release Year> + "Rotten Tomatoes"
   ```

   This **almost always leads to the correct Rotten Tomatoes page** for the film.
4. If the Rotten Tomatoes page is not the first result, it is likely that the movie does not have a Rotten Tomatoes listing.
5. Note: Before reaching to the Rotten Tomatoes page, it will wait for 3 to 5 seconds, this is to prevent auto detection from both Google and Rotten Tomatoes
6. Once on Rotten Tomatoes, we extract the audience score and critic score using **Cheerio**. This is done because a lot of theses information is stored in the `media-scorecard-manager` tag in the HTML body of a rotten tomatoes page.

In which it holds a lot of information, here is a sample JSON file: [JSON File](https://jsonformatter.org/dae935)

In here we only use the `audienceAll?.score` and `criticsAll?.score` attributes.

## How to Run  

### Step 1: Install Node.js
Ensure that you have **Node.js** installed on your system. You can download it from the official website:  
[Download Node.js](https://nodejs.org/en/download)  

### Step 2: Install Dependencies
Navigate to the project directory and run:  
```sh
npm install
```

### Step 3: Set Up the Input File
To scrape Rotten Tomatoes, you need to provide a list of movies in **CSV format**.  

1. Create a directory CSV file named `movie_metadata.csv`
2. Place it inside the `assets` directory  
3. Ensure the file follows this format:

```
movie_title,title_year
```

#### Example Input File (`movie_metadata.csv`):
```csv
movie_title,title_year
Spider-Man 3,2007
The Avengers,2012
```

Each row should contain:
- `movie_title`: The movie’s name  
- `title_year`: The year of release  

This file serves as the input for the scraper to fetch Rotten Tomatoes ratings for each movie.

### Step 4: Setup the Output Directory
- Create a directory `output` at root.
- Always clear the output directory before running the script, it makes sure that nothing breaks and the output is consistent.

### Step 5: Run the Scraper
To run the script normally, use:  
```sh
npm run dev
```

If you want to log the output to a file `output.txt`, run:  
```sh
npm run dev:output
```

### Step 6: Check the Results
After the script finishes running, the extracted movie scores will be saved in:  
```
output/movie_scores.csv
```

## Configuration Options  

### **Modifying Headless Mode**  
By default, the scraper runs in **headless mode** (meaning the browser will not open a visible window).  

To modify this behavior, you can update the `.env` file:  

1. Open the `.env` file.
2. Find the variable:  
   ```
   IS_HEADLESS=true
   ```
   - Set it to `true` to run Playwright in headless mode (browser runs in the background).  
   - Set it to `false` to see the browser while the script is running (useful for debugging).  

**Default behavior:** `false` (browser is opened while running).

## Notes  

- The script relies on Google Search results, so if the Rotten Tomatoes page isn't the first result the scraper may not find a match.  
- Some movies may not have a Rotten Tomatoes listing, in which case no scores will be added.  
- Running the script too frequently might cause Google to show CAPTCHAs or temporarily block searches. If that happens, consider using proxies or reducing the request frequency.  

## Troubleshooting  

### 1. The script isn't finding Rotten Tomatoes scores for some movies.
**Possible reasons:**  
- The movie doesn't exist on Rotten Tomatoes.  
- The **search result didn't return Rotten Tomatoes as the first link**.  
- Google might have blocked automated searches due to too many requests in a short time.  

**Solution:** Try reducing the number of movies per run** or implementing delays between searches.

### 2. The browser isn't opening when I run the script.
- Check your `.env` file and ensure `IS_HEADLESS=false` if you want to see the browser.

### 3. I get an error when running `npm run dev`.
- Ensure **Node.js** is installed (`node -v` should return a version number).  
- Run `npm install` again to reinstall dependencies.