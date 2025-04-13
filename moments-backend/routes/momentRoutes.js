const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const verifyToken = require("../middlewares/auth");
const Moment = require("../models/Moment");
const { StatusCodes } = require("http-status-codes");

/**
 * Upload Config
 */

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

/**
 * Add or create moment
 */

router.post("/", verifyToken, upload.single("image"), async (req, res) => {
  try {
    const { comment, tags } = req.body;

    if (!req.file || !comment) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ status: false, message: "Image and comment are required" });
    }

    if (comment.length > 100) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ status: false, message: "Comment must be max 100 characters" });
    }

    const moment = new Moment({
      user: req.user.id,
      image: req.file.path, // Store image path
      comment,
      tags: tags ? tags.split(",") : [],
      createdAt: new Date(),
    });

    const result = await moment.save();
    res
      .status(StatusCodes.CREATED)
      .json({ status: true, message: "Moment created", data: result });
  } catch (err) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ status: true, message: err.message });
  }
});

/**
 * Fetch moment by moment id
 */

router.get("/:momentId", async (req, res) => {
  try {
    const { momentId } = req.params;

    const moment = await Moment.findById(momentId);

    if (!moment) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: false,
        message: "Moment not found",
      });
    }

    res.status(StatusCodes.OK).json({
      status: true,
      message: "Moment fetched successfully.",
      data: moment,
    });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: "Server Error",
    });
  }
});

/**
 * List all moments created by user
 */

router.get("/", verifyToken, async (req, res) => {
  try {
    const { id: userId } = req.user;

    const moments = await Moment.find({ user: userId }).sort({ createdAt: -1 });

    res.status(StatusCodes.OK).json({
      status: true,
      message: "Moments listed successfully.",
      data: moments,
    });
  } catch (err) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ status: false, message: "Server Error", data: null });
  }
});

module.exports = router;