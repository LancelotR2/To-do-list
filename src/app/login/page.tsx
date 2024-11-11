"use client";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Page() {
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const username = formData.get("username")?.toString();
        const password = formData.get("password")?.toString();
        
        const res = await signIn("credentials", {
            username,
            password,
            redirect: false,
        });

        if (res?.error) {
            setError(res.error as string);
        }
        if (res?.ok) {
            return router.push(`/todolist/${username}`);
        }
    };

    return (
        <div className="w-screen h-screen flex items-center justify-center bg-[#C5D3E8]">
            <form
                className="space-y-6 flex flex-col items-center justify-center bg-[#B4DBF2] w-2/6 h-3/5 border border-black rounded-lg drop-shadow-lg"
                onSubmit={handleSubmit}
            >
                {error && <div className="text-black">{error}</div>}
                <div className="w-4/6">
                    <h1 className="text-white font-bold text-[48px]">Login</h1>
                </div>
                <div className="w-4/6">
                    <h1 className="text-white font-bold text-[23px]">Username</h1>
                    <div>
                        <input
                            type="text"
                            id="username"
                            className="bg-white text-sm rounded-lg block w-full p-2.5"
                            name="username"
                            required
                        />
                    </div>
                    <h1 className="text-white font-bold text-[23px]">Password</h1>
                    <div>
                        <input
                            type="password"
                            id="password"
                            className="bg-white text-sm rounded-lg block w-full p-2.5"
                            name="password"
                            required
                        />
                    </div>
                </div>
                <button className="text-lg text-white w-3/5 bg-[#6FCD44] hover:bg-green-600 font-bold rounded-full px-5 py-2.5 text-center mt-6 mb-2">
                    Login
                </button>
                <Link
                    href="/register"
                    className="text-sm text-[#888] transition duration-150 ease hover:text-black"
                >
                    Don't have an account?
                </Link>
            </form>
        </div>
    );
}
