const express = require("express");
const { getTopics } = require("./controllers/get.controller");
const app = express();
app.use(express.json());

//GET
app.get("/api/topics", getTopics);

//404
app.get("/*", (req, res) => {
  res
    .status(404)
    .send({ status: 404, msg: `Error: Endpoint (${req.path}) not found.` });
});

module.exports = app;
