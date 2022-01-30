'use strict';


const MovData = require('./Data/data.json');

const express = require('express');
const cors = require('cors');
 
const server = express();
server.use(cors());

server.get('/', handelHomePage )
server.get('/favorite', handelFavoritePage) //Welcome to Favorite Page
server.get('*',HandleError404) // 404 Error
server.get('/*',HandleError500) //500


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

function HandleError404(req,res){
  
        res.status(404).send('page not found error 404')
    

 }

 // I can't test this error 
 function HandleError500(req,res){
    let err500 = {
        "status": 500,
        "responseText": "Sorry, something went wrong"
        };
        res.status(500).send(err500);

 }


server.listen(3000,()=>{
    console.log("my server is listining to port 3000");
})


