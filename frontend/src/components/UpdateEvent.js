import React, { useState } from 'react';
import { Form, Input, Button, Modal, Select, Alert, DatePicker } from 'antd';
import moment from 'moment-timezone';
import { updateEvent } from '../api';

const { Option } = Select;

const UpdateEvent = ({ event, visible, onCancel, onUpdate }) => {
  const [form] = Form.useForm();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (event) {
      console.log('Loading event into form:', event);
      form.setFieldsValue({
        title: event.title,
        start: moment.tz(event.start, 'Asia/Colombo'),
        end: moment.tz(event.end, 'Asia/Colombo'),
        describe: event.describe,
        reminder: event.reminder
      });
    }
  }, [event, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    setError(null);
    try {
      const start = values.start;
      const end = values.end;

      console.log('Update - Parsed Start (Local):', start.format('YYYY-MM-DD HH:mm'));
      console.log('Update - Parsed End (Local):', end.format('YYYY-MM-DD HH:mm'));
      console.log('Update - Start ISO:', start.toISOString());
      console.log('Update - End ISO:', end.toISOString());
      console.log('Update - Duration (minutes):', end.diff(start, 'minutes'));

      if (!start.isValid() || !end.isValid()) {
        throw new Error('Invalid date or time selected');
      }
      if (!end.isAfter(start)) {
        throw new Error('End time must be after start time');
      }
      if (end.diff(start, 'minutes') < 60) {
        throw new Error('Event must be at least 1 hour long');
      }

      const updatedEvent = {
        _id: event._id,
        title: values.title.trim(),
        start: start.toDate(),
        end: end.toDate(),
        describe: values.describe?.trim(),
        reminder: values.reminder || null
      };

      console.log('Update - Payload:', updatedEvent);
      const response = await updateEvent(updatedEvent);
      console.log('Update - API Response:', response);

      form.resetFields();
      onUpdate(updatedEvent);
      onCancel();
    } catch (error) {
      console.error('Update - Error:', error);
      setError(error.response?.data?.error || error.message || 'Failed to update event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal 
      title="Update Event (Local Time - Sri Lanka)" 
      visible={visible} 
      onCancel={() => {
        form.resetFields();
        setError(null);
        onCancel();
      }} 
      footer={null}
    >
      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}
      <Form 
        form={form} 
        layout="vertical" 
        onFinish={handleSubmit}
        initialValues={{
          start: null,
          end: null,
          reminder: null
        }}
      >
        <Form.Item
          label="Title"
          name="title"
          rules={[
            { required: true, message: 'Please input the event title!' },
            { whitespace: true, message: 'Title cannot be empty spaces!' }
          ]}
        >
          <Input placeholder="Enter event title" />
        </Form.Item>

        <Form.Item
          label="Start Date & Time (Local, Sri Lanka)"
          name="start"
          rules={[{ required: true, message: 'Please select the start date and time!' }]}
        >
          <DatePicker
            showTime={{ format: 'HH:mm', minuteStep: 5 }}
            format="YYYY-MM-DD HH:mm"
            placeholder="Select start date and time"
            style={{ width: '100%' }}
            disabledDate={(current) => current && current < moment.tz('Asia/Colombo').startOf('day')}
          />
        </Form.Item>

        <Form.Item
          label="End Date & Time (Local, Sri Lanka)"
          name="end"
          rules={[{ required: true, message: 'Please select the end date and time!' }]}
        >
          <DatePicker
            showTime={{ format: 'HH:mm', minuteStep: 5 }}
            format="YYYY-MM-DD HH:mm"
            placeholder="Select end date and time"
            style={{ width: '100%' }}
            disabledDate={(current) => {
              const start = form.getFieldValue('start');
              return current && (!start || current < start.startOf('day'));
            }}
          />
        </Form.Item>

        <Form.Item
          label="Reminder (minutes before)"
          name="reminder"
        >
          <Select 
            allowClear 
            placeholder="No reminder"
            style={{ width: '100%' }}
          >
            <Option value={5}>5 minutes</Option>
            <Option value={15}>15 minutes</Option>
            <Option value={30}>30 minutes</Option>
            <Option value={60}>1 hour</Option>
            <Option value={120}>2 hours</Option>
          </Select>
        </Form.Item>

        <Form.Item 
          label="Description" 
          name="describe"
        >
          <Input.TextArea 
            rows={4} 
            placeholder="Enter event description (optional)"
          />
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit"
            loading={loading}
            disabled={loading}
            block
          >
            {loading ? 'Updating...' : 'Update Event'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateEvent;