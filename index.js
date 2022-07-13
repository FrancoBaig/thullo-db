const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./mysql_connector");
const cloudinary = require("./cloudinary/cloudinary");
const registerRouter = require("./router/register");
const photoRouter = require("./router/photo");
app.use(cors());

app.listen(3001, () => {
	console.log("Listening port 3001");
});

app.use(express.json());

app.use("/api/register", registerRouter);
app.use("/api/photo", photoRouter);
