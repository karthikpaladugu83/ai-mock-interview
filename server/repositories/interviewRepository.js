import { randomUUID } from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import Interview from '../models/Interview.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const storePath = path.join(__dirname, '..', 'data', 'interviews.json');

async function ensureStore() {
  await fs.mkdir(path.dirname(storePath), { recursive: true });

  try {
    await fs.access(storePath);
  } catch {
    await fs.writeFile(storePath, '[]', 'utf8');
  }
}

async function readStore() {
  await ensureStore();
  const raw = await fs.readFile(storePath, 'utf8');
  return JSON.parse(raw || '[]');
}

async function writeStore(interviews) {
  await ensureStore();
  await fs.writeFile(storePath, JSON.stringify(interviews, null, 2), 'utf8');
}

function isMongoReady() {
  return mongoose.connection.readyState === 1;
}

function toPlain(doc) {
  return typeof doc?.toObject === 'function' ? doc.toObject() : doc;
}

function normalizeInterview(interview) {
  const createdAt = interview.createdAt ? new Date(interview.createdAt) : new Date();
  const updatedAt = interview.updatedAt ? new Date(interview.updatedAt) : new Date();
  const completedAt = interview.completedAt ? new Date(interview.completedAt) : null;

  return {
    ...interview,
    _id: interview._id || interview.id,
    id: interview.id || interview._id,
    createdAt,
    updatedAt,
    completedAt,
  };
}

export async function listInterviewsByUser(userId) {
  if (isMongoReady()) {
    const interviews = await Interview.find({ clerkUserId: userId })
      .select('role type status score duration createdAt')
      .sort({ createdAt: -1 });

    return interviews.map(toPlain);
  }

  const interviews = await readStore();

  return interviews
    .filter((interview) => interview.clerkUserId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map((interview) => ({
      _id: interview._id,
      role: interview.role,
      type: interview.type,
      status: interview.status,
      score: interview.score,
      duration: interview.duration,
      createdAt: interview.createdAt,
    }));
}

export async function getStatsByUser(userId) {
  if (isMongoReady()) {
    const stats = await Interview.aggregate([
      { $match: { clerkUserId: userId } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
          averageScore: { $avg: '$score' },
        },
      },
    ]);

    return stats[0] || { total: 0, completed: 0, averageScore: 0 };
  }

  const interviews = await readStore();
  const userInterviews = interviews.filter((interview) => interview.clerkUserId === userId);
  const completed = userInterviews.filter((interview) => interview.status === 'completed');
  const averageScore = completed.length
    ? completed.reduce((sum, interview) => sum + (interview.score || 0), 0) / completed.length
    : 0;

  return {
    total: userInterviews.length,
    completed: completed.length,
    averageScore,
  };
}

export async function createInterviewRecord(userId, payload) {
  const interviewData = {
    clerkUserId: userId,
    role: payload.role,
    type: payload.type,
    experience: payload.experience,
    jobDescription: payload.jobDescription,
    focusArea: payload.focusArea,
    questionCount: payload.questionCount || 5,
    status: 'pending',
  };

  if (isMongoReady()) {
    const interview = new Interview(interviewData);
    await interview.save();
    return interview.toObject();
  }

  const now = new Date().toISOString();
  const interview = normalizeInterview({
    _id: randomUUID(),
    ...interviewData,
    questions: [],
    answers: [],
    score: 0,
    duration: 0,
    feedback: {
      strengths: [],
      improvements: [],
      technicalScore: 0,
      communicationScore: 0,
      confidenceScore: 0,
      relevanceScore: 0,
      depthScore: 0,
      overallFeedback: '',
    },
    createdAt: now,
    updatedAt: now,
    completedAt: null,
  });

  const interviews = await readStore();
  interviews.push(interview);
  await writeStore(interviews);

  return interview;
}

export async function getInterviewRecord(userId, interviewId) {
  if (isMongoReady()) {
    const interview = await Interview.findOne({ _id: interviewId, clerkUserId: userId });
    return interview ? interview.toObject() : null;
  }

  const interviews = await readStore();
  const interview = interviews.find(
    (item) => item._id === interviewId && item.clerkUserId === userId
  );

  return interview ? normalizeInterview(interview) : null;
}

export async function saveInterviewRecord(userId, interview) {
  if (isMongoReady()) {
    const existing = await Interview.findOne({ _id: interview._id, clerkUserId: userId });

    if (!existing) {
      return null;
    }

    Object.assign(existing, interview, {
      clerkUserId: userId,
    });

    await existing.save();
    return existing.toObject();
  }

  const interviews = await readStore();
  const index = interviews.findIndex(
    (item) => item._id === interview._id && item.clerkUserId === userId
  );

  if (index === -1) {
    return null;
  }

  const nextInterview = normalizeInterview({
    ...interviews[index],
    ...interview,
    clerkUserId: userId,
    updatedAt: new Date().toISOString(),
  });

  interviews[index] = nextInterview;
  await writeStore(interviews);

  return nextInterview;
}

export async function deleteInterviewRecord(userId, interviewId) {
  if (isMongoReady()) {
    return Interview.findOneAndDelete({ _id: interviewId, clerkUserId: userId });
  }

  const interviews = await readStore();
  const index = interviews.findIndex(
    (item) => item._id === interviewId && item.clerkUserId === userId
  );

  if (index === -1) {
    return null;
  }

  const [deleted] = interviews.splice(index, 1);
  await writeStore(interviews);
  return normalizeInterview(deleted);
}
