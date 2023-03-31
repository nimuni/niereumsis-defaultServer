import mongoose from 'mongoose';
const { Schema } = mongoose;

const fileSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    uuid: {
      type: String,
      required: true,
    },
    mimetype: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    currentPath: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const model = mongoose.model('File', fileSchema);
export default model;
