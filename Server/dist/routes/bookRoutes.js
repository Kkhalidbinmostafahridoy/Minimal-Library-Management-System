"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const book_controller_1 = require("../controllers/book.controller");
const router = express_1.default.Router();
router.get("/", book_controller_1.getBooks);
router.get("/:id", book_controller_1.getBook);
router.post("/", book_controller_1.createBook);
router.patch("/:id", book_controller_1.updateBook);
router.delete("/:id", book_controller_1.deleteBook);
exports.default = router;
