import mongoose from "mongoose";

const signupSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "username is required"],
      unique: [true, "username must be unique"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: [true, "email must be unique"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
      min: [8, "password must be 8 or more character"],
      max: [10, "password must be 10 or less character"],
    },
    role: {
      type: String,
      enum: {
        values: ["user", "admin"],
        message: "{VALUE} is not a valid role",
      },
      default: "user",
      required: [true, "role is required"],
    },
    profilePicture: {
      type: String,
    },
    emailConfirmed: {
      type: Boolean,
      default: false,
      required: [true, "confirmed is required"],
    },
    phoneNumber: {
      type: String,
      unique: [true, "phone number must be unique"],
    },
  },
  { timestamps: true },
);

export const SignUpModel = mongoose.model("users", signupSchema);
