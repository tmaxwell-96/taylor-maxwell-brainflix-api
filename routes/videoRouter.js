const express = require("express");
const router = express.Router();
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

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

router.post("/upload", (req, res) => {
  res.send("made it to the server");

  const videos = JSON.parse(fs.readFileSync("./data/videos.json"));

  const newVideo = {
    title: req.body.title,
    description: req.body.description,
    id: uuidv4(),
    channel: "Red Cow",
    image: "skiing.jpg",
    views: "0",
    likes: "0",
    duration: "4:01",
    video: "https://project-2-api.herokuapp.com/stream",
    timestamp: Date.now(),
    comments: [],
  };

  videos.push(newVideo);
  fs.writeFileSync("./data/videos.json", JSON.stringify(videos));
});

//Post comment route
//-----------------------------

router.post("/:videoId/comments", (req, res) => {
  const videos = JSON.parse(fs.readFileSync("./data/videos.json"));

  const newComment = {
    name: req.body.name,
    comment: req.body.comment,
    id: uuidv4(),
    timestamp: Date.now(),
    likes: 0,
  };
  const foundVideo = videos.find((video) => video.id === req.params.videoId);
  foundVideo.comments.push(newComment);

  fs.writeFileSync("./data/videos.json", JSON.stringify(videos));
  res.send("Comment posted!");
});

module.exports = router;
