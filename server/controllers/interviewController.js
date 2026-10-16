import {
  getUserInterviews,
  getInterviewStats,
  createInterview,
  getInterviewById,
  getInterviewQuestions,
  generateInterviewQuestions,
  submitInterviewAnswers,
  getInterviewFeedback,
  deleteInterview,
} from '../services/interviewService.js';

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export const listInterviews = asyncHandler(async (req, res) => {
  const interviews = await getUserInterviews(req.userId);
  res.json(interviews);
});

export const listInterviewStats = asyncHandler(async (req, res) => {
  const stats = await getInterviewStats(req.userId);
  res.json(stats || { total: 0, completed: 0, averageScore: 0 });
});

export const createInterviewHandler = asyncHandler(async (req, res) => {
  const interview = await createInterview(req.userId, req.body);
  res.status(201).json(interview);
});

export const getInterviewHandler = asyncHandler(async (req, res) => {
  const interview = await getInterviewById(req.userId, req.params.id);
  res.json(interview);
});

export const getInterviewQuestionsHandler = asyncHandler(async (req, res) => {
  const questions = await getInterviewQuestions(req.userId, req.params.id);
  res.json(questions);
});

export const generateInterviewQuestionsHandler = asyncHandler(async (req, res) => {
  const questions = await generateInterviewQuestions(req.userId, req.params.id);
  res.json(questions);
});

export const submitInterviewAnswersHandler = asyncHandler(async (req, res) => {
  const result = await submitInterviewAnswers(req.userId, req.params.id, req.body.answers);
  res.json({ success: true, score: result.score });
});

export const getInterviewFeedbackHandler = asyncHandler(async (req, res) => {
  const feedback = await getInterviewFeedback(req.userId, req.params.id);
  res.json(feedback);
});

export const deleteInterviewHandler = asyncHandler(async (req, res) => {
  await deleteInterview(req.userId, req.params.id);
  res.json({ message: 'Interview deleted successfully' });
});
