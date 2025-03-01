import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
    title: { type: String, required: [true, "Please write a title for your event"] },
    start: {
        type: Date,
        required: [true, "Please Insert The Start of your event"],
        min: [new Date(), "can't be before now!!"],
    },
    end: {
        type: Date,
        min: [function() {
          const date = new Date(this.start);
          date.setUTCHours(date.getUTCHours() + 1); // Use UTC hours
          return date;
        }, "Event End must be at least one hour ahead of event time"],
        default: function() {
          const date = new Date(this.start);
          date.setUTCDate(date.getUTCDate() + 1); // Use UTC date
          return date;
        },
      },
    describe: { type: String },
});

export default mongoose.model("Event", EventSchema);
