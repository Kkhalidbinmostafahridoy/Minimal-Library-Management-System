import mongoose from "mongoose";

const borrowSchema = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  quantity: { type: Number, required: true },
  dueDate: { type: Date, required: true, versionKey: false },
});

export const Borrow =
  mongoose.models.Borrow || mongoose.model("Borrow", borrowSchema);
