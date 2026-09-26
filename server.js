require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const uploadRoutes = require("./routes/upload");
const agentRoutes = require("./routes/agents");
const projectRoutes = require("./routes/projects");
const taskRoutes = require("./routes/tasks");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

// Health check - hit this first to confirm the server is running
app.get("/", (req, res) => {
  res.json({ status: "SprintGenius AI backend is running" });
});

app.use("/upload", uploadRoutes);
app.use("/agents", agentRoutes);
app.use("/projects", projectRoutes);
app.use("/tasks", taskRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`SprintGenius AI backend listening on port ${PORT}`);
});
