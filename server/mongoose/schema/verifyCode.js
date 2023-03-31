import mongoose from 'mongoose';
const { Schema } = mongoose;

const verifyCodeSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    verify_code: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      required: true,
    },
    limit: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const model = mongoose.model('VerifyCode', verifyCodeSchema); 
export default model;