import React from "react";
import { Typography, Form, Input, InputNumber, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useAddBookMutation } from "../api/apiSlice";

const { Title } = Typography;

const AddBookPage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [addBook, { isLoading }] = useAddBookMutation();

  const onFinish = async (values: unknown) => {
    try {
      // Add the book, setting 'available' automatically
      await addBook({ ...values, available: values.copies > 0 }).unwrap();
      message.success("Book added successfully!");
      form.resetFields();
      navigate("/");
    } catch {
      message.error("Failed to add book.");
    }
  };

  return (
    <>
      <Title level={2}>Add New Book</Title>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ copies: 1 }}
      >
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: "Please enter the book title" }]}
        >
          <Input placeholder="Enter book title" />
        </Form.Item>

        <Form.Item
          name="author"
          label="Author"
          rules={[{ required: true, message: "Please enter the author name" }]}
        >
          <Input placeholder="Enter author name" />
        </Form.Item>

        <Form.Item
          name="genre"
          label="Genre"
          rules={[{ required: true, message: "Please enter the genre" }]}
        >
          <Input placeholder="Enter genre" />
        </Form.Item>

        <Form.Item
          name="isbn"
          label="ISBN"
          rules={[{ required: true, message: "Please enter the ISBN" }]}
        >
          <Input placeholder="Enter ISBN" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please enter a description" }]}
        >
          <Input.TextArea rows={4} placeholder="Enter book description" />
        </Form.Item>

        <Form.Item
          name="copies"
          label="Copies"
          rules={[
            { required: true, message: "Please enter number of copies" },
            { type: "number", min: 0, message: "Copies cannot be negative" },
          ]}
        >
          <InputNumber style={{ width: "100%" }} min={0} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Add Book
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default AddBookPage;
