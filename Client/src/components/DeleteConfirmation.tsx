import React from "react";
import { Button, Popconfirm, message } from "antd";
import { useDeleteBookMutation } from "../api/apiSlice";

interface Props {
  bookId: string; // Updated from number to string to match Book._id type
}

export const DeleteConfirmation: React.FC<Props> = ({ bookId }) => {
  const [deleteBook, { isLoading }] = useDeleteBookMutation();

  const handleDelete = async () => {
    try {
      await deleteBook(bookId).unwrap();
      message.success("Book deleted successfully");
    } catch {
      message.error("Failed to delete book");
    }
  };

  return (
    <Popconfirm
      title="Delete the book"
      description="Are you sure you want to delete this book?"
      onConfirm={handleDelete}
      okText="Yes"
      cancelText="No"
    >
      <Button danger loading={isLoading}>
        Delete
      </Button>
    </Popconfirm>
  );
};
