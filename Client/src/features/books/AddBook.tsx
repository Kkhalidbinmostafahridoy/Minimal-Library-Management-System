import React from "react";
import { Form, Input, Button, InputNumber, message, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { useAddBookMutation } from "../../api/apiSlice";

const { Title } = Typography;

export const AddBook: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [addBook, { isLoading }] = useAddBookMutation();

  const onFinish = async (values: {
    title: string;
    author: string;
    genre: string;
    isbn: string;
    description: string;
    copies: number;
  }) => {
    try {
      await addBook({ ...values, available: values.copies > 0 }).unwrap();
      message.success("Book added successfully!");
      form.resetFields();
      navigate("/");
    } catch (err) {
      console.log(err);
      message.error("Failed to add book.");
    }
  };

  return (
    <>
      <Title level={2}>Add a New Book</Title>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ copies: 1 }}
      >
        <Form.Item name="title" label="Title" rules={[{ required: true }]}>
          <Input placeholder="Enter book title" />
        </Form.Item>
        <Form.Item name="author" label="Author" rules={[{ required: true }]}>
          <Input placeholder="Enter author's name" />
        </Form.Item>
        <Form.Item name="genre" label="Genre" rules={[{ required: true }]}>
          <Input placeholder="Enter book genre" />
        </Form.Item>
        <Form.Item name="isbn" label="ISBN" rules={[{ required: true }]}>
          <Input placeholder="Enter ISBN number" />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true }]}
        >
          <Input.TextArea rows={4} placeholder="Enter book description" />
        </Form.Item>
        <Form.Item
          name="copies"
          label="Copies"
          rules={[{ required: true, type: "number", min: 0 }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            placeholder="Enter number of copies"
          />
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
