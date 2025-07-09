import React, { useState } from "react";
import { Table, Button, Space, Tag, Spin, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { useGetBooksQuery } from "../../api/apiSlice";
import type { Book } from "../../api/apiSlice";
import { DeleteConfirmation } from "../../components/DeleteConfirmation";
import { BorrowBookModal } from "../../components/BorrowBookModal";

const { Title } = Typography;

export const BookList: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetBooksQuery({
    page: 1,
    limit: 100,
  });
  const [borrowModalVisible, setBorrowModalVisible] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const handleBorrowClick = (book: Book) => {
    setSelectedBook(book);
    setBorrowModalVisible(true);
  };

  const handleCloseModal = () => {
    setSelectedBook(null);
    setBorrowModalVisible(false);
  };

  const columns = [
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Author", dataIndex: "author", key: "author" },
    { title: "Genre", dataIndex: "genre", key: "genre" },
    { title: "ISBN", dataIndex: "isbn", key: "isbn" },
    { title: "Copies", dataIndex: "copies", key: "copies" },
    {
      title: "Availability",
      dataIndex: "available",
      key: "available",
      render: (available: boolean) => (
        <Tag color={available ? "green" : "red"}>
          {available ? "Available" : "Unavailable"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: Book) => (
        <Space size="middle">
          <Button
            type="primary"
            onClick={() => navigate(`/edit/${record._id}`)}
          >
            Edit
          </Button>
          <DeleteConfirmation bookId={record._id} />
          <Button
            disabled={!record.available}
            onClick={() => handleBorrowClick(record)}
          >
            Borrow
          </Button>
        </Space>
      ),
    },
  ];

  if (isLoading) return <Spin size="large" style={{ marginTop: 50 }} />;
  if (isError)
    return (
      <Title level={3} type="danger">
        Failed to load books.
      </Title>
    );

  return (
    <>
      <Title level={2}>All Books</Title>
      <Table
        dataSource={data?.books || []}
        columns={columns}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
      />
      {selectedBook && (
        <BorrowBookModal
          visible={borrowModalVisible}
          onClose={handleCloseModal}
          book={selectedBook}
        />
      )}
    </>
  );
};
