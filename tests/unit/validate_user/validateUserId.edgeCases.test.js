import test from "node:test";
import assert from "node:assert/strict";

import { validateUserId } from "../../../app.js";

test("rejects decimal", () => {

    let error;
    validateUserId({ query: { id: "1.5" } }, {}, err => { error = err; });
    assert.equal( error.status, 400 );
  }
);

test("rejects empty value", () => {
  
    let error;
    validateUserId({ query: { id: "" } }, {}, err => { error = err; });
    assert.equal( error.status, 400 );
  }
);