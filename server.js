const express = require('express');
const app = express();

const { quotes } = require('./data');
const { getRandomElement } = require('./utils');

const PORT = process.env.PORT || 4001;

app.use(express.static('public'));

app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`)
});

app.get('/api/quotes/random', (req, res, next) => {
    const randomQuote = getRandomElement(quotes);
    res.send({ quote: randomQuote.quote });
})

app.get('/api/quotes', (req, res, next) => {
    const person = req.query.person
    if (person) {
        let quotesArray = [];
        for (let i = 0; i < quotes.length; i++) {
            if (quotes[i].person == person) {
                quotesArray.push(quotes[i].quote);
            }
        }
        res.send({ quotes: quotesArray});
    }
    else {
        let allQuotesArray = [];
        for (let i = 0; i < quotes.length; i++) {
            allQuotesArray.push(quotes[i].quote);
        }
        res.send({ quotes: allQuotesArray })
    }
})

app.post('/api/quotes', (req, res, next) => {
    if (!req.query || !req.query.person || !req.query.quote) {
        res.status(400).send('Missing arguments.');
    }

    const person = req.query.person;
    const quote = req.query.quote;
    let conflictCount = 0;

    for (let i = 0; i < quotes.length; i++) {
        if (person == quotes[i].person) {
            if (quote == quotes[i].quote) {
                conflictCount++;
            }
        }
    }
    
    if (conflictCount > 0) {
        res.status(400).send('Person and quote not unique.');
        return;
    }
    else {
        const newQuote = { quote: quote, person: person } 
        quotes.push(newQuote)
        res.send(newQuote)
    }
})