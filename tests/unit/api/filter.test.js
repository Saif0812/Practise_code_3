import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";

import app, { axios } from "../../../app.js";

test("GET /api/filter returns user", async (t) => {

  const originalGet = axios.get;
  axios.get = async () => ({
    data: [
      {
        id: 1,
        name: "Leanne Graham"
      }
    ]
  });

  const response = await request(app).get("/api/filter?id=1");
  assert.equal( response.status, 200 );
  assert.equal( response.body.name, "Leanne Graham" );
  axios.get = originalGet;
  
});