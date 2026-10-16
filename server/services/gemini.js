import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPTS = {
  question: `You are an expert technical interviewer at a top tech company. Generate interview questions that are:
- Relevant to the role and experience level
- Challenging but fair
- Clear and well-structured
- Practical and job-relevant
- Include context or scenario where appropriate

Return ONLY a JSON array of question objects with fields: text (string), type (string), context (string or null), difficulty (easy/medium/hard).`,

  feedback: `You are an expert interview coach providing detailed feedback. Analyze the candidate's answers and provide:
- Constructive, specific feedback
- Honest but encouraging tone
- Actionable improvement suggestions
- Score each answer (0-100)
- Identify patterns in strengths/weaknesses

Return ONLY valid JSON.`,
};

export async function generateQuestions(role, type, experience, jobDescription, focusArea, count = 5) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    let prompt = `Generate ${count} interview questions for a ${experience} level ${role} position.\n`;
    prompt += `Interview type: ${type}\n`;
    
    if (jobDescription) {
      prompt += `\nJob Description Context:\n${jobDescription}\n`;
    }
    
    if (focusArea) {
      prompt += `\nFocus Areas: ${focusArea}\n`;
    }

    prompt += `\n${SYSTEM_PROMPTS.question}\n\n`;
    prompt += `Return the response as a JSON array. Example format:
[
  {
    "text": "Question text here",
    "type": "technical",
    "context": "Optional context or scenario",
    "difficulty": "medium"
  }
]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // Clean up markdown code blocks if present
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const questions = JSON.parse(text);
    
    // Validate and return questions with order
    return questions.slice(0, count).map((q, index) => ({
      text: q.text,
      type: type,
      context: q.context || null,
      difficulty: q.difficulty || 'medium',
      order: index + 1,
    }));
  } catch (error) {
    console.error('Gemini question generation error:', error);
    // Fallback questions if API fails
    return getFallbackQuestions(role, type, experience, count);
  }
}

export async function generateFeedback(questions, answers) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    let prompt = `Analyze the following interview answers and provide detailed feedback.\n\n`;
    prompt += `Questions and Answers:\n`;
    
    questions.forEach((q, i) => {
      prompt += `\nQ${i + 1}: ${q.text}\n`;
      prompt += `A${i + 1}: ${answers[i]?.answer || 'No answer provided'}\n`;
    });

    prompt += `\n${SYSTEM_PROMPTS.feedback}\n\n`;
    prompt += `Return ONLY valid JSON in this exact format:
{
  "questionFeedback": [
    {
      "question": "Original question",
      "answer": "Original answer",
      "score": 75,
      "feedback": "Detailed feedback text",
      "tips": "Specific improvement tip"
    }
  ],
  "strengths": ["Strength 1", "Strength 2"],
  "improvements": ["Improvement area 1", "Improvement area 2"],
  "technicalScore": 70,
  "communicationScore": 75,
  "confidenceScore": 65,
  "relevanceScore": 80,
  "depthScore": 72,
  "overallFeedback": "Overall assessment paragraph",
  "score": 72
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // Clean up markdown
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const feedback = JSON.parse(text);
    
    // Calculate overall score if not provided
    if (!feedback.score && feedback.questionFeedback) {
      const scores = feedback.questionFeedback.map(qf => qf.score || 0);
      feedback.score = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    }
    
    return feedback;
  } catch (error) {
    console.error('Gemini feedback generation error:', error);
    return getFallbackFeedback(questions, answers);
  }
}

function getFallbackQuestions(role, type, experience, count) {
  const fallbacks = [
    { text: `Tell me about yourself and your experience with ${role}.`, type, context: null, difficulty: 'easy' },
    { text: `What's the most challenging project you've worked on and how did you overcome obstacles?`, type, context: null, difficulty: 'medium' },
    { text: `How do you stay updated with the latest trends and technologies in ${role}?`, type, context: null, difficulty: 'medium' },
    { text: `Describe a situation where you had to work under pressure. How did you handle it?`, type, context: 'Use the STAR method: Situation, Task, Action, Result', difficulty: 'medium' },
    { text: `Where do you see yourself professionally in the next 5 years?`, type, context: null, difficulty: 'easy' },
    { text: `What makes you a good fit for this ${role} position?`, type, context: null, difficulty: 'easy' },
    { text: `Describe a time you received constructive criticism and how you responded.`, type, context: null, difficulty: 'medium' },
    { text: `How do you prioritize tasks when working on multiple projects simultaneously?`, type, context: null, difficulty: 'medium' },
    { text: `What technical skills do you consider your strongest and weakest?`, type, context: null, difficulty: 'easy' },
    { text: `Describe a situation where you had to explain a complex technical concept to a non-technical stakeholder.`, type, context: null, difficulty: 'hard' },
  ];
  
  return fallbacks.slice(0, count).map((q, i) => ({ ...q, order: i + 1 }));
}

function getFallbackFeedback(questions, answers) {
  return {
    questionFeedback: questions.map((q, i) => ({
      question: q.text,
      answer: answers[i]?.answer || '',
      score: 70,
      feedback: 'Your answer shows good understanding of the topic. Consider providing more specific examples and structure your response clearly.',
      tips: 'Try using the STAR method to structure your answer with concrete examples from your experience.',
    })),
    strengths: [
      'Good communication skills demonstrated',
      'Shows enthusiasm for the role',
      'Clear understanding of basic concepts',
    ],
    improvements: [
      'Provide more specific examples from past experiences',
      'Structure answers more clearly with frameworks like STAR',
      'Quantify achievements with metrics where possible',
    ],
    technicalScore: 70,
    communicationScore: 75,
    confidenceScore: 65,
    relevanceScore: 72,
    depthScore: 68,
    overallFeedback: 'Overall, you demonstrated good potential. Focus on providing more structured and detailed answers with concrete examples from your experience.',
    score: 70,
  };
}

