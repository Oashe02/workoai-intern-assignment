import mongoose from 'mongoose';

const candidateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'name chhaiye'],
      trim: true,
      minlength: [2, 'must be atlest 2 char'],
      maxlength: [100, 'cant exceed 100 char'],
    },
    email: {
      type: String,
      required: [true, 'email chahiye'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'phonenum chahiye'],
      trim: true,
    },
    jobTitle: {
      type: String,
      required: [true, 'job title'],
      trim: true,
      minlength: [2, 'must be atlest 2 char'],
      maxlength: [100, 'caant exceed 100 characters'],
    },
    status: {
      type: String,
      enum: {
        values: ['Pending', 'Reviewed', 'Hired'],
        message: 'Status must be Pending, Reviewed, or Hired',
      },
      default: 'Pending',
    },
    resumeData: {
      type: String, // Base64 encoded PDF
      default: null,
    },
    resumeFilename: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true, 
  }
);

const Candidate = mongoose.model('Candidate', candidateSchema);

export default Candidate;
