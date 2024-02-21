const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

app.use(express.json());
app.use(cors()); // Enable CORS for all routes

let data = null;
const dbPath = path.join(__dirname, "movies.db");

const databaseAndServerInitialization = async () => {
    try {
        data = await open({
            filename: dbPath,
            driver: sqlite3.Database,
        });

        const PORT = process.env.PORT || 3001;
        app.listen(PORT, () => {
            console.log(`Server running at port ${PORT}`);
        });
    } catch (error) {
        console.log(`Database Error: ${error.message}`);
    }
};
databaseAndServerInitialization();

app.post("/upload-movies/", async (request, response) => {
    const {  url, movieName, cast } = request.body;
    const uploadMoviesQuery = `
        INSERT INTO movies(url,movieName,cast)
        VALUES('${url}','${movieName}','${cast}')
    `;
    try {
        const uploadMovies = await data.run(uploadMoviesQuery);
        console.log(uploadMovies);
        response.send("Movie uploaded successfully");
    } catch (error) {
        console.error("Error uploading movie:", error);
        response.status(500).send("Internal Server Error");
    }
});

app.get("/movies/", async (request, response) => {
    const moviesQuery = `SELECT * FROM movies`;
    try {
        const movies = await data.all(moviesQuery);
        console.log(movies);
        response.send(movies);
    } catch (error) {
        console.error("Error fetching movies:", error);
        response.status(500).send("Internal Server Error");
    }
});

app.delete("/movies/:id", async (request, response) => {
    const id = request.params.id;
    const deleteMovieQuery = `DELETE FROM movies WHERE id = '${id}'`;
    try {
        const deleteArray = await data.run(deleteMovieQuery);
        console.log(deleteArray);
        response.send("Movie deleted successfully");
    } catch (error) {
        console.error("Error deleting movie:", error);
        response.status(500).send("Internal Server Error");
    }
});
