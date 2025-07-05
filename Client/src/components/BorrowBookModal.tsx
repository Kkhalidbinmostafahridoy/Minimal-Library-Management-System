import React from "react";
import { Modal, Form, InputNumber, DatePicker, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import type { Book } from "../api/apiSlice";
import { useBorrowBookMutation, useUpdateBookMutation } from "../api/apiSlice";
import dayjs from "dayjs";

interface Props {
  visible: boolean;
  onClose: () => void;
  book: Book;
}

export const BorrowBookModal: React.FC<Props> = ({
  visible,
  onClose,
  book,
}) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [borrowBook, { isLoading: isBorrowing }] = useBorrowBookMutation();
  const [updateBook, { isLoading: isUpdating }] = useUpdateBookMutation();

  const handleFinish = async (values: {
    quantity: number;
    dueDate: dayjs.Dayjs;
  }) => {
    const { quantity, dueDate } = values;
    const remainingCopies = book.copies - quantity;

    try {
      await borrowBook({
        bookId: book._id,
        quantity,
        dueDate: dueDate.format("YYYY-MM-DD"),
      }).unwrap();

      await updateBook({
        _id: book._id,
        copies: remainingCopies,
        available: remainingCopies > 0,
      }).unwrap();

      message.success(
        `Successfully borrowed ${quantity} cop(y/ies) of ${book.title}`
      );
      onClose();
      navigate("/summary");
    } catch (err) {
      console.log(err);
      message.error("Failed to process the borrow request.");
    }
  };

  return (
    <Modal
      title={`Borrow: ${book.title}`}
      open={visible}
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="quantity"
          label="Quantity"
          rules={[
            { required: true, message: "Please input the quantity!" },
            { type: "number", min: 1, message: "Quantity must be at least 1" },
            {
              type: "number",
              max: book.copies,
              message: `Cannot borrow more than available copies (${book.copies})`,
            },
          ]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          name="dueDate"
          label="Due Date"
          rules={[{ required: true, message: "Please select a due date!" }]}
        >
          <DatePicker
            style={{ width: "100%" }}
            disabledDate={(current) =>
              current && current < dayjs().startOf("day")
            }
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={isBorrowing || isUpdating}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};
