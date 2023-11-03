// Import required modules
import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';

// Create an Express application
const app = express();
const port = 3000;

// Serve static files from the 'public' directory
app.use(express.static("public"));

// Parse URL-encoded bodies (for form data)
app.use(bodyParser.urlencoded({ extended: true }));

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Define a route for the root path ('/')
app.get('/', (req, res) => {
    // Render the 'index.ejs' template with initial values for weather and error
    res.render('index.ejs', {
        weather: null,
        error: null,
    });
});

// Middleware function to extract the 'Weather' field from the request body
let city;
function getLocation(req, res, next) {
    city = req.body['Weather'];
    next();
}

// Use the middleware for all routes
app.use(getLocation);

// Define a route for handling POST requests to '/search'
app.post('/search', async (req, res) => {
    // API key for OpenWeatherMap
    const apiKey = '030f7702b9bd293bdb0928982e566ca1';

    // Variables to store weather data and error messages
    let weather;
    let error = null;

    try {
        // Make a GET request to OpenWeatherMap API using axios
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`);

        // Extract relevant data from the API response
        weather = {
            name: response.data.name,
            temp: response.data.main.temp,
            country: response.data.sys.country,
            weatherType: response.data.weather[0].main
        };
    } catch (err) {
        // Handle errors, set weather to null and provide an error message
        weather = null;
        error = "Error, Please try again";
    }

    // Render the 'index.ejs' template with weather data and error
    res.render('index.ejs', {
        weather: weather,
        error: error,
    });
});

// Start the server on the specified port
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
