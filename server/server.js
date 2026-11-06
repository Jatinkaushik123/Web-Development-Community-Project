/**
 * MausamCrop Express API
 * Serves the vanilla client and persists advisory feedback to local JSON.
 */
const express = require("express");
const cors = require("cors");
const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 3000;
const CLIENT_DIR = path.join(__dirname, "..", "client");
const DATA_DIR = path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "submissions.json");

const CROP_NORMALIZATION = {
  tomatoes: "tomato",
  tomato: "tomato",
  spinach: "spinach",
  okra: "okra",
  carrots: "carrot",
  carrot: "carrot",
  chillies: "chillies",
  chilli: "chillies",
  radish: "radish",
};
const ALLOWED_CROPS = Object.keys(CROP_NORMALIZATION);
const ALLOWED_CATEGORIES = ["home-gardener", "balcony-grower", "small-farmer"];
const NAME_PATTERN = /^[A-Za-z]+(?:[ '\-][A-Za-z]+)*$/;

app.use(cors());
app.use(express.json({ limit: "32kb" }));

// Normalize trailing slashes to avoid 404s on directory-style URLs (e.g. /location/ -> /location)
app.use(function (req, res, next) {
  if (req.path.length > 1 && req.path.endsWith("/")) {
    const query = req.url.slice(req.path.length);
    return res.redirect(301, req.path.slice(0, -1) + query);
  }
  next();
});

// Favicon handler to avoid 404s
app.get("/favicon.ico", function (req, res) {
  res.sendFile(path.join(CLIENT_DIR, "assets", "images", "logo-removebg-preview.png"));
});

// Serve static client files with clean URL resolution (e.g. /location -> location.html)
app.use(
  express.static(CLIENT_DIR, {
    extensions: ["html"],
  })
);

function letterCount(value) {
  return (String(value).match(/[A-Za-z]/g) || []).length;
}

function validatePayload(body) {
  const errors = [];
  const fullName = String(body.fullName || "").trim();
  const city = String(body.city || "").trim();
  const rawCrop = String(body.crop || "").trim().toLowerCase();
  const crop = CROP_NORMALIZATION[rawCrop] || rawCrop;
  const category = String(body.category || "").trim();
  const query = String(body.query || "").trim();
  const submittedAt = String(body.submittedAt || "").trim();

  if (letterCount(fullName) < 3 || !NAME_PATTERN.test(fullName)) {
    errors.push("fullName must be at least 3 letters and use alphabetic characters only.");
  }
  if (city.length < 2) {
    errors.push("city is required.");
  }
  if (!ALLOWED_CROPS.includes(rawCrop)) {
    errors.push("crop must be one of the supported vegetables (tomato, spinach, okra, carrot, chillies, radish).");
  }
  if (!ALLOWED_CATEGORIES.includes(category)) {
    errors.push("category must be home-gardener, balcony-grower, or small-farmer.");
  }
  if (query.length < 15) {
    errors.push("query must be at least 15 characters.");
  }

  return {
    ok: errors.length === 0,
    errors,
    value: { fullName, city, crop, category, query, submittedAt },
  };
}

/** Create server/data/submissions.json as [] when the file is missing. */
async function ensureDataFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(DATA_FILE);
  } catch (err) {
    if (err && err.code === "ENOENT") {
      await fs.writeFile(DATA_FILE, "[]", "utf8");
      return;
    }
    throw err;
  }
}

async function readSubmissions() {
  await ensureDataFile();
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    await fs.writeFile(DATA_FILE, "[]", "utf8");
    return [];
  }
}

// Health check endpoint
app.get("/api/health", function (req, res) {
  return res.status(200).json({
    status: "ok",
    app: "MausamCrop",
    timestamp: new Date().toISOString(),
  });
});

// Crops catalogue endpoint
app.get("/api/crops", function (req, res) {
  return res.status(200).json({
    success: true,
    data: [
      { id: "tomato", name: "Tomatoes", nameHi: "टमाटर", tempMin: 18, tempMax: 32, water: "moderate" },
      { id: "spinach", name: "Spinach", nameHi: "पालक", tempMin: 10, tempMax: 22, water: "high" },
      { id: "okra", name: "Okra", nameHi: "भिंडी", tempMin: 24, tempMax: 35, water: "moderate" },
      { id: "carrot", name: "Carrots", nameHi: "गाजर", tempMin: 15, tempMax: 24, water: "moderate" },
      { id: "chillies", name: "Green Chillies", nameHi: "हरी मिर्च", tempMin: 20, tempMax: 32, water: "moderate" },
      { id: "radish", name: "Radish", nameHi: "मूली", tempMin: 10, tempMax: 22, water: "high" },
    ],
  });
});

// Submissions retrieval endpoint
app.get("/api/submissions", async function (req, res) {
  try {
    const submissions = await readSubmissions();
    return res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions,
    });
  } catch (err) {
    console.error("Failed to read submissions:", err);
    return res.status(500).json({
      success: false,
      message: "Could not read submissions.",
    });
  }
});

// Feedback submission endpoint
app.post("/api/submit", async function (req, res) {
  const checked = validatePayload(req.body || {});
  if (!checked.ok) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: checked.errors,
    });
  }

  try {
    const submissions = await readSubmissions();
    const record = {
      id: crypto.randomUUID(),
      ...checked.value,
      submittedAt: checked.value.submittedAt || new Date().toISOString(),
      receivedAt: new Date().toISOString(),
      status: "received",
    };
    submissions.push(record);
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(submissions, null, 2), "utf8");

    return res.status(201).json({
      success: true,
      message: "Feedback saved successfully",
      data: record,
    });
  } catch (err) {
    console.error("Failed to save submission:", err);
    return res.status(500).json({
      success: false,
      message: "Could not save feedback. Please try again.",
    });
  }
});

// Catch-all 404 for undefined API routes
app.all("/api/*", function (req, res) {
  return res.status(404).json({
    success: false,
    message: `API route '${req.originalUrl}' not found.`,
  });
});

// Fallback for non-matching GET routes: serve index.html with 404 status
app.use(function (req, res) {
  if (req.method === "GET" && req.accepts("html")) {
    return res.status(404).sendFile(path.join(CLIENT_DIR, "index.html"));
  }
  return res.status(404).json({
    success: false,
    message: "Resource not found",
  });
});

app.listen(PORT, async function () {
  try {
    await ensureDataFile();
  } catch (err) {
    console.error("Could not initialize submissions.json:", err);
  }
  console.log("MausamCrop running at http://localhost:" + PORT);
});
