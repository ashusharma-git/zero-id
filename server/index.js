const express = require("express");
const bodyParser = require("body-parser");
const generateInput = require("./module/generateInput");
const createZkBadge = require("./module/createZkBadge");
const verifyKyc = require("./module/verifyKyc");
const { validateCredential } = require("./middleware/auth");

const app = express();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/zero-id", (req, res) => {
  res.send("zero-knowledge-proof based itentification system");
});

app.post("/create/zero-id", async (req, res) => {
  const { id_number } = req.body;
  if (!id_number || id_number.length == 0) {
    res.status(400).json({
      message: "Bad request.",
    });
    return;
  }
  {
    // check for status from passbase
  }
  let gen = await generateInput(id_number);
  let badge = await createZkBadge(id_number);
  // console.log({ gen: gen, badge: badge });

  if (gen && badge) {
    res.status(200).json({
      message: "Zero-ID created by Cipher Force.",
    });
    return;
  }
  res.status(500).json({
    message: "Server Error. Please try again later.",
  });
});

app.post("/status/zero-id", async (req, res) => {
  const { id_number } = req.body;
  if (!id_number || id_number.length == 0) {
    res.status(400).json({
      message: "Bad request.",
    });
    return;
  }
  const isVerified = await verifyKyc(id_number);
  res.status(200).json({
    "Zero-ID status": isVerified,
    message: "Zero-ID verification by Cipher Force.",
  });
});

app.listen(process.env.PORT || 5000, () => {
  console.log("server is running in port 5000");
});
