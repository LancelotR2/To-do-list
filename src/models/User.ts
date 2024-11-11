import mongoose, { Schema, model } from "mongoose";
export interface UserDocument {
    _id: string;
    password: string;
    username: string;
    createdAt: Date;
    updatedAt: Date;
}
const UserSchema = new Schema<UserDocument>({

    password: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: [true, "Name is required"]
    }
},
    {
        timestamps: true,
    }
);
const  User  =  mongoose.models?.User  ||  model<UserDocument>('User', UserSchema);
export  default  User;