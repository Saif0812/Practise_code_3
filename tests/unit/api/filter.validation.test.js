import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";

import app from "../../../app.js";

test("GET /api/filter rejects text", async () => {

  const response = await request(app).get("/api/filter?id=abc");
  assert.equal( response.status, 400 );
  assert.equal( response.body.error, "Invalid User ID. User ID should be number." );

});

test("GET /api/filter rejects decimal", async () => {

  const response = await request(app).get("/api/filter?id=1.5");
  assert.equal(response.status, 400);

});

test("GET /api/filter rejects empty value", async () => {

  const response = await request(app).get("/api/filter?id=");
  assert.equal(response.status, 400);

});