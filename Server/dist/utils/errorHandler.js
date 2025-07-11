"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, _req, res, _next) => {
    console.error(err.stack);
    res
        .status(500)
        .json({ message: "Internal Server Error", error: err.message });
};
exports.errorHandler = errorHandler;
