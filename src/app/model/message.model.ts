import mongoose, { Schema, Types } from "mongoose";

export enum MessageRole {
  USER = "user",
  ASSISTANT = "assistant",
  SYSTEM = "system",
}

export interface Message extends Document {
  chatId: Types.ObjectId;
  role: MessageRole;
  content: string;
  createdAt: Date;
  tokens?: number; // tracking token usage
  metadata?: {
    modelVersion?: string;
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
    processingTime?: number;
  };
}

const MessageSchema: Schema<Message> = new Schema({
  chatId: {
    type: Schema.Types.ObjectId,
    ref: "Chat",
    required: true,
    index: true,
  },
  role: {
    type: String,
    enum: Object.values(MessageRole),
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true, // For faster sorting
  },
  tokens: {
    type: Number,
  },
  metadata: {
    modelVersion: String,
    promptTokens: Number,
    completionTokens: Number,
    totalTokens: Number,
    processingTime: Number,
  },
});

const MessageModel =
  (mongoose.models.Message as mongoose.Model<Message>) ||
  mongoose.model<Message>("Message", MessageSchema);

export default MessageModel;
