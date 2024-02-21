const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors());
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const { request } = require("https");

let data=null;
let dbPath=path.join(__dirname,"movies.db")

const databaseAndServerInitialization = async () => {
    try {
      data = await open({
        filename: dbPath,
        driver: sqlite3.Database,
      });
  
      app.listen(3001, () => {
        console.log(`Server running at ${dbPath}`);
      });
    } catch (error) {
      console.log(`Database Error ${error.message}`);
    }
  };
  databaseAndServerInitialization();

  app.post("/upload-movies/",async(request,response)=>{
    const {id,url,movieName,cast}=request.body;
    const uploadMoviesQuery=`
    INSERT INTO movies(id,url,movieName,cast)
    VALUES(
      '${id}',
      '${url}',
      '${movieName}',
      '${cast}'
    )
    `
    const uploadMovies=await data.run(uploadMoviesQuery);
    console.log(uploadMovies);
    response.send("Movie uploaded successfully")
  })

  app.get("/movies/",async(request,response)=>{
    const moviesQuery=`
    SELECT * FROM movies`;

    const movies=await data.all(moviesQuery);
    console.log(movies);
    response.send(movies);
  })

  app.delete("/movies/", async (request, response) => {
    const { id } = request.body;
    const deleteMovieQuery = `
      DELETE FROM movies 
      where id = '${id}';
    `;
  
    const deleteArray = await data.run(deleteMovieQuery);
    console.log(deleteArray);
    response.send("Movie deleted successfully");
  });