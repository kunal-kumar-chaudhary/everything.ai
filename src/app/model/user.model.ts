import { UUID } from "crypto";

import mongoose, { Schema, Document } from "mongoose";

// defining user interface
interface User extends Document {
  id: UUID;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  verify_code: boolean;
  role: "USER" | "ADMIN";
}

// preparing shchema of the user model
const UserSchema: Schema<User> = new Schema({
  name: {
    type: String,
    required: [true, "username is required"],
    trim: true,
    unique: true
  },
  email: {
    type: String,
    required: [true, "email is required"],
    unique: true,
    match: [/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/, 'please use a valid email address']
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    required: true,
    default: false
  },
  verify_code: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    enum: ["USER", "ADMIN"], // restricting to USER or ADMIN
    default: "USER" // defaulting to user
  }
});

// mongoose middleware to update the "updatedAt" field
UserSchema.pre("save", function(next){
  if(this.isModified()){
    this.updatedAt = new Date();
  }
  next();
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User >("User", UserSchema))

export default UserModel;


