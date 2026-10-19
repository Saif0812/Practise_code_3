import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";

import app, { axios } from "../../../app.js";

test("GET /api/random handles axios error", async () => {

  const originalGet = axios.get;
  axios.get = async () => {
    throw new Error("Network Error");
  };

  const response = await request(app).get("/api/random");
  assert.equal( response.status, 500 );
  assert.equal( response.body.error, "Network Error" );

  axios.get = originalGet;

});