import React from "react";
import { useParams } from "react-router-dom";
import { deleteEvent } from "./api";

const DeleteEvent = () => {
  const { id } = useParams();

  const handleDelete = async () => {
    await deleteEvent(id);
  };

  return <button onClick={handleDelete}>Delete Event</button>;
};

export default DeleteEvent;
