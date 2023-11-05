const express = require("express");
const router = express.Router();
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

//Shortened videolist route
//-----------------------------
router.get("/", (_req, res) => {
  const videos = JSON.parse(fs.readFileSync("./data/videos.json"));
  const videoDataSimple = videos.map((video) => ({
    id: video.id,
    title: video.title,
    channel: video.channel,
    image: video.image,
  }));
  res.send(videoDataSimple);
});

//Specific video details route
//-----------------------------
router.get("/:videoId", (req, res) => {
  const { videoId } = req.params;
  const videos = JSON.parse(fs.readFileSync("./data/videos.json"));

  const foundVideo = videos.find((video) => video.id === videoId);

  if (foundVideo) {
    res.send(foundVideo);
  } else {
    res.status(400).send("That ID Doesn't Correspond to a Video");
  }
});

//Video upload route
//-----------------------------
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

  if (newVideo) {
    videos.push(newVideo);
    fs.writeFileSync("./data/videos.json", JSON.stringify(videos));
  } else {
    res.status(400).send(`Expecting "title" and "description`);
  }
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

  if (newComment) {
    const foundVideo = videos.find((video) => video.id === req.params.videoId);
    foundVideo.comments.push(newComment);

    fs.writeFileSync("./data/videos.json", JSON.stringify(videos));
    res.send("Comment posted");
  } else {
    res.status(400).send(`Expecting "name" and "comment`);
  }
});

//Delete comment route
//-----------------------------

router.delete("/:videoId/comments/:commentId", (req, res) => {
  const videos = JSON.parse(fs.readFileSync("./data/videos.json"));
  const foundVideo = videos.find((video) => video.id === req.params.videoId);
  const foundComment = foundVideo.comments.find(
    (comment) => comment.id === req.params.commentId
  );

  foundVideo.comments = foundVideo.comments.filter(
    (comment) => comment.id !== foundComment.id
  );
  if (foundVideo) {
    fs.writeFileSync("./data/videos.json", JSON.stringify(videos));
    res.send("Comment Deleted");
  } else {
    res.status(400).send(`Internal error, we apologize for the confusion`);
  }
});

//Like comment route
//-----------------------------

router.put("/:videoId/comments/:commentId", (req, res) => {
  const videos = JSON.parse(fs.readFileSync("./data/videos.json"));
  const foundVideo = videos.find((video) => video.id === req.params.videoId);
  const foundComment = foundVideo.comments.find(
    (comment) => comment.id === req.params.commentId
  );
  if (foundVideo) {
    foundComment.likes = foundComment.likes + 1;
    fs.writeFileSync("./data/videos.json", JSON.stringify(videos));
    res.send("Comment liked");
  } else {
    res.status(400).send(`Internal error, we apologize for the confusion`);
  }
});

module.exports = router;
