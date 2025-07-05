import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetBooksQuery, useDeleteBookMutation } from "../api/apiSlice";
// import type { Book } from "../types"; // <---- type-only import here
import type { Book } from "../api/apiSlice";
import toast from "react-hot-toast";
import { Popconfirm } from "antd";
import { BorrowBookModal } from "../components/BorrowBookModal";

const BooksPage: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error } = useGetBooksQuery({
    page,
    limit: 10,
  });

  const [deleteBook] = useDeleteBookMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const handleDelete = async (id: string) => {
    try {
      await deleteBook(id).unwrap();
      toast.success("Book deleted successfully");
    } catch {
      toast.error("Failed to delete book");
    }
  };

  const openBorrowModal = (book: Book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  if (isLoading) return <div className="text-center">Loading books...</div>;
  if (isError)
    return (
      <div className="text-center text-red-500">
        Error:{" "}
        {(error as { data?: { message?: string } })?.data?.message ||
          "Failed to load books."}
      </div>
    );

  return (
    <div className="overflow-x-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Book List</h1>

      <div className="shadow-md rounded-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-3 px-6 text-left">Title</th>
              <th className="py-3 px-6 text-left">Author</th>
              <th className="py-3 px-6 text-left">Genre</th>
              <th className="py-3 px-6 text-left">ISBN</th>
              <th className="py-3 px-6 text-center">Copies</th>
              <th className="py-3 px-6 text-center">Availability</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {data?.books.map((book) => (
              <tr key={book._id} className="border-b hover:bg-gray-100">
                <td className="py-3 px-6">{book.title}</td>
                <td className="py-3 px-6">{book.author}</td>
                <td className="py-3 px-6">{book.genre}</td>
                <td className="py-3 px-6">{book.isbn}</td>
                <td className="py-3 px-6 text-center">{book.copies}</td>
                <td className="py-3 px-6 text-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      book.available
                        ? "bg-green-200 text-green-800"
                        : "bg-red-200 text-red-800"
                    }`}
                  >
                    {book.available ? "Available" : "Unavailable"}
                  </span>
                </td>
                <td className="py-3 px-6 text-center">
                  <button
                    onClick={() => navigate(`/edit-book/${book._id}`)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 mr-2"
                    aria-label={`Edit ${book.title}`}
                  >
                    Edit
                  </button>

                  <Popconfirm
                    title="Delete the book"
                    description="Are you sure you want to delete this book?"
                    onConfirm={() => handleDelete(book._id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 mr-2"
                      aria-label={`Delete ${book.title}`}
                    >
                      Delete
                    </button>
                  </Popconfirm>

                  <button
                    onClick={() => openBorrowModal(book)}
                    disabled={!book.available}
                    className={`px-3 py-1 rounded text-white hover:bg-yellow-600 ${
                      book.available
                        ? "bg-yellow-500"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                    aria-disabled={!book.available}
                    aria-label={`Borrow ${book.title}`}
                  >
                    Borrow
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 mx-1 bg-gray-300 rounded disabled:opacity-50"
          aria-disabled={page === 1}
        >
          Previous
        </button>
        <span className="px-4 py-2">
          Page {data?.page ?? 1} of {data?.pages ?? 1}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, data?.pages ?? 1))}
          disabled={page === (data?.pages ?? 1)}
          className="px-4 py-2 mx-1 bg-gray-300 rounded disabled:opacity-50"
          aria-disabled={page === (data?.pages ?? 1)}
        >
          Next
        </button>
      </div>

      {selectedBook && (
        <BorrowBookModal
          visible={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          book={selectedBook}
        />
      )}
    </div>
  );
};

export default BooksPage;
