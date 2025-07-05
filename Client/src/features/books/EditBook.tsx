import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  InputNumber,
  message,
  Spin,
  Typography,
} from "antd";
import { useGetBookQuery, useUpdateBookMutation } from "../../api/apiSlice";

const { Title } = Typography;

export const EditBook: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  // Use string id
  const { data: book, isLoading: isFetching, isError } = useGetBookQuery(id!);
  const [updateBook, { isLoading: isUpdating }] = useUpdateBookMutation();

  useEffect(() => {
    if (book) {
      form.setFieldsValue(book);
    }
  }, [book, form]);

  const onFinish = async (values: {
    title: string;
    author: string;
    genre: string;
    isbn: string;
    description: string;
    copies: number;
  }) => {
    try {
      await updateBook({
        _id: id!,
        ...values,
        available: values.copies > 0,
      }).unwrap();
      message.success("Book updated successfully!");
      navigate("/");
    } catch {
      message.error("Failed to update book.");
    }
  };

  if (isFetching) return <Spin size="large" style={{ marginTop: 50 }} />;
  if (isError)
    return (
      <Title level={3} type="danger">
        Book not found.
      </Title>
    );

  return (
    <>
      <Title level={2}>Edit Book</Title>
      <Form form={form} layout="vertical" onFinish={onFinish}>
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
          <Button type="primary" htmlType="submit" loading={isUpdating}>
            Update Book
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};
export default EditBook;
