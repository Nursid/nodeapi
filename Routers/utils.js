const express = require("express");
const router = express.Router();
const multer = require("multer");

// storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./static/uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const generatedFileName = uniqueSuffix + "-" + file.originalname;
    cb(null, generatedFileName); // Use the generated file name
  },
});

const myStorage = multer({ storage: storage });

router.post("/uploadfile", myStorage.single("myfile"), (req, res) => {
  if (!req.file) {
    // Handle the case where no file was uploaded.
    return res.status(400).json({
      message: "No file uploaded",
    });
  }

  // File was successfully uploaded
  const generatedFileName = req.file.filename;

  res.status(200).json({
    message: "Successfully Uploaded",
    fileName: generatedFileName,
  });
});

module.exports = router;
