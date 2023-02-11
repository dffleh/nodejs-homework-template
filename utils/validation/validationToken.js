const { HttpError } = require("../../utils/helpers/httpError");
const { User } = require("../../utils/schemas/schemaUser");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");

async function authToken(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const [type, token] = authHeader.split(" ");

  if (type !== "Bearer") {
    throw new HttpError(401, "Not authorized");
  }

  if (!token) {
    throw new HttpError(401, "Not authorized");
  }

  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(id);
    console.log("user", user);

    req.user = user;
  } catch (error) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      throw new HttpError(401, "Not authorized");
    }
    throw error;
  }

  next();
}

const storage = multer.diskStorage({
  dest: function (req, file, cb) {
    cb(null, path.resolve(__dirname, "../tmp"));
  },
  filename: function (req, file, cb) {
    cb(null, Math.round(Math.random() * 100) + file.originalname);
  },
});

const upload = multer({
  storage,
});

module.exports = { authToken, upload };
