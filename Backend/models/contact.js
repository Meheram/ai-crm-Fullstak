import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
    {
        owner:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        name: {
            type: String,
            required:[true, "Name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            unique: true,
            index: true,
        },
        phone: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        
        },
        company: {
            type: String,
            required: [true, "Company is required"],
            trim: true,default: "",},
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
            default: "",
        },
tags: {
    type: [String],
    default: [],
},
    notes:{type: String,  default: ""},
    favorite: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

contactSchema.index({ name: "text", email: "text", phone: "text", company: "text", title: "text" });

// export the model
export default mongoose.model("Contact", contactSchema)
 

        