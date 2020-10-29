// load libraries
const express = require('express')
const hbs = require('express-handlebars')
const fetch = require('node-fetch')
const withQuery = require('with-query').default

// configure the PORT
const PORT = parseInt(process.argv[2]) || parseInt(process.env.PORT) || 3000
const API_KEY = process.env.API_KEY || "";
// standard way of doing it so don't check in API key
// first look in environment

const ENDPOINT = 'https://api.giphy.com/v1/gifs/search'
const imgUrl = []

const app = express()
app.engine('hbs',hbs({ defaultLayout: 'default.hbs'}))
app.set('view engine', 'hbs')

app.get(['/', '/index.html'], (req, resp) => {
    resp.status(200)
    resp.type('text/html')
    resp.render('search')
})

app.get('/search', 
    async(req, resp) => {
        const search = req.query['search-term']

        console.info('search-term: ', search)

        const url = withQuery(
            ENDPOINT,
            {
                q: search,
                api_key: API_KEY,
                limit: 10,
                offset: 0,
                rating: 'g',
                lang: 'en'
            }
        )
        console.info('the url is:', url)
        
        try {
            const result = await fetch(url)
            const giphy = await result.json()
            console.info(`result is: \n`, giphy)

            giphy.data.forEach(dataObj => {
                imgUrl.push(dataObj.images.fixed_height.url)
            })
        } catch (error) {
            console.error('Error: ', error)
        }
        

        

        console.info(`The list of url:\n`, imgUrl)

        resp.status(200)
        resp.render('result', {search, imgUrl})
        // resp.end()
        
})




// ensure have API key before starting application
if (API_KEY)
    app.listen(PORT, () => {
        console.info(`Application started on port ${PORT} at ${new Date} with API key: ${API_KEY}`)
    })
else
    console.error('API key is not set')


/*
app.use(
    express.static(__dirname + '')
)
*/