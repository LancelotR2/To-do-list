"use client";
import { MdCancel } from "react-icons/md";
import dynamic from "next/dynamic";
import { DateValue } from "@internationalized/date";
import { TimeInput } from "@nextui-org/react";
import { Time } from "@internationalized/date";
import { DatePicker } from "@nextui-org/react";
import { useState, ChangeEvent } from "react";
import { useParams, useRouter } from "next/navigation";




const Page = () => {
  const { username } = useParams(); // Use useParams hook to access params
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const router = useRouter();
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<Time>(new Time(11, 45));
  const [location, setLocation] = useState<{ lat: number; lng: number }>({ lat: 51.505, lng: -0.09 });

  const handleSubmit = async () => {
    const data = {
      username,
      title,
      description,
      date,
      time: time.toString(),
      location,
      status: "pending"
    };

    const response = await fetch("/api/data/todo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });


    const result = await response.json();
    if (result.success) {
      alert("To-do added successfully!");
    } else {
      alert("Failed to add to-do.");
    }
  };

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);
  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value);

  return (
    <div className="w-screen min-h-screen flex flex-col items-center bg-[#4f8ce7] pb-20">
      <div className="bg-[#144a6a] w-5/6 h-full border border-black rounded-lg drop-shadow-xl m-20">
        <div className="bg-[#81A2D3] w-full rounded-t-lg flex justify-between p-5 ">
          <h1 className="font-bold text-white text-[44px] drop-shadow-xl">Add your new to-do</h1>
          <button onClick={() => router.push(`/todolist/${username}`)} className="ring-2 ring-black/70 flex items-center justify-center w-16 h-16 rounded-full bg-red-400 hover:bg-red-600 drop-shadow-xl">
            <MdCancel size={42} />
          </button>
        </div>
        <div className="flex pb-20">
          <div className="w-1/2 h-full mt-10 space-y-5">
            <div>
              <h1 className="w-full h-10 font-bold text-white text-[34px] ml-8 m-3 drop-shadow-xl">Title</h1>
              <input
                type="text"
                id="title"
                className="p-4 bg-white text-sm rounded-lg block w-5/6 h-10 ml-8 drop-shadow-xl"
                placeholder="Enter title"
                value={title}
                onChange={handleTitleChange}
                required
              />
            </div>
            <div>
              <h1 className="w-full h-14 font-bold text-white text-[34px] ml-8 p-1 drop-shadow-xl">Description</h1>
              <textarea
                id="description"
                className="p-4 bg-white text-sm rounded-lg block w-5/6 h-36 ml-8 drop-shadow-xl"
                placeholder="Enter description"
                value={description}
                onChange={handleDescriptionChange}
                required
              />
            </div>
            <div className="flex space-x-10">
              <div>
                <h1 className="w-full h-14 font-bold text-white text-[34px] ml-8 p-1 drop-shadow-xl">Date</h1>
                <DatePicker
                  className="bg-white text-sm rounded-full block w-full h-7 ml-8 drop-shadow-xl"
                  onChange={(value: DateValue) => {
                    if ("toDate" in value && typeof value.toDate === "function") {
                      const jsDate = value.toDate("Asia/Bangkok");
                      setDate(jsDate);
                    } else if (value.year && value.month && value.day) {
                      const jsDate = new Date(value.year, value.month - 1, value.day);
                      setDate(jsDate);
                    }
                  }}
                />

              </div>
              <div>
                <h1 className="w-full h-14 font-bold text-white text-[34px] ml-8 p-1 drop-shadow-xl">Time</h1>
                <TimeInput
                  label={null}
                  defaultValue={new Time(11, 45)}
                  className="bg-white text-sm rounded-full block w-full h-7 ml-8 drop-shadow-xl"
                  onChange={(newTime: Time) => setTime(newTime)}
                />
              </div>
            </div>
            <div className="pt-3 ">
              <button
                type="button"
                className="ring-2 ring-black/70 text-lg text-white bg-[#6FCD44] hover:bg-green-600 font-bold rounded-full py-2.5 p-2 text-center ml-8 w-6/12 drop-shadow-xl"
                onClick={handleSubmit}
              >
                Confirm your to-do
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
