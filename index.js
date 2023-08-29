const PORT = 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()
const puppeteer = require('puppeteer')

let browser;

const tracking = [
    {
        name: 'beetlejuice',
        address: 'https://thesmithcenter.com/tickets/2324/beetlejuice/'
    }
];

// Function to initialize the browser
async function initializeBrowser() {
    browser = await puppeteer.launch();
}

const tickets = [];

// Function to get the final URL using Puppeteer with custom redirection handling
async function getFinalURL(url) {
    if (!browser) {
        // Initialize the browser if it's not already initialized
        await initializeBrowser();
    }

    const page = await browser.newPage();

    // Attempt to navigate to the initial URL with Puppeteer
    await page.goto(url);

    // Wait for the page to load (adjust the timeout as needed)
    await page.waitForTimeout(5000);

    // Get the final URL after redirection
    const finalUrl = page.url();

    return finalUrl;
}


async function checkAttributeChange() {
    try {
        const promises = tracking.map(async (show) => {
            // Get the final URL using Puppeteer
            const finalURL = await getFinalURL(show.address);

            // Make an HTTP GET request to the final URL
            const response = await axios.get(finalURL);

            // Load the HTML content into cheerio
            const $ = cheerio.load(response.data);

            // Select all <li> elements with the data-availability attribute
            const liElements = $('[data-availability]');

            // Iterate through the <li> elements and check the data-availability attribute
            liElements.each((index, liElement) => {
                const currentAvailability = $(liElement).attr('data-availability');

                // Check if the availability has changed
                if (currentAvailability !== '0') {
                    const changeDetails = {
                        showName: show.name,
                        elementIndex: index + 1,
                        newAvailability: currentAvailability
                    };
                    tickets.push(changeDetails);
                }
            });
        });

        // Wait for all promises to resolve
        await Promise.all(promises);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Call the function to start monitoring
checkAttributeChange();


app.get('/', (req, res) => {
    res.json('Welcome to my Ticket Availability API')
})

app.get('/tickets', (req, res) => {
    res.json(tickets)
})

app.listen(PORT, () => console.log('server running on PORT ${PORT}'))