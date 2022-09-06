const request = require("supertest");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const db = require("../db/connection");
const app = require("../app");

beforeAll(() => seed(testData));
afterAll(() => db.end());

describe("GET /api/topics", () => {
  describe("api calls", () => {
    it("200: returns array with length of 3, with 2 keys (slugs + desc) both having strings ", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(body.topics.length).toBe(3);
          expect(Array.isArray(body.topics)).toBe(true);
          expect(
            body.topics.forEach((topic) => {
              expect(topic).toEqual({
                slug: expect.any(String),
                description: expect.any(String),
              });
            })
          );
        });
    });
  });
  describe("error handling", () => {
    it("404: return error msg trying to access and endpoint that doesn't exist", () => {
      return request(app)
        .get("/invalidpath")
        .expect(404)
        .then(({ body }) => {
          expect(body).toEqual({
            status: 404,
            msg: "Error: Endpoint (/invalidpath) not found.",
          });
        });
    });
  });
});

describe("GET /api/articles/:article_id", () => {
  describe("api calls", () => {
    it("200: returns an object with a key of article and a value that is an object", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          expect(body).toHaveProperty("article");
          expect(body.article).toEqual(expect.any(Object));
        });
    });

    it("returns a specific object based on the provided article_id parameter", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toEqual({
            author: "jonny",
            title: "Living in the shadow of a great man",
            article_id: 1,
            topic: "mitch",
            body: "I find this existence challenging",
            created_at: expect.any(String),
            votes: 100,
          });
        });
    });
  });
  describe("error handling", () => {
    it("returns 404 if provided a valid id that does not exist", () => {
      return request(app)
        .get("/api/articles/999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("404: no article found with article_id 999");
        });
    });
    it("returns 400 if the given id is not an integer", () => {
      return request(app)
        .get("/api/articles/notanint")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("400: article_id must be a number");
        });
    });
  });
});

describe("GET /api/users", () => {
  describe("api calls", () => {
    it("200: returns an object with key of users, which is an array", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          expect(body).toHaveProperty("users");
          expect(Array.isArray(body.users)).toBe(true);
        });
    });
    it("returns all objects from the users table", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          expect(body.users.length).toBe(4);
        });
    });
    it("returns all objects fully populated with the correct keys + value types", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          body.users.forEach((user) => {
            expect(user).toEqual({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            });
          });
          expect(body.users[0]).toEqual({
            username: "butter_bridge",
            name: "jonny",
            avatar_url:
              "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
          });
        });
    });
  });
});
