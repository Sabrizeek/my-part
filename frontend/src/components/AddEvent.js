import React, { useState } from 'react';
import { Form, Input, Button, DatePicker, Modal, Alert } from 'antd';
import moment from 'moment';
import { createEvent } from '../api';

const AddEvent = ({ visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    try {
      // Convert to UTC moments without local time conversion
      const start = moment.utc(values.start.format('YYYY-MM-DD HH:mm'));
      const end = moment.utc(values.end.format('YYYY-MM-DD HH:mm'));
  
      // Client-side validation with buffer
      if (end.diff(start, 'minutes') < 59) {
        throw new Error('End time must be at least 1 hour after start time');
      }
  
      const payload = {
        title: values.title,
        describe: values.describe,
        start: start.toISOString(),
        end: end.toISOString()
      };
  
      await createEvent(payload);
      
      form.resetFields();
      setError(null);
      onSuccess();
      onCancel();
    } catch (error) {
      console.error('Creation error:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data || 
                          error.message || 
                          'Failed to create event';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Add New Event"
      visible={visible}
      onCancel={() => {
        onCancel();
        setError(null);
      }}
      footer={null}
      destroyOnClose
    >
      {error && (
        <Alert
          message="Error"
          description={typeof error === 'object' ? 
            Object.entries(error).map(([key, value]) => (
              <div key={key}>{`${key}: ${value}`}</div>
            )) : error}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Title"
          name="title"
          rules={[{ 
            required: true, 
            message: 'Please input the event title!',
            whitespace: true
          }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Start Date & Time"
          name="start"
          rules={[{ 
            required: true, 
            message: 'Please select start date and time!' 
          }]}
        >
          <DatePicker
  showTime
  format="YYYY-MM-DD HH:mm"
  onChange={(value) => {
    // Force UTC interpretation
    return moment.utc(value.format('YYYY-MM-DD HH:mm'));
  }}
/>
        </Form.Item>

        <Form.Item
          label="End Date & Time"
          name="end"
          dependencies={['start']}
          rules={[{ 
            required: true,
            message: 'Please select end date and time!',
            validator: (_, value) => {
              const start = form.getFieldValue('start');
              if (start && value) {
                const minEnd = moment(start).add(1, 'hour');
                if (value.isBefore(minEnd)) {
                  return Promise.reject('End must be at least 1 hour after start');
                }
              }
              return Promise.resolve();
            }
          }]}
        >
          <DatePicker 
            showTime 
            format="YYYY-MM-DD HH:mm"
            disabledDate={(current) => {
              const start = form.getFieldValue('start');
              return start ? current < moment(start) : false;
            }}
          />
        </Form.Item>

        <Form.Item label="Description" name="describe">
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Event'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddEvent;