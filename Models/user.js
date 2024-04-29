const mongoose = require("mongoose");
const bcrypt=require('bcrypt');
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, trim: true, required: true, unique: true },
    password: { type: String, trim: true, required: true },
    profilePic: {
      type: String,
      default: "/images/profilePic.png",
    },
  },
  {
    timestamps: true,
  }
);
userSchema.pre("save", async function (next) {
  const user = this;
  if(!user.isModified("password")) 
  {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;
    next();
  } catch (err) {
    console.log(err);
    return next(err);
  }
});
userSchema.methods.comparePassword = async function (password){
    try {
        const isMatch=await bcrypt.compare(password,this.password);
        return isMatch;
    } catch (err) {
        console.log(err);
        return err;
    }
}
const User = mongoose.model("User", userSchema);
module.exports = User;
