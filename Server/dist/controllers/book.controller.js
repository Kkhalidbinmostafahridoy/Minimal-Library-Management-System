"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBook = exports.updateBook = exports.createBook = exports.getBook = exports.getBooks = void 0;
const book_model_1 = require("../models/book.model");
const getBooks = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    try {
        const total = await book_model_1.Book.countDocuments();
        const books = await book_model_1.Book.find().skip(skip).limit(limit);
        res.json({ books, total, page, pages: Math.ceil(total / limit) });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to retrieve books", error });
    }
};
exports.getBooks = getBooks;
const getBook = async (req, res) => {
    try {
        const book = await book_model_1.Book.findById(req.params.id);
        if (!book) {
            res.status(404).json({ message: "Book not found" });
            return;
        }
        res.json(book);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to retrieve the book", error });
    }
};
exports.getBook = getBook;
const createBook = async (req, res) => {
    console.log("POST body received:", req.body);
    try {
        const newBook = new book_model_1.Book(req.body);
        await newBook.save();
        res.status(201).json({ message: "Book created", data: newBook });
    }
    catch (error) {
        res.status(400).json({ message: "Failed to create book", error });
    }
};
exports.createBook = createBook;
const updateBook = async (req, res) => {
    try {
        const updated = await book_model_1.Book.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!updated) {
            res.status(404).json({ message: "Book not found" });
            return; //
        }
        res.json(updated);
    }
    catch (err) {
        res.status(400).json({ message: "Failed to update book", error: err });
    }
};
exports.updateBook = updateBook;
const deleteBook = async (req, res) => {
    try {
        const deleted = await book_model_1.Book.findByIdAndDelete(req.params.id);
        if (!deleted) {
            res.status(404).json({ message: "Book not found" });
            return;
        }
        res.json({ message: "Book deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to delete book", error });
    }
};
exports.deleteBook = deleteBook;
