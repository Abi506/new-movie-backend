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