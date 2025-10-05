import mongoose, { Schema, Model } from 'mongoose';

export interface IModel {
  _id: string;
  title: string;
  description: string;
  fileUrl: string;
  fileId?: string;
  thumbnailUrl?: string;
  thumbnailId?: string;
  fileSize: number;
  format: string;
  tags: string[];
  userId: mongoose.Types.ObjectId;
  likes: number;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const ModelSchema = new Schema<IModel>(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    fileUrl: {
      type: String,
      required: [true, 'Please provide a file URL'],
    },
    fileId: {
      type: String,
    },
    thumbnailUrl: {
      type: String,
    },
    thumbnailId: {
      type: String,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    format: {
      type: String,
      required: true,
      enum: ['GLB', 'GLTF', 'OBJ', 'FBX', 'STL', 'BLEND'],
    },
    tags: {
      type: [String],
      default: [],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better query performance
ModelSchema.index({ title: 'text', description: 'text', tags: 'text' });
ModelSchema.index({ createdAt: -1 });
ModelSchema.index({ likes: -1 });
ModelSchema.index({ views: -1 });

export default (mongoose.models.Model as Model<IModel>) ||
  mongoose.model<IModel>('Model', ModelSchema);
