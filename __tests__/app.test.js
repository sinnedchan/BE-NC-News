const request = require("supertest");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const db = require("../db/connection");
const app = require("../app");

beforeEach(() => seed(testData));
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
});

describe("global errors", () => {
  describe("404 endpoint not found", () => {
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
