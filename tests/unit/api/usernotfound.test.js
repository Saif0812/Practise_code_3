import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";

import app, { axios } from "../../../app.js";

test("GET /api/filter returns 404", async () => {

  const originalGet = axios.get;
  axios.get = async () => ({
    data: []
  });

  const response = await request(app).get("/api/filter?id=99");
  assert.equal( response.status, 404 );
  assert.equal( response.body.error, "User not found." );

  axios.get = originalGet;

});