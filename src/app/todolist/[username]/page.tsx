'use client';
import { FaCheck } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { RiAddLargeLine } from "react-icons/ri";
import { Button } from "@nextui-org/react";
import { signOut } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { use } from 'react';
import { useEffect, useState } from 'react';

interface Todo {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: {
    lat: number;
    lng: number;
  };
  status: string;  // Added status field
}

export default function Page({ params }: { params: Promise<{ username: string }> }) {
  const router = useRouter();
  const { username } = use(params);
  const [todos, setTodos] = useState<Todo[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const url = selectedDate
          ? `/api/data/todo?username=${username}&date=${selectedDate}`
          : `/api/data/todo?username=${username}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.success) {
          setTodos(data.todos);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError("Failed to load todos");
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, [username, selectedDate]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const handleDelete = async (todoId: string) => {
    try {
      const response = await fetch(`/api/data/todo?todoId=${todoId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        setTodos((prevTodos) =>
          prevTodos?.filter((todo) => todo._id !== todoId) || []
        );
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to delete todo : ${error}");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="w-screen min-h-screen flex flex-col items-center bg-[#4f8ce7]">
      <div className="flex items-center justify-between w-5/6 space-x-40">
        <h1 className="drop-shadow-xl font-bold text-white text-[48px]">To-do list</h1>
        <button
          onClick={() => signOut({ redirect: true, callbackUrl: '/' })}
          className="font-bold ring-2 ring-black/70 flex items-center justify-center drop-shadow-lg bg-red-300 hover:bg-red-500 w-1/6 h-10 rounded-full cursor-pointer"
        >
          <h1>Logout</h1>
        </button>
      </div>
      <div className="bg-[#144a6a] w-5/6 min-h-screen border border-black rounded-lg drop-shadow-lg">
        <div className="bg-[#81A2D3] w-full rounded-t-lg flex justify-between p-5">
          <h1 className="font-bold text-white text-[44px] drop-shadow-lg">Your list</h1>
          <Button
            onClick={() => router.push(`/todolist/${username}/addtodo`)}
            className="ring-2 ring-black/70 w-16 h-16 rounded-full bg-green-400 hover:bg-green-600 drop-shadow-lg"
          >
            <RiAddLargeLine size={250} />
          </Button>
        </div>
        <div className="space-y-6 flex items-stretch justify-between mr-8">
          <div className="ring-2 ring-black/70 w-28 h-8 bg-[#C5D3E8] m-8 rounded-full text-center font-bold">
            <h1>Today</h1>
            </div>
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="w-36 h-10 flex mb-4 p-2 rounded-full ring-2 ring-black/70 "
          /></div>
        {todos && todos.length > 0 ? (
          todos.map((todo) => (
            <div className="w-full h-full flex items-center justify-center p-5">
              <div key={todo._id} className="ring-2 ring-black/70 flex w-full h-2/6 bg-[#C5D3E8] rounded-md justify-between drop-shadow-lg">
                <div className="m-2 space-y-2">
                  <h1 className="drop-shadow-lg font-bold px-3 text-[32px]">{todo.title}</h1>
                  <h1 className="drop-shadow-lg font-bold px-3 text-[16px]">{todo.description}</h1>
                </div>
                <div className="flex">
                  <div className="p-5 flex-col">

                  </div></div>
                <div className="">
                  <div className="ring-2 ring-black/70 flex items-center justify-center w-28 h-8 bg-white m-6 rounded-full drop-shadow-lg">
                    <h1 className="font-bold">{todo.time}</h1>
                  </div>
                  <div className="flex space-x-8 pb-5 ml-9">
                    <div
                      onClick={() => handleDelete(todo._id)}
                      className="ring-2 ring-black/70 rounded-full w-8 h-8 p-2 cursor-pointer bg-green-400 hover:bg-green-600 drop-shadow-lg"
                    >
                      <FaCheck />
                    </div>
                    <div
                      onClick={() => handleDelete(todo._id)}
                      className="drop-shadow-lg ring-2 ring-black/70 bg-[#E76B6B] rounded-full w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-red-500"
                    >
                      <MdCancel size={20} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center text-[#C5D3E8] font-bold">No todos found.</div>
        )}
      </div>
    </div>

  );
}
