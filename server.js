'use strict';

const MovData = require('./Data/data.json');

const express = require('express');
const cors = require('cors');
 
const server = express();
server.use(cors());

server.get('/', handelHomePage )
server.get('/favorite', handelFavoritePage) //Welcome to Favorite Page
server.get('*',HandleErrors) 


function Movies(title, poster_path, overview){
   this.title = title;
   this.poster_path = poster_path;
   this.overview = overview;
}


function handelHomePage(req,res){
        let mov = MovData.map(val =>{
            return new Movies (val.title, val.poster_path, val.overview)});
            return res.status(200).json(mov);
}


function handelFavoritePage(req,res){
    return res.status(200).send("Welcome to Favorite Page");
}




function HandleErrors(req,res){
    let err500 = {
        "status": 500,
        "responseText": "Sorry, something went wrong"
        };
    if(res.status(404))
    {
        res.status(404).send('page not found error 404')
    }
    else if (res.status(500))
    {
        res.status(500).send(err500);
    }

 }

// port = 3000
server.listen(3000,()=>{
    console.log("my server is listining to port 3000");
})


