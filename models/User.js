const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// 1. Define the Blueprint (Schema) for a User
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, // No two users can have the same email
    trim: true,   // Removes extra spaces
    lowercase: true // Normalizes emails to lowercase
  },
  password: {
    type: String,
    required: true
  }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

// 2. Hash the password BEFORE saving it to the database
// This runs every time we call user.save()
userSchema.pre('save', async function (next) {
  const user = this;

  // If the password hasn't been changed, move on
  if (!user.isModified('password')) return next();

  try {
    // Generate a "salt" (random text to make the hash unique)
    const salt = await bcrypt.genSalt(10);
    // Hash the password combined with the salt
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// 3. Create a helper method to check if a password is correct during login
userSchema.methods.comparePassword = async function (candidatePassword) {
  // Compares the typed password with the hashed password in the database
  return await bcrypt.compare(candidatePassword, this.password);
};

// 4. Create the Model using the Schema and export it
const User = mongoose.model('User', userSchema);
module.exports = User;
