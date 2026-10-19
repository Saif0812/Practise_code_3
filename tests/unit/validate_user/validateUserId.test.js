import test from "node:test";
import assert from "node:assert/strict";

import { validateUserId } from "../../../app.js";

test("validateUserId accepts valid number", () => {

    const req = { query: { id: "5" } };
    const res = {};
    let called = false;
    function next() { called = true; }

    validateUserId(req, res, next );
    assert.equal( req.userId, 5 );
    assert.equal( called, true );
  }
);

test("validateUserId rejects text", () => {

    const req = { query: { id: "abc" } };
    const res = {};
    let error;
    function next(err) { error = err; }

    validateUserId(req, res, next );
    assert.equal( error.message, "Invalid User ID. User ID should be number." );
    assert.equal( error.status, 400 );
  }
);