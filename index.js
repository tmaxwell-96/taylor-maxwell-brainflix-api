require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const videoRouter = require("./routes/videoRouter");

const { PORT } = process.env;

//Middleware
//-----------------------------
app.use(express.json());
app.use(express.static("public"));
app.use(cors());

//Routes to videos
//-----------------------------
app.use("/videos", videoRouter);

app.get("/", (_req, res) => {
  res.send("Connected to the server");
});

app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`);
});
