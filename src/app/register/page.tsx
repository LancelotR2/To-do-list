"use client";
import { FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { register } from "@/actions/register";

export default function Page() {
    const [error, setError] = useState<string>();
    const router = useRouter();
    const ref = useRef<HTMLFormElement>(null);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        const r = await register({
            username: formData.get("username")?.toString() || "",
            password: formData.get("password")?.toString() || "",
        });

        if (r?.error) {
            setError(r.error);
        } else {
            ref.current?.reset();
            router.push("/login");
        }
    };

    return (
        <div className="w-screen h-screen flex items-center justify-center bg-[#C5D3E8]">
            <form
                ref={ref}
                onSubmit={handleSubmit}
                className="space-y-6 flex flex-col items-center justify-center bg-[#B4DBF2] w-2/6 h-3/5 border border-black rounded-lg drop-shadow-lg"
            >
                {error && <div className="">{error}</div>}
                <div className="w-4/6">
                    <h1 className="text-white font-bold text-[48px]">Register</h1>
                </div>
                <div className="w-4/6">
                    <h1 className="text-white font-bold text-[23px]">Username</h1>
                    <input
                        type="text"
                        id="username"
                        className="bg-white text-sm rounded-lg block w-full p-2.5"
                        name="username"
                        placeholder=""
                        required
                    />
                    <h1 className="text-white font-bold text-[23px]">Password</h1>
                    <input
                        type="password"
                        id="password"
                        className="bg-white text-sm rounded-lg block w-full p-2.5"
                        name="password"
                        placeholder=""
                        required
                    />
                    <h1 className="text-white font-bold text-[23px]">Confirm your password</h1>
                    <input
                        type="password"
                        id="confirmPassword"
                        className="bg-white text-sm rounded-lg block w-full p-2.5"
                        placeholder=""
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="text-lg text-white bg-[#6FCD44] hover:bg-green-600 font-bold rounded-full px-5 py-2.5 text-center mt-4 w-3/5"
                >
                    Sign up
                </button>
            </form>
        </div>
    );
}
