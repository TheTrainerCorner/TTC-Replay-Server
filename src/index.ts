import express from "express";

// Routers
import replayRouter from "./routes/replays";

const app = express();
const PORT = 9000;

app.use("/replays", replayRouter);

app.get("/", (req, res) => {
  res.send("Hello");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
