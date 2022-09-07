const db = require("../db/connection");
const format = require("pg-format");

//GET
exports.fetchTopics = () => {
  return db.query("SELECT * FROM topics").then(({ rows }) => {
    return rows;
  });
};

exports.fetchArticlesById = (id) => {
  const query = `
    SELECT users.name AS author, title, article_id, body, topic, created_at, votes
    FROM articles
    JOIN users
    ON users.username = articles.author
    WHERE article_id = $1`;
  return db.query(query, [id]).then(({ rows }) => {
    if (rows[0]) return rows[0];
    return Promise.reject({
      status: 404,
      msg: `404: no article found with article_id ${id}`,
    });
  });
};

exports.fetchUsers = () => {
  return db.query("SELECT * FROM users").then(({ rows }) => {
    return rows;
  });
};

//PATCH
exports.updateArticle = (id, votes) => {
  return db
    .query(
      "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING*;",
      [votes, id]
    )
    .then(({ rows }) => {
      if (!rows[0]) {
        return Promise.reject({
          status: 404,
          msg: "404: Not found",
        });
      }
      return rows[0];
    });
};
