const express = require("express");

const { signup, login, logout } = require("../../controllers/auth.controller");
const { tryCatchWrapper } = require("../../utils/helpers/rtyCatchHelper");
const { authToken, upload } = require("../../utils/validation/validationToken");
const { loadAvatar } = require("../../controllers/uploadAvatar");

const authRouter = express.Router();

authRouter.post("/signup", tryCatchWrapper(signup));
authRouter.post("/login", tryCatchWrapper(login));
authRouter.post("/logout", tryCatchWrapper(authToken), tryCatchWrapper(logout));
authRouter.patch(
  "/users/avatars",
  tryCatchWrapper(authToken),
  upload.single("avatar"),
  tryCatchWrapper(loadAvatar)
);

module.exports = {
  authRouter,
};
