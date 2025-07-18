import mongoose, {Document, ObjectId, Schema, Types, } from "mongoose";

export interface File extends Document{
    _id: ObjectId;
    fileUrl: string;
    userId: ObjectId;
    uploadDate: Date;
}

const FileSchema: Schema<File> = new Schema({
    _id: {
        type: Schema.ObjectId
    },
    fileUrl: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.ObjectId,
        ref: "User",
        required: true,
        index: true, // for faster querying
    },
    uploadDate: {
        type: Date,
        default: Date.now,
    }
})

const FileModel = (mongoose.models.File as mongoose.Model<File>) ||
mongoose.model<File>("File", FileSchema);

export default FileModel;

