// src/components/Calendar.js
import React, { useEffect, useState } from 'react';
import { Calendar, Button, Modal, Table, Tag } from 'antd';
import moment from 'moment';
import { fetchEvents, deleteEvent } from '../api';
import AddEvent from './AddEvent';
import UpdateEvent from './UpdateEvent';

const CalendarComponent = () => {
  const [events, setEvents] = useState([]);
  const [agendaVisible, setAgendaVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const data = await fetchEvents();
      setEvents(data.map(event => ({
        ...event,
        start: moment(event.start),
        end: moment(event.end)
      })));
    } catch (error) {
      console.error('Error loading events:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteEvent(id);
      loadEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const dateCellRender = (value) => {
    const dayEvents = events.filter(event => 
      event.start.isSame(value, 'day') || 
      event.end.isSame(value, 'day') ||
      (event.start.isBefore(value) && event.end.isAfter(value))
    );

    return (
      <div className="events">
        {dayEvents.map(event => (
          <Tag 
            key={event._id}
            color="blue"
            style={{ margin: '2px', cursor: 'pointer' }}
            onClick={() => setSelectedEvent(event)}
          >
            {event.title}
          </Tag>
        ))}
      </div>
    );
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1>Event Calendar</h1>
        <div>
          <Button type="primary" onClick={() => setAddModalVisible(true)} style={{ marginRight: '10px' }}>
            Add Event
          </Button>
          <Button onClick={() => setAgendaVisible(true)}>Show Agenda</Button>
        </div>
      </div>

      <Calendar dateCellRender={dateCellRender} />

      <AddEvent
        visible={addModalVisible}
        onCancel={() => setAddModalVisible(false)}
        onSuccess={loadEvents}
      />

      <UpdateEvent
        event={selectedEvent}
        visible={updateModalVisible}
        onCancel={() => {
          setUpdateModalVisible(false);
          setSelectedEvent(null);
        }}
        onSuccess={loadEvents}
      />

      <Modal
        title="Event Agenda"
        visible={agendaVisible}
        onCancel={() => setAgendaVisible(false)}
        footer={null}
        width={800}
      >
        <Table dataSource={events} rowKey="_id">
          <Table.Column title="Title" dataIndex="title" />
          <Table.Column 
            title="Start" 
            dataIndex="start" 
            render={text => text.format('YYYY-MM-DD HH:mm')} 
          />
          <Table.Column 
            title="End" 
            dataIndex="end" 
            render={text => text.format('YYYY-MM-DD HH:mm')} 
          />
          <Table.Column title="Description" dataIndex="describe" />
       
          <Table.Column 
            title="Actions" 
            render={(_, record) => (
              <>
                <Button onClick={() => {
                  setSelectedEvent(record);
                  setUpdateModalVisible(true);
                }}>
                  Edit
                </Button>
                <Button danger onClick={() => handleDelete(record._id)} style={{ marginLeft: '8px' }}>
                  Delete
                </Button>
              </>
            )}
          />
        </Table>
      </Modal>
    </div>
  );
};

export default CalendarComponent;