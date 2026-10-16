import { generateQuestions, generateFeedback } from './gemini.js';
import {
  listInterviewsByUser,
  getStatsByUser,
  createInterviewRecord,
  getInterviewRecord,
  saveInterviewRecord,
  deleteInterviewRecord,
} from '../repositories/interviewRepository.js';

function createHttpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

export function getUserInterviews(userId) {
  if (!userId) {
    throw createHttpError(401, 'Authentication required');
  }

  return listInterviewsByUser(userId);
}

export function getInterviewStats(userId) {
  if (!userId) {
    throw createHttpError(401, 'Authentication required');
  }

  return getStatsByUser(userId);
}

export async function createInterview(userId, payload) {
  if (!userId) {
    throw createHttpError(401, 'Authentication required');
  }

  const { role, type, experience } = payload;

  if (!role || !type || !experience) {
    throw createHttpError(400, 'Role, type, and experience are required');
  }

  return createInterviewRecord(userId, payload);
}

export async function getInterviewById(userId, id) {
  if (!userId) {
    throw createHttpError(401, 'Authentication required');
  }

  const interview = await getInterviewRecord(userId, id);

  if (!interview) {
    throw createHttpError(404, 'Interview not found');
  }

  return interview;
}

export async function getInterviewQuestions(userId, id) {
  const interview = await getInterviewById(userId, id);
  return [...(interview.questions || [])].sort((a, b) => a.order - b.order);
}

export async function generateInterviewQuestions(userId, id) {
  const interview = await getInterviewById(userId, id);

  const currentQuestions = interview.questions || [];

  if (currentQuestions.length > 0) {
    return currentQuestions;
  }

  const questions = await generateQuestions(
    interview.role,
    interview.type,
    interview.experience,
    interview.jobDescription,
    interview.focusArea,
    interview.questionCount
  );

  interview.questions = questions;
  interview.status = 'in_progress';
  await saveInterviewRecord(userId, interview);

  return questions;
}

export async function submitInterviewAnswers(userId, id, answers) {
  const interview = await getInterviewById(userId, id);

  if (!Array.isArray(answers)) {
    throw createHttpError(400, 'Answers must be an array');
  }

  const interviewQuestions = interview.questions || [];

  interview.answers = answers.map((answer, index) => ({
    questionId: interviewQuestions[index]?._id,
    question: answer.question,
    answer: answer.answer,
  }));

  const feedback = await generateFeedback(interviewQuestions, interview.answers);

  interview.feedback = {
    strengths: feedback.strengths || [],
    improvements: feedback.improvements || [],
    technicalScore: feedback.technicalScore || 0,
    communicationScore: feedback.communicationScore || 0,
    confidenceScore: feedback.confidenceScore || 0,
    relevanceScore: feedback.relevanceScore || 0,
    depthScore: feedback.depthScore || 0,
    overallFeedback: feedback.overallFeedback || '',
  };

  if (feedback.questionFeedback) {
    interview.answers = interview.answers.map((answer, index) => {
      const plainAnswer = typeof answer?.toObject === 'function' ? answer.toObject() : answer;

      return {
        ...plainAnswer,
        score: feedback.questionFeedback[index]?.score || 0,
        feedback: feedback.questionFeedback[index]?.feedback || '',
        tips: feedback.questionFeedback[index]?.tips || '',
      };
    });
  }

  interview.score = feedback.score || 0;
  interview.duration = interview.questionCount * 2;
  interview.status = 'completed';
  interview.completedAt = new Date();

  await saveInterviewRecord(userId, interview);

  return { score: interview.score };
}

export async function getInterviewFeedback(userId, id) {
  const interview = await getInterviewById(userId, id);

  if (interview.status !== 'completed') {
    throw createHttpError(400, 'Interview not completed yet');
  }

  return {
    score: interview.score,
    role: interview.role,
    type: interview.type,
    date: interview.completedAt || interview.updatedAt,
    answered: (interview.answers || []).filter((answer) => answer.answer).length,
    total: (interview.questions || []).length,
    questionFeedback: (interview.answers || []).map((answer) => ({
      question: answer.question,
      answer: answer.answer,
      score: answer.score,
      feedback: answer.feedback,
      tips: answer.tips,
    })),
    strengths: interview.feedback?.strengths || [],
    improvements: interview.feedback?.improvements || [],
    technicalScore: interview.feedback?.technicalScore || 0,
    communicationScore: interview.feedback?.communicationScore || 0,
    confidenceScore: interview.feedback?.confidenceScore || 0,
    relevanceScore: interview.feedback?.relevanceScore || 0,
    depthScore: interview.feedback?.depthScore || 0,
    overallFeedback: interview.feedback?.overallFeedback || '',
  };
}

export async function deleteInterview(userId, id) {
  if (!userId) {
    throw createHttpError(401, 'Authentication required');
  }

  const interview = await deleteInterviewRecord(userId, id);

  if (!interview) {
    throw createHttpError(404, 'Interview not found');
  }

  return interview;
}
