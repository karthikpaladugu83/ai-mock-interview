import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  type: { type: String, default: 'general' },
  context: String,
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  order: Number,
});

const answerSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
  question: String,
  answer: String,
  score: Number,
  feedback: String,
  tips: String,
});

const interviewSchema = new mongoose.Schema({
  clerkUserId: { type: String, required: true, index: true },
  role: { type: String, required: true },
  type: { type: String, required: true, enum: ['general', 'technical', 'behavioral', 'system-design'] },
  experience: { type: String, required: true, enum: ['entry', 'mid', 'senior', 'lead'] },
  jobDescription: String,
  focusArea: String,
  questionCount: { type: Number, default: 5 },
  status: { type: String, enum: ['pending', 'in_progress', 'completed'], default: 'pending' },
  questions: [questionSchema],
  answers: [answerSchema],
  score: { type: Number, default: 0 },
  duration: { type: Number, default: 0 },
  feedback: {
    strengths: [String],
    improvements: [String],
    technicalScore: Number,
    communicationScore: Number,
    confidenceScore: Number,
    relevanceScore: Number,
    depthScore: Number,
    overallFeedback: String,
  },
  completedAt: Date,
}, {
  timestamps: true,
});

// Index for efficient queries
interviewSchema.index({ clerkUserId: 1, createdAt: -1 });

export default mongoose.model('Interview', interviewSchema);

