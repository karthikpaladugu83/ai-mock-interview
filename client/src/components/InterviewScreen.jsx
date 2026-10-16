import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import api from '@/lib/api';
import { 
  Mic, MicOff, Send, Play, Pause, 
  Loader2, Clock, ArrowLeft, CheckCircle2,
  MessageSquare, SkipForward, AlertCircle
} from 'lucide-react';

export default function InterviewScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [interview, setInterview] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stage, setStage] = useState('loading'); // loading, ready, in_progress, completed
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    fetchInterview();
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [id]);

  const fetchInterview = async () => {
    try {
      const res = await api.get(`/interviews/${id}`);
      setInterview(res.data);
      
      if (res.data.status === 'completed') {
        navigate(`/feedback/${id}`);
        return;
      }

      // Load questions
      const qRes = await api.get(`/interviews/${id}/questions`);
      setQuestions(qRes.data);
      
      if (qRes.data.length > 0) {
        setStage('ready');
      } else {
        // Generate questions
        setStage('generating');
        const genRes = await api.post(`/interviews/${id}/generate`);
        setQuestions(genRes.data);
        setStage('ready');
      }
    } catch (err) {
      console.error('Failed to load interview:', err);
      setStage('error');
    }
  };

  const startTimer = useCallback((minutes) => {
    setTimeLeft(minutes * 60);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleNext();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const startInterview = () => {
    setStage('in_progress');
    startTimer(2); // 2 minutes per question initially
  };

  const handleNext = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Save current answer
    const currentAnswer = {
      questionId: questions[currentIndex]._id,
      question: questions[currentIndex].text,
      answer: answer.trim(),
    };

    const newAnswers = [...answers, currentAnswer];
    setAnswers(newAnswers);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setAnswer('');
      setTimeLeft(120);
      startTimer(2);
    } else {
      // Interview completed
      setStage('completed');
      try {
        await api.post(`/interviews/${id}/submit`, { answers: newAnswers, questions });
        navigate(`/feedback/${id}`);
      } catch (err) {
        console.error('Failed to submit answers:', err);
      }
    }
  };

  const toggleRecording = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const startRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        }
      }
      setAnswer(prev => prev + finalTranscript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  if (stage === 'loading' || stage === 'generating') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">
            {stage === 'generating' ? 'Generating Questions...' : 'Loading Interview...'}
          </h2>
          <p className="text-muted-foreground">
            {stage === 'generating' 
              ? 'AI is crafting personalized questions for you'
              : 'Preparing your interview session'}
          </p>
        </div>
      </div>
    );
  }

  if (stage === 'error') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
          <p className="text-muted-foreground mb-4">Failed to load interview. Please try again.</p>
          <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  if (stage === 'ready') {
    return (
      <div className="container max-w-3xl py-8">
        <Card className="text-center">
          <CardHeader>
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-2xl">Ready to Begin?</CardTitle>
            <CardDescription className="text-base max-w-md mx-auto">
              You'll have {questions.length} questions to answer. Take your time and be thorough in your responses.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto mb-6">
              <div className="p-3 rounded-xl bg-muted/50">
                <p className="text-2xl font-bold text-primary">{questions.length}</p>
                <p className="text-xs text-muted-foreground">Questions</p>
              </div>
              <div className="p-3 rounded-xl bg-muted/50">
                <p className="text-2xl font-bold text-primary">2</p>
                <p className="text-xs text-muted-foreground">Min/Each</p>
              </div>
              <div className="p-3 rounded-xl bg-muted/50">
                <p className="text-2xl font-bold text-primary">Voice</p>
                <p className="text-xs text-muted-foreground">Input</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-center gap-4">
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button variant="gradient" size="lg" onClick={startInterview}>
              <Play className="w-5 h-5 mr-2" />
              Start Interview
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="container max-w-4xl py-8">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">
            Question {currentIndex + 1} of {questions.length}
          </span>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className={`text-sm font-mono ${timeLeft < 30 ? 'text-destructive' : ''}`}>
              {minutes}:{seconds.toString().padStart(2, '0')}
            </span>
          </div>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary rounded-full h-2 transition-all duration-500"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <Card className="mb-6">
        <CardHeader>
          <Badge variant="outline" className="w-fit mb-2">
            {interview?.type} Question
          </Badge>
          <CardTitle className="text-xl leading-relaxed">
            {currentQuestion?.text}
          </CardTitle>
          {currentQuestion?.context && (
            <CardDescription className="mt-2">
              {currentQuestion.context}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent>
          {/* Answer Area */}
          <div className="relative">
            <Textarea
              placeholder="Type your answer here... (or use voice input)"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="min-h-[200px] text-base leading-relaxed resize-none"
            />
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              <Button
                variant={isRecording ? 'destructive' : 'secondary'}
                size="sm"
                onClick={toggleRecording}
                className="gap-2"
              >
                {isRecording ? (
                  <>
                    <MicOff className="w-4 h-4" />
                    Stop
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4" />
                    Record
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Word count */}
          <div className="flex justify-between mt-2">
            <p className="text-xs text-muted-foreground">
              {answer.split(/\s+/).filter(Boolean).length} words
            </p>
          </div>
        </CardContent>

        <CardFooter className="justify-between border-t bg-muted/50 px-6 py-4">
          <Button
            variant="ghost"
            onClick={() => {
              if (currentIndex > 0) {
                setCurrentIndex(prev => prev - 1);
                setAnswer(answers[currentIndex - 1]?.answer || '');
              }
            }}
            disabled={currentIndex === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={handleNext}>
              <SkipForward className="w-4 h-4 mr-2" />
              Skip
            </Button>
            <Button onClick={handleNext} disabled={!answer.trim()}>
              {currentIndex < questions.length - 1 ? (
                <>
                  Next
                  <Send className="w-4 h-4 ml-2" />
                </>
              ) : (
                <>
                  Complete
                  <CheckCircle2 className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

