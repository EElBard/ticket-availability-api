const PORT = 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()

const tracking = [
    {
        name: 'beetlejuice',
        address: 'https://thesmithcenter.com/tickets/2324/beetlejuice/'
    }
];

const tickets = [];

// Assuming you have already made the necessary imports and set up the tracking array

async function checkAttributeChange() {
    try {
        const promises = tracking.map(async (show) => {
            // Make an HTTP GET request to the website
            const response = await axios.get(show.address);

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