import test from "node:test";
import assert from "node:assert/strict";

test("welcome response format", () => {
  
    const req = { body: { name: "John" } };
    let payload;
    const res = { json(data) { payload = data; } };

    res.json({ message: `Welcome ${req.body.name}` });
    assert.deepEqual( payload, { message: "Welcome John" });
  }
);
