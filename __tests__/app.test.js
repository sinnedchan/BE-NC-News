const request = require("supertest");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const db = require("../db/connection");
const app = require("../app");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api/topics", () => {
  describe("api calls", () => {
    it("responds with a status code of 200 and an object containing an array with a length of 3, each topic should be an object with 2 keys (slug + description), both having strings ", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(200);
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
});

describe("global errors", () => {
  describe("404 endpoint not found", () => {
    it("should return a status code of 404 if trying to access and endpoint that doesn't exist", () => {
      return request(app).get("/invalidpath").expect(404);
    });
    it("return an object with a status code and a message", () => {
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
