import express from "express";
import {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
} from "../controllers/book.controller";

const router = express.Router();

router.get("/", getBooks);
router.get("/:id", getBook);
router.post("/", createBook);
router.patch("/:id", updateBook);
router.delete("/:id", deleteBook);

export default router;
