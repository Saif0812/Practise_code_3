import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";

import app, { axios } from "../../../app.js";

test("GET /api/random", async () => {

  const originalGet = axios.get;
  axios.get = async () => ({
    data: [
      {
        id: 1,
        name: "John"
      }
    ]
  });

  const response = await request(app).get("/api/random");
  assert.equal( response.status, 200 );
  assert.equal( response.body.id, 1 );

  axios.get = originalGet;

});