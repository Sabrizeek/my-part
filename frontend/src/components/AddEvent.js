import React, { useState } from 'react';
import { Form, Input, Button, Modal, Alert, Select, DatePicker } from 'antd';
import moment from 'moment-timezone';
import { createEvent } from '../api';

const { Option } = Select;

const AddEvent = ({ visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // `start` and `end` are moment objects from DatePicker, already in Asia/Colombo timezone
      const start = values.start;
      const end = values.end;

      console.log('Parsed Start (Local):', start.format('YYYY-MM-DD HH:mm'));
      console.log('Parsed End (Local):', end.format('YYYY-MM-DD HH:mm'));
      console.log('Start ISO:', start.toISOString());
      console.log('End ISO:', end.toISOString());
      console.log('Duration (minutes):', end.diff(start, 'minutes'));

      if (!start.isValid() || !end.isValid()) {
        throw new Error('Invalid date or time selected');
      }
      if (!end.isAfter(start)) {
        throw new Error('End time must be after start time');
      }
      if (end.diff(start, 'minutes') < 60) {
        throw new Error('Event must be at least 1 hour long');
      }

      const payload = {
        title: values.title.trim(),
        describe: values.describe?.trim(),
        start: start.toDate(), // Convert to Date object for backend
        end: end.toDate(),     // Convert to Date object for backend
        reminder: values.reminder || null
      };

      console.log('Payload:', payload);
      const response = await createEvent(payload);
      
      form.resetFields();
      setError(null);
      onSuccess(response);
      onCancel();
    } catch (error) {
      console.error('Creation error:', error);
      const errorMessage = error.response?.data || error.message || 'Failed to create event';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Add New Event (Local Time - Sri Lanka)"
      visible={visible}
      onCancel={() => {
        form.resetFields();
        setError(null);
        onCancel();
      }}
      footer={null}
      destroyOnClose
    >
      {error && (
        <Alert
          message="Error"
          description={typeof error === 'object' ? 
            Object.entries(error)
              .filter(([_, value]) => value)
              .map(([key, value]) => (
                <div key={key}>{`${key}: ${value}`}</div>
              )) : error}
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
            {loading ? 'Creating...' : 'Create Event'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddEvent;