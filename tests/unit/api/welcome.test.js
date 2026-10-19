import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";

import app from "../../../app.js";

test("POST /api/welcome returns welcome message", async () => {

  const response = await request(app).post("/api/welcome").send({ name: "John" });
  assert.equal(response.status, 200);
  assert.deepEqual( response.body, { message: "Welcome John" });
  
});