"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBorrowSummary = exports.borrowBook = void 0;
const borrow_model_1 = require("../models/borrow.model");
const book_model_1 = require("../models/book.model");
const borrowBook = async (req, res) => {
    const { bookId, quantity, dueDate } = req.body;
    // Validate the request body
    if (!bookId || !quantity || !dueDate) {
        res.status(400).json({ message: "Invalid request body" });
        return;
    }
    try {
        const book = await book_model_1.Book.findById(bookId);
        if (!book) {
            res.status(404).json({ message: "Book not found" });
            return;
        }
        if (book.copies < quantity) {
            res.status(400).json({ message: "Not enough copies available" });
            return;
        }
        // Create the borrow record
        const borrow = new borrow_model_1.Borrow({ bookId, quantity, dueDate });
        await borrow.save();
        // Update book availability
        book.copies -= quantity;
        book.available = book.copies > 0;
        await book.save();
        res.status(201).json({ message: "Book borrowed successfully" });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Failed to process borrow request", error });
    }
};
exports.borrowBook = borrowBook;
const getBorrowSummary = async (_req, res) => {
    try {
        const summary = await borrow_model_1.Borrow.aggregate([
            {
                $lookup: {
                    from: "books",
                    localField: "bookId",
                    foreignField: "_id",
                    as: "book",
                },
            },
            { $unwind: "$book" },
            {
                $group: {
                    _id: "$bookId",
                    bookTitle: { $first: "$book.title" },
                    isbn: { $first: "$book.isbn" },
                    totalQuantityBorrowed: { $sum: "$quantity" },
                },
            },
            { $project: { _id: 0, bookTitle: 1, isbn: 1, totalQuantityBorrowed: 1 } },
        ]);
        res.json(summary);
    }
    catch (error) {
        console.error("Aggregation Error:", error);
        // Send a more informative error response
        res.status(500).json({
            message: "Failed to get borrow summary.",
            error: error.message || "An unknown error occurred.", //
        });
    }
};
exports.getBorrowSummary = getBorrowSummary;
