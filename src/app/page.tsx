"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const { status } = useSession();
  const router=useRouter() 
  
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-[#C5D3E8]">
      <div className="space-y-6 flex flex-col items-center justify-center bg-[#B4DBF2] w-2/6 h-3/5 border border-black rounded-lg drop-shadow-lg">
        <h1 className="text-white font-bold text-[48px]">To do list</h1>
        <button type="button" onClick={() => router.push('/login')} className="text-white bg-[#6FCD44] hover:bg-green-600 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 w-3/5 ">Login</button>
        <button type="button" onClick={() => router.push('/register')} className="text-white bg-[#6FCD44] hover:bg-green-600 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 w-3/5 ">Register</button>
      </div>
    </div>
  );
}
