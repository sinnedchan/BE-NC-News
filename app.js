const express = require("express");
const {
  getTopics,
  getArticlesById,
  getUsers,
  patchArticle,
} = require("./controllers/controllers.js");
const app = express();
app.use(express.json());

//GET
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticlesById);
app.get("/api/users", getUsers);

//PATCH
app.patch("/api/articles/:article_id", patchArticle);

//404
app.get("*", (req, res) => {
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
  if (err.code === "22P02") {
    res.status(400).send({ msg: "400: Bad request" });
  } else {
    if (err.code === "23503") {
      res.status(404).send({ msg: "404: Not found" });
    }
    res.status(err.status).send({ msg: err.msg });
    next(err);
  }
});

//server errors
app.use((err, req, res, next) => {
  res
    .status(500)
    .send({ status: 500, msg: "Error 500: internal server error" });
});

module.exports = app;
