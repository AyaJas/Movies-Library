'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const pg = require('pg');

// const client = new pg.Client(process.env.DATABASE_URL);

const client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const PORT = process.env.PORT;


const server = express();
server.use(cors());
server.use(express.json());

const MovData = require('./Data/data.json');

server.get('/', handelHomePage)

server.get('/favorite', handelFavoritePage)

server.get('/trending', handelTrendingPage)

server.get('/search', handelSearchMovie)

server.post('/addMovie', handelAddMovie)

server.get('/getMovies', handelGetMovies)

server.put('/UPDATE/:id', updateMoviesHandler);

server.delete('/DELETE/:id', deleteMoviesHandler);

server.get('/getMovie/:id', getspecificMovies);


server.use('*', HandleError404) // 404 Error

server.use(HandleError) //500




function Movies(id, title, release_date, poster_path, overview) {
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;
}





// function handelHomePage(req, res) {
//     let mov = MovData.map(val => {
//         return new Movies(val.title, val.poster_path, val.overview)
//     });
//     return res.status(200).json(mov);
// }

function handelHomePage(req, res) {
    return res.status(200).send("Welcome to Movies Page");
}



function handelFavoritePage(req, res) {
    return res.status(200).send("Welcome to Favorite Page");
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

/* 4 routes from Task12 requierments */
let route1 = "https://api.themoviedb.org/4/list/3?page=1&api_key=2b654cd49b2434078521e68e249176e7";
let route2 = "https://api.themoviedb.org/3/company/2?api_key=2b654cd49b2434078521e68e249176e7";
let route3 = "https://api.themoviedb.org/3/movie/25?api_key=2b654cd49b2434078521e68e249176e7&language=en-US";
let route4 = "https://api.themoviedb.org/3/movie/250?api_key=2b654cd49b2434078521e68e249176e7&language=en-US";





function handelAddMovie(req, res) {
    const movie = req.body;
    //console.log(movie);
    console.log("anything");
    let sql = `INSERT INTO favMovies(title,release_date,poster_path,overview) VALUES ($1,$2,$3,$4) RETURNING *;`
    let values = [movie.title, movie.release_date, movie.poster_path, movie.overview];
    console.log(values);
    client.query(sql, values).then(data => {
        // console.log("anything");
        res.status(200).json(data);
    }).catch(error => {
        HandleError(error, req, res)
    });
}






function handelGetMovies(req, res) {
    let sql = `SELECT * FROM favMovies;`;
    client.query(sql).then(data => {
        res.status(200).json(data.rows);
    }).catch(error => {
        HandleError(error, req, res)
    });
}







function updateMoviesHandler(req, res) {
    const id = req.params.id;
    console.log(req.params.id);
    const movie = req.body;
    const sql = `UPDATE favMovies SET title =$1, release_date = $2, poster_path = $3 ,overview = $4 WHERE id=$5 RETURNING *;`;
    let values = [movie.title, movie.release_date, movie.poster_path, movie.overview, id];
    client.query(sql, values).then(data => {
        res.status(200).json(data.rows);
        // res.status(204)
    }).catch(error => {
        HandleError(error, req, res)
    });
}






function deleteMoviesHandler(req, res) {
    const id = req.params.id;
    const sql = `DELETE FROM favMovies WHERE id=${id};`
    client.query(sql).then(() => {
        res.status(200).send("The Movie has been deleted");
    }).catch(error => {
        HandleError(error, req, res)
    });
}





function getspecificMovies(req, res) {
    const id = req.params.id;
    let sql = `SELECT * FROM favMovies WHERE id = ${id} ;`;
    client.query(sql).then(data => {
        res.status(200).json(data.rows[0]);
    }).catch(error => {
        HandleError(error, req, res)
    });
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




client.connect().then(() => {
    server.listen(PORT, () => {
        console.log(`My Server is listining to port ${PORT}`)
    })
})