import mongoose from "mongoose";
import app from "./app";

const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://mongodb:mongodb@cluster0.pv5rt6u.mongodb.net/Minimal_Library_Management_System?retryWrites=true&w=majority";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
