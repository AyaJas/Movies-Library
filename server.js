'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const axios = require('axios');

const PORT = process.env.PORT;

const server = express();
server.use(cors());


server.get('/trending', handelTrendingPage)
server.get('/search', handelSearchMovie)
server.use('*', HandleError404) // 404 Error
server.use(HandleError) //500


function Movies(id, title, release_data, poster_path, overview) {
    this.id = id;
    this.title = title;
    this.release_data = release_data;
    this.poster_path = poster_path;
    this.overview = overview;
}

let numberOfMovies = 2;
let url = `https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.APIKEY}`;


function handelTrendingPage(req, res) {
    axios.get(url)
        .then((resultOf) => {
            let result = resultOf.data.results;
            let moviesOf = result.map(movie => {
                return new Movies(movie.id, movie.title, movie.release_date, movie.poster_path, movie.overview);
            })
            res.status(200).json(moviesOf);
        }).catch((err) => {
            console.log("Error");
        })
}

let movie1 = "Riverdance: The Animated Adventure";
let movie2 = "The Hobbit: The Battle of the Five Armies";
function handelSearchMovie(req, res) {
    let urlS = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.APIKEY}&number=${numberOfMovies}&query=${movie1}`;
    axios.get(urlS)
        .then((resultOf) => {
            let result = resultOf.data.results;
            let moviesOf = result.map(movie => {
                return new Movies(movie.id, movie.original_title, movie.release_date, movie.poster_path, movie.overview);
            })
            res.status(200).json(moviesOf);
        }).catch((err) => {
            console.log("Error");
        })
}

function HandleError404(req, res) {

    res.status(404).send('page not found error 404')


}


function HandleError(error, req, res) {
    const err500 = {
        "status": 500,
        "responseText": "Sorry, something went wrong"
    }
    res.status(500).send(err500);

}


server.listen(PORT, () => {
    console.log(`my server is listining to port ${PORT}`);
})


