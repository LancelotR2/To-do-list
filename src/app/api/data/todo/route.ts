import { connectDB } from "@/lib/mongodb";
import TodoModel from "@/models/Todo";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

interface Todo {
  username: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: {
    lat: number;
    lng: number;
  };
  status?: string;
}

export async function POST(req: Request) {
  try {
    const { username, title, description, date, time, location, status }: Todo = await req.json();

    await connectDB();

    const formattedDate = new Date(date).toISOString().split("T")[0];
    console.log(formattedDate)

    const newTodo = new TodoModel({
      title,
      username,
      description,
      date: formattedDate, 
      time,
      location,
      status: status || "pending",
    });

    await newTodo.save();

    return NextResponse.json({ success: true, message: "Todo added successfully!" });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const username = url.searchParams.get("username");
    const date = url.searchParams.get("date");

    if (!username) {
      return NextResponse.json(
        { success: false, message: "Username is required" },
        { status: 400 }
      );
    }

    await connectDB();
    const query: any = { username };
    
    if (date) {
      query.date = date;
    }
    const todos = await TodoModel.find(query);
    
    return NextResponse.json({ success: true, todos: todos || [] });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const todoId = url.searchParams.get("todoId");
    
    if (!todoId) {
      return NextResponse.json(
        { success: false, message: "Todo ID is required" },
        { status: 400 }
      );
    }

    // Validate if todoId is a valid ObjectId
    if (!Types.ObjectId.isValid(todoId)) {
      return NextResponse.json(
        { success: false, message: "Invalid Todo ID format" },
        { status: 400 }
      );
    }

    await connectDB();

    const todo = await TodoModel.findById(todoId);
    
    if (!todo) {
      return NextResponse.json(
        { success: false, message: "Todo not found" },
        { status: 404 }
      );
    }

    await todo.deleteOne();

    return NextResponse.json({ success: true, message: "Todo deleted!" });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
