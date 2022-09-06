const express = require("express");
const {
  getTopics,
  getArticlesById,
  getUsers,
} = require("./controllers/get.controller");
const app = express();
app.use(express.json());

//GET
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticlesById);
app.get("/api/users", getUsers);

//404
app.get("/*", (req, res) => {
  res
    .status(404)
    .send({ status: 404, msg: `Error: Endpoint (${req.path}) not found.` });
});

//error handling

//custom errors
app.use((err, req, res, next) => {
  switch (err.status) {
    case 404:
      res.status(404).send({ status: 404, msg: err.msg });
  }
  next(err);
});

//PSQL errors - based on err code given by PSQL
app.use((err, req, res, next) => {
  switch (err.code) {
    case "22P02":
      res
        .status(400)
        .send({ status: 400, msg: "400: article_id must be a number" });
  }
  next();
});

//server errors
app.use((err, req, res, next) => {
  console.log("Error: 500 internal server error");
  res.status(500).send({ status: 500, msg: "Error 500: internal server" });
});
module.exports = app;
