import Event from "../models/event.js";
import handleError from "../utils/eventErrors.js";

export const getEvents = async (req, res) => {
    try {
        const events = await Event.find({});
        console.log('Returning events:', events);
        res.status(200).json(events);
    } catch (err) {
        handleError(err, res);
    }
};

export const createEvent = async (req, res) => {
    console.log('Received request body:', req.body);
    try {
      const newEvent = new Event({
        title: req.body.title,
        start: new Date(req.body.start), // Now in local time (Asia/Colombo)
        end: new Date(req.body.end),     // Now in local time (Asia/Colombo)
        describe: req.body.describe,
        reminder: req.body.reminder ? Number(req.body.reminder) : null
      });
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
    console.log('Update request body:', req.body);
    try {
        const event = await Event.findById(id);
        if (event) {
            Object.assign(event, {
                title: req.body.title,
                start: new Date(req.body.start),
                end: new Date(req.body.end),
                describe: req.body.describe,
                reminder: req.body.reminder ? Number(req.body.reminder) : null
            });
            const updatedEvent = await event.save();
            console.log('Updated event:', updatedEvent);
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
        const deletedEvent = await Event.findByIdAndDelete(id);
        if (!deletedEvent) {
            return res.status(404).json({ error: "Event not found" });
        }
        res.status(200).json("Event has been deleted");
    } catch (err) {
        console.error("Error deleting event:", err);
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