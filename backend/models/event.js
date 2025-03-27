import mongoose from "mongoose";
import moment from 'moment-timezone';

const EventSchema = new mongoose.Schema({
    title: { type: String, required: [true, "Please write a title for your event"] },
    start: {
        type: Date,
        required: [true, "Please Insert The Start of your event"],
        min: [() => moment.tz('Asia/Colombo').toDate(), "can't be before now!!"],
    },
    end: {
        type: Date,
        min: [function() {
          const date = new Date(this.start);
          date.setHours(date.getHours() + 1);
          return date;
        }, "Event End must be at least one hour ahead of event time"],
        default: function() {
          const date = new Date(this.start);
          date.setDate(date.getDate() + 1);
          return date;
        },
    },
    describe: { type: String },
    reminder: {
        type: Number,
        min: [0, "Reminder cannot be negative"],
        default: null
    }
});

export default mongoose.model("Event", EventSchema);