import Event from "../models/event.js";
import handleError from "../utils/eventErrors.js";

export const getEvents = async (req, res) => {
    try {
        const events = await Event.find({});
        res.status(200).json(events);
    } catch (err) {
        handleError(err, res);
    }
};

export const getEventById = async (req, res) => {
    const id = req.params.id;
    try {
        const event = await Event.findById(id);
        res.status(200).json(event);
    } catch (err) {
        handleError(err, res);
    }
};

export const createEvent = async (req, res) => {
    console.log('Received request body:', req.body);
    try {
      const newEvent = new Event(req.body);
      const savedEvent = await newEvent.save();
      console.log('Saved event:', savedEvent);
      res.status(200).json(savedEvent);
    } catch (err) {
      console.error('Validation error details:', err.errors);
      handleError(err, res);
    }
  };

export const updateEvent = async (req, res) => {
    const id = req.params.id;
    try {
        const event = await Event.findById(id);
        if (event) {
            Object.assign(event, req.body);
            const updatedEvent = await event.save();
            res.status(200).json(updatedEvent);
        } else {
            res.status(404).json({ error: "Event not found" });
        }
    } catch (err) {
        handleError(err, res);
    }
};

export const deleteEvent = async (req, res) => {
    const id = req.params.id;
    try {
        const deletedEvent = await Event.findByIdAndDelete(id); // Using findByIdAndDelete
        if (!deletedEvent) {
            return res.status(404).json({ error: "Event not found" });
        }
        res.status(200).json("Event has been deleted");
    } catch (err) {
        console.error("Error deleting event:", err);
        handleError(err, res);
    }
};
