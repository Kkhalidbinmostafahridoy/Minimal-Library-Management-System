import { type Request, type Response } from "express";
import { Book } from "../models/book.model";

export const getBooks = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  try {
    const total = await Book.countDocuments();
    const books = await Book.find().skip(skip).limit(limit);
    res.json({ books, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve books", error });
  }
};

export const getBook = async (req: Request, res: Response) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      res.status(404).json({ message: "Book not found" });
      return;
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve the book", error });
  }
};

export const createBook = async (req: Request, res: Response) => {
  console.log("POST body received:", req.body);

  try {
    const newBook = new Book(req.body);
    await newBook.save();
    res.status(201).json({ message: "Book created", data: newBook });
  } catch (error) {
    res.status(400).json({ message: "Failed to create book", error });
  }
};

export const updateBook = async (req: Request, res: Response) => {
  try {
    const updated = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) {
      res.status(404).json({ message: "Book not found" });
      return; //
    }
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: "Failed to update book", error: err });
  }
};

export const deleteBook = async (req: Request, res: Response) => {
  try {
    const deleted = await Book.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ message: "Book not found" });
      return;
    }
    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete book", error });
  }
};
