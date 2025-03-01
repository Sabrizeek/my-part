// src/components/UpdateEvent.js
import React from 'react';
import { Form, Input, Button, DatePicker, Modal } from 'antd';
import moment from 'moment';
import { updateEvent } from '../api';

const UpdateEvent = ({ event, visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (event) {
      form.setFieldsValue({
        title: event.title,
        start: moment(event.start),
        end: moment(event.end),
        describe: event.describe
      });
    }
  }, [event, form]);

  const handleSubmit = async (values) => {
    try {
      await updateEvent(event._id, {
        ...values,
        start: values.start.toISOString(),
        end: values.end.toISOString(),
      });
      form.resetFields();
      onSuccess();
      onCancel();
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  return (
    <Modal title="Update Event" visible={visible} onCancel={onCancel} footer={null}>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: 'Please input the event title!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Start Date & Time"
          name="start"
          rules={[{ required: true, message: 'Please select start date and time!' }]}
        >
          <DatePicker showTime format="YYYY-MM-DD HH:mm" />
        </Form.Item>

        <Form.Item
          label="End Date & Time"
          name="end"
          rules={[{ required: true, message: 'Please select end date and time!' }]}
        >
          <DatePicker showTime format="YYYY-MM-DD HH:mm" />
        </Form.Item>

        <Form.Item label="Description" name="describe">
          <Input.TextArea />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Update Event
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateEvent;