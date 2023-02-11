const fs = require("fs/promises");
const Jimp = require("jimp");
const { User } = require("../utils/schemas/schemaUser");

const loadAvatar = async (req, res, next) => {
  const { path } = req.file;
  const { _id } = req.user;
  const [, extension] = req.file.originalname.split(".");

  const avatarName = `${_id}-avatar.${extension}`;

  await (await Jimp.read(path))
    .resize(250, 250)
    .quality(60)
    .write(`./public/avatars/${avatarName}`);

  await fs.unlink(path);

  const avatarUrl = `/avatars/${avatarName}`;

  const updatedUser = await User.findByIdAndUpdate(
    _id,
    { avatarURL: avatarUrl },
    { new: true }
  );

  res.json({
    avatarURL: updatedUser.avatarURL,
  });
};

module.exports = {
  loadAvatar,
};

// const fs = require("fs/promises");
// const path = require("path");
// const Jimp = require("jimp");
// const { User } = require("../utils/schemas/schemaUser");

// const avatarDir = path.join(__dirname, "../../", "public", "avatars");

// async function loadAvatar(req, res, next) {
//   console.log("req.file", req.file);
//   const { path: tempUpload, filename } = req.file;
//   const { _id } = req.user;
//   const avatarURL = path.join(avatarDir, filename);
//   await fs.rename(tempUpload, avatarURL);
//   const resizedAva = await Jimp.read(avatarURL);
//   resizedAva.resize(250, 250).writeAsync(avatarURL);
//   await User.findByIdAndUpdate(_id, { avatarURL });
//   res.json({
//     avatarURL,
//   });
// }

// module.exports = {
//   loadAvatar,
// };
