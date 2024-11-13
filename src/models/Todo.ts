import mongoose, { Schema, Document } from "mongoose";

// Define the TypeScript interface for the Todo document
interface ITodo extends Document {
  username: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: {
    lat: number;
    lng: number;
  };
  status: string; // Add the status field
}

// Create the schema for the Todo model
const TodoSchema: Schema = new Schema(
  {
    username: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    status: { type: String, required: true, default: "pending" }, // Default status is "pending"
  },
  { timestamps: true } // Add createdAt and updatedAt fields automatically
);

// Create the model from the schema
const TodoModel = mongoose.models.Todo || mongoose.model<ITodo>("Todo", TodoSchema);

export default TodoModel;
