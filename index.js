import express from "express";
import axios from "axios";
import https from "node:https";
import path from "node:path";
import bodyParser from "body-parser";
import { fileURLToPath } from "node:url";

const app = express();
app.disable("x-powered-by");
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------- STATIC FILES ----------
app.use(express.static(path.join(__dirname, "public")));

// ---------- BODY PARSER ----------
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Optional: only disable TLS verification if needed
const agent = new https.Agent({
  rejectUnauthorized: false,
});

const config = { httpsAgent: agent };

// ---------- VALIDATION MIDDLEWARE ----------
function validateUserId(req, res, next) {
  const { id } = req.query;
  const num = Number(id);

  if (!Number.isInteger(num)) {
    const err = new Error("Invalid User ID. User ID should be number.");
    err.status = 400;
    return next(err);
  }

  req.userId = num;
  next();
}

// ---------- ROUTES ----------
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/api/random", async (req, res, next) => {
  try {
    const response = await axios.get("https://jsonplaceholder.typicode.com/users", config);
    const users = response.data;
    const randomUser = users[Math.floor(Math.random() * users.length)];

    console.log("Random user:", randomUser);
    res.json(randomUser);

  } catch (error) {
    next(error);
  }
});

app.get("/api/filter", validateUserId, async (req, res, next) => {
  try {
    const num = req.userId;

    const response = await axios.get(
      `https://jsonplaceholder.typicode.com/users?id=${num}`,
      config
    );

    const users = response.data;
    const user = users[0];

    if (!user) {
      const err = new Error("User not found.");
      err.status = 404;
      return next(err);
    }

    console.log("Filtered user:", user);
    res.json(user);

  } catch (error) {
    next(error);
  }
});

app.post("/api/welcome", (req, res) => {
  const { name } = req.body;

  res.json({
    message: `Welcome ${name}`
  });
});

// ---------- GLOBAL ERROR HANDLER ----------
app.use((err, req, res, next) => {

  console.error({
    message: err.message,
    code: err.code,
    status: err.status
  });

  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error"
  });

});

// ---------- SERVER ----------
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
