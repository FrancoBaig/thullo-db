const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./mysql_connector");
const cloudinary = require("./cloudinary/cloudinary");
const middleware = require("./utils/middleware");
const registerRouter = require("./router/register");
const photoRouter = require("./router/photo");
const boardRouter = require("./router/board");

app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);

app.listen(3001, () => {
	console.log("Listening port -> 3001");
});

app.use("/api/register", registerRouter);
app.use("/api/photo", photoRouter);
app.use("/api/board", boardRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);
