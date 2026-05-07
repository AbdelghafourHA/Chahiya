import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "./models/admin.model.js";

dotenv.config();

mongoose.connect(process.env.MONGODB_URI);

const createAdmin = async () => {
  await Admin.create({
    email: "chahiya@gmail.com",
    password: "Aa12chahiya12Aa",
  });
  console.log("Admin created successfully");
  mongoose.disconnect();
};

createAdmin();
