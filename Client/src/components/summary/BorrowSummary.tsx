import React from "react";
import { Table, Typography, Spin, Alert } from "antd";
import { useGetBorrowSummaryQuery } from "../../api/apiSlice";

const { Title } = Typography;

export const BorrowSummary: React.FC = () => {
  const { data: summaryData, isLoading, isError } = useGetBorrowSummaryQuery();

  const columns = [
    { title: "Book Title", dataIndex: "bookTitle", key: "bookTitle" },
    { title: "ISBN", dataIndex: "isbn", key: "isbn" },
    {
      title: "Total Quantity Borrowed",
      dataIndex: "totalQuantityBorrowed",
      key: "totalQuantityBorrowed",
    },
  ];

  if (isLoading)
    return <Spin size="large" style={{ display: "block", marginTop: 50 }} />;

  if (isError)
    return (
      <Alert
        message="Error"
        description="Failed to load borrow summary."
        type="error"
        showIcon
        style={{ marginTop: 50 }}
      />
    );

  return (
    <div style={{ padding: "1rem" }}>
      <Title level={2}>Borrow Summary</Title>
      <Table
        dataSource={summaryData || []}
        columns={columns}
        rowKey="isbn"
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};
