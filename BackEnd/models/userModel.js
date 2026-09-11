const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true,},
    password: { type: String, required: true },
    pic: {
        type: String,
      required: false,
      default: "",

    },
}, 
  {
    timestamps: true,
  }
);


userSchema.methods.matchPassword=async function (enteredPassword) {      // mongoose built-in method for Match user entered password to hashed password in database 
  return await bcrypt.compare(enteredPassword, this.password);
}


userSchema.pre('save', async function () {
    // 1. If password is not modified, exit this function early
    if (!this.isModified('password')) {
        return; 
    }

    // 2. Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});


const User = mongoose.model("User", userSchema);
module.exports = User;