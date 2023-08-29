const PORT = 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()
const cookiejarsupport = require('axios-cookiejar-support')
const toughcookie = require('tough-cookie')

const wrapper = cookiejarsupport.wrapper()
const jar = new toughcookie.CookieJar();
const client = wrapper(axios.create({jar}))


const tracking = [
    {
        name: 'beetlejuice',
        address: 'https://thesmithcenter.com/tickets/2324/beetlejuice/'
    }
]

const tickets = []

tracking.forEach(show => {
    client.get(show.address)
        .then((response) => {
            const html = response.data
            console.log(response.data)
            //const $ = cheerio.load(html)

            let availNone = $document.querySelectorAll('[data-availability=0]');
            let availOne = document.querySelectorAll('[data-availability=1]');
            let availTwo = document.querySelectorAll('[data-availability=2]');
            let availThree = document.querySelectorAll('[data-availability=3]');
            
            for(i = 0; i < availNone.length, i++;){
                tickets.push({
                    item: availNone[i]
                })
            }
        })
})

app.get('/', (req, res) => {
    res.json('Welcome to my Ticket Availability API')
})

app.get('/tickets', (req, res) => {
    res.json(tickets)
})

app.listen(PORT, () => console.log('server running on PORT ${PORT}'))