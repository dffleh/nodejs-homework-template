const { User } = require("../utils/schemas/schemaUser");
const { HttpError } = require("../utils/helpers/httpError");
const { sendMail } = require("../utils/validation/validationToken");
const port = require("../server.js");

async function current(req, res, next) {
  const { user } = req;
  const { email, subscription } = user;

  return res.status(200).json({
    data: {
      user: {
        email,
        subscription,
      },
    },
  });
}

async function getContact(req, res, next) {
  const { user } = req;
  const userWithContacts = await User.findById(user._id).populate("contacts", {
    name: 1,
    phone: 1,
    _id: 1,
  });

  return res.status(200).json({
    data: {
      contacts: userWithContacts.contacts,
    },
  });
}

async function createContact(req, res, next) {
  const { user } = req;
  const { id: contactId } = req.body;

  user.contacts.push({ _id: contactId });

  const updatedUser = await User.findByIdAndUpdate(user._id, user, {
    new: true,
  }).select({
    contacts: 1,
    _id: 0,
  });

  console.log("updatedUser", updatedUser);

  return res.status(201).json({
    data: {
      contacts: updatedUser.contacts,
    },
  });
}

const updateSubscription = async (req, res, next) => {
  const { _id } = req.user;
  const { subscription } = req.body;

  const user = await User.findById(_id);

  if (!user || !user.token) return next(new HttpError(401, "Not authorized"));

  const updatedUser = await User.findByIdAndUpdate(
    _id,
    { subscription: subscription },
    { new: true }
  );

  res.json({
    email: user.email,
    subscription: updatedUser.subscription,
  });
};

async function verifyEmail(req, res, next) {
  const { verificationToken } = req.params;
  const user = await User.findOne({
    verificationToken: verificationToken,
  });

  if (!user) {
    throw new HttpError(404, "User not found");
  }

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });

  return res.status(200).json({
    message: "Verification successful",
  });
}

async function resendVerifyEmail(req, res, next) {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw new HttpError(400, "missing required field email");
  }

  if (user.verify) {
    throw new HttpError(400, "Verification has already been passed");
  }

  await sendMail({
    to: email,
    subject: "Please confirm your email",
    html: `<a href="localhost:${port}/api/users/verify/${user.verificationToken}">Confirm your email</a>`,
  });

  res.json({
    message: "Verification email sent",
  });
}

module.exports = {
  current,
  getContact,
  createContact,
  updateSubscription,
  verifyEmail,
  resendVerifyEmail,
};
