"use server"
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
export const register = async (values: any) => {
    const { username, password, } = values;

    try {
        await connectDB();
        const userFound = await User.findOne({ username });
        if (userFound) {
            return {
                error: 'username already exists!'
            }
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            username,
            password: hashedPassword,
        });
        const savedUser = await user.save();

    } catch (e) {
        console.log(e);
    }
}