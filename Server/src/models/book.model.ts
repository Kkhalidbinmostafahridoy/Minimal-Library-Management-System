import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: String, required: true },
  isbn: { type: String, required: true },
  description: { type: String, required: true },
  copies: { type: Number, required: true },
  available: { type: Boolean, required: true, versionKey: false },
});

export const Book = mongoose.models.Book || mongoose.model("Book", bookSchema);
