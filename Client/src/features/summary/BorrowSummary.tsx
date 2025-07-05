import React from "react";
import { Table, Typography, Spin, Alert } from "antd";
// 1. Rename the imported type to 'BorrowSummaryType'
import {
  useGetBorrowSummaryQuery,
  type BorrowSummary as BorrowSummaryType,
} from "../../api/apiSlice";

const { Title } = Typography;

export const BorrowSummary: React.FC = () => {
  const { data, isLoading, isError, error } = useGetBorrowSummaryQuery();

  // 2. Use the new type name for the sorter
  const columns = [
    {
      title: "Book Title",
      dataIndex: "bookTitle",
      key: "bookTitle",
    },
    {
      title: "ISBN",
      dataIndex: "isbn",
      key: "isbn",
    },
    {
      title: "Total Quantity Borrowed",
      dataIndex: "totalQuantityBorrowed",
      key: "totalQuantityBorrowed",
      sorter: (a: BorrowSummaryType, b: BorrowSummaryType) =>
        a.totalQuantityBorrowed - b.totalQuantityBorrowed,
    },
  ];

  if (isLoading) {
    return <Spin size="large" style={{ marginTop: 50 }} />;
  }

  if (isError) {
    return (
      <Alert
        type="error"
        message="Failed to load borrow summary."
        description={
          error && "status" in error
            ? `Error Code: ${error.status}`
            : "Unknown error"
        }
        style={{ marginTop: 50 }}
      />
    );
  }

  return (
    <>
      <Title level={2} style={{ marginBottom: 24 }}>
        Borrow Summary
      </Title>
      <Table
        dataSource={data || []}
        columns={columns}
        // 3. Use the new type name for the rowKey record
        rowKey={(record: BorrowSummaryType) => record.isbn}
        pagination={{ pageSize: 10 }}
        bordered
      />
    </>
  );
};
export default BorrowSummary;
