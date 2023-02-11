const express = require("express");
const { tryCatchWrapper } = require("../../utils/helpers/rtyCatchHelper");
const {
  current,
  createContact,
  getContact,
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

module.exports = userRouter;
