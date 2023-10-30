const express = require("express");
const router = express.Router();
const fs = require("fs");

router.get("/", (_req, res) => {
  const videosJSON = fs.readFileSync("./data/videos.json");
  const videos = JSON.parse(videosJSON);
  const videoDataSimple = videos.map((video) => ({
    id: video.id,
    title: video.title,
    channel: video.channel,
    image: video.image,
  }));
  res.send(videoDataSimple);
});

router.get("/:videoId", (req, res) => {
  const { videoId } = req.params;
  const videosJSON = fs.readFileSync("./data/videos.json");
  const videos = JSON.parse(videosJSON);

  const foundVideo = videos.find((video) => video.id === videoId);

  if (foundVideo) {
    res.send(foundVideo);
  } else {
    res.status(400).send("That ID Doesn't Correspond to a Video");
  }
});

module.exports = router;
