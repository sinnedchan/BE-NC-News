const request = require("supertest");
const app = require("../app");

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
          console.log(body);
        });
    });
  });
});
