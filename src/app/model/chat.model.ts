import mongoose, {Schema, Document, Types} from "mongoose";
export interface Chat extends Document{
    title: string;
    userId: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date; 
    lastMessage?: Types.ObjectId; // reference to the last message
    chatModel?: string;
    systemPrompt?: string;
    messageCount: number;
}

const ChatSchema: Schema<Chat> = new Schema({
    title: {
        type: String,
        default: "new conversation",
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true, // for faster queries
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    lastMessage: {
        type: Schema.Types.ObjectId,
        ref: "Message",
    },
    chatModel: {
        type: String,
        default: "gpt-4", // Default model
    },
    systemPrompt: {
        type: String,
        default: "You are a helpful assistant."
    },
    messageCount: {
        type: Number,
        default: 0
    }
})

// updating time stamp on changes
ChatSchema.pre("save", function (next){
    this.updatedAt = new Date();
    next();
})

const ChatModel = 
    (mongoose.models.Chat as mongoose.Model<Chat>) ||
    mongoose.model<Chat>("Chat", ChatSchema);

export default ChatModel;