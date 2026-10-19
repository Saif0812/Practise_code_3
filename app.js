import express from "express";
import axios from "axios";
import https from "node:https";
import path from "node:path";
import bodyParser from "body-parser";
import { fileURLToPath } from "node:url";

const app = express();

app.disable("x-powered-by");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const agent = new https.Agent({
  rejectUnauthorized: false
});

const config = {
  httpsAgent: agent
};

export function validateUserId(req, res, next) {
  const { id } = req.query;

  if (typeof id !== "string" || id.trim() === "") {
    const err = new Error(
      "Invalid User ID. User ID should be number."
    );

    err.status = 400;
    return next(err);
  }

  const num = Number(id);

  if (!Number.isInteger(num)) {
    const err = new Error(
      "Invalid User ID. User ID should be number."
    );

    err.status = 400;
    return next(err);
  }

  req.userId = num;
  next();
}

app.post("/api/welcome", (req, res) => {
  const { name } = req.body;

  res.json({
    message: `Welcome ${name}`
  });
});

app.get("/api/filter", validateUserId, async (req, res, next) => {
  try {
    const response = await axios.get( "https://jsonplaceholder.typicode.com/users", config );
    const users = response.data.filter( (user) => user.id === req.userId );
    
    if (users.length === 0) {
      const err = new Error("User not found.");
      err.status = 404;
      return next(err);
    }
    
    res.json(users[0]);
  } catch (err) {
    next(err);
  }
});

app.get("/api/random", async (req, res, next) => {
  try {
    const response = await axios.get( "https://jsonplaceholder.typicode.com/users/1", config );
    const user = Array.isArray(response.data) ? response.data[0] : response.data;
    res.json(user);
  } catch (err) {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error"
  });
});

export { axios };
export default app;