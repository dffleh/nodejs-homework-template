const express = require("express");
const { tryCatchWrapper } = require("../../utils/helpers/rtyCatchHelper");
const {
  current,
  createContact,
  getContact,
  verifyEmail,
  resendVerifyEmail,
} = require("../../controllers/user.controller");
const { authToken } = require("../../utils/validation/validationToken");
const userRouter = express.Router();

userRouter.get(
  "/current",
  tryCatchWrapper(authToken),
  tryCatchWrapper(current)
);
userRouter.post(
  "/contacts",
  tryCatchWrapper(authToken),
  tryCatchWrapper(createContact)
);
userRouter.get(
  "/contacts",
  tryCatchWrapper(authToken),
  tryCatchWrapper(getContact)
);
userRouter.get(
  "/current",
  tryCatchWrapper(authToken),
  tryCatchWrapper(current)
);
userRouter.get("/verify/:verificationToken", tryCatchWrapper(verifyEmail));
userRouter.post("/verify", tryCatchWrapper(resendVerifyEmail));

module.exports = userRouter;
