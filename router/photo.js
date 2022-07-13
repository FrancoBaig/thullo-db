const photoRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const pool = require("../mysql_connector");
const cloudinary = require("../cloudinary/cloudinary");
const { updatePhoto } = require("../operations");

photoRouter.post("/", async (req, res) => {
	const { image, token } = req.body;

	console.log("token", token);

	let user = {};

	try {
		user = jwt.verify(token, process.env.JWT_SECRET);
	} catch (err) {
		return res.json({ status: "error", error: ";))" });
	}

	cloudinary.uploader.upload(
		image,
		{
			upload_preset: "rjqgdt0j",
			alowed_formats: [
				"png",
				"jpg",
				"jpeg",
				"svg",
				"ico",
				"jfif",
				"webp",
			],
		},
		async function (error, result) {
			const data = {
				imageId: result.public_id,
				userId: user.id,
			};

			await updatePhoto(pool, data);

			res.status(200).json(result);
		}
	);
});

module.exports = photoRouter;
