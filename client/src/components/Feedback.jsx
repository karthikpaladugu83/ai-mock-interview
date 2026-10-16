import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import api from '@/lib/api';
import { formatDate } from '@/lib/utils';
import {
  Loader2, ArrowLeft, Star, Target, MessageSquare,
  ThumbsUp, AlertTriangle, Lightbulb, TrendingUp,
  RefreshCw, BarChart3, CheckCircle2, Clock
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';

export default function Feedback() {
  const { id } = useParams();
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedback();
  }, [id]);

  const fetchFeedback = async () => {
    try {
      const res = await api.get(`/interviews/${id}/feedback`);
      setFeedback(res.data);
    } catch (err) {
      console.error('Failed to load feedback:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Loading Feedback...</h2>
          <p className="text-muted-foreground">AI is analyzing your responses</p>
        </div>
      </div>
    );
  }

  if (!feedback) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Feedback not available</h2>
          <p className="text-muted-foreground mb-4">The feedback for this interview is not ready yet.</p>
          <Link to="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const performanceData = [
    { category: 'Technical', score: feedback.technicalScore || 70 },
    { category: 'Communication', score: feedback.communicationScore || 75 },
    { category: 'Confidence', score: feedback.confidenceScore || 65 },
    { category: 'Relevance', score: feedback.relevanceScore || 80 },
    { category: 'Depth', score: feedback.depthScore || 72 },
  ];

  const radarData = performanceData.map(d => ({
    subject: d.category,
    score: d.score,
    fullMark: 100,
  }));

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">Interview Feedback</h1>
          </div>
          <p className="text-muted-foreground ml-14">
            {feedback.role} • {feedback.type} Interview • {formatDate(feedback.date)}
          </p>
        </div>
        <Badge variant={feedback.score >= 70 ? 'success' : feedback.score >= 50 ? 'warning' : 'destructive'} className="text-lg px-4 py-1.5">
          Score: {feedback.score}%
        </Badge>
      </div>

      {/* Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Overall Score', value: `${feedback.score}%`, icon: Target, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Questions Answered', value: `${feedback.answered || 0}/${feedback.total || 0}`, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Strengths', value: feedback.strengths?.length || 0, icon: ThumbsUp, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Areas to Improve', value: feedback.improvements?.length || 0, icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="flex items-center gap-4 pt-6">
                <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts & Details */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="questions">Question Review</TabsTrigger>
          <TabsTrigger value="improvements">Improvements</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Performance by Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="category" className="text-xs" />
                      <YAxis domain={[0, 100]} className="text-xs" />
                      <Tooltip
                        contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
                      />
                      <Bar dataKey="score" fill="#6366F1" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Radar Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Skill Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid className="stroke-muted" />
                      <PolarAngleAxis dataKey="subject" className="text-xs" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} className="text-xs" />
                      <Radar
                        name="Score"
                        dataKey="score"
                        stroke="#6366F1"
                        fill="#6366F1"
                        fillOpacity={0.2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="questions">
          <div className="space-y-4">
            {feedback.questionFeedback?.map((qf, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </span>
                      <CardTitle className="text-base">{qf.question}</CardTitle>
                    </div>
                    <Badge variant={qf.score >= 70 ? 'success' : qf.score >= 50 ? 'warning' : 'destructive'}>
                      {qf.score}%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Your Answer:</p>
                      <p className="text-sm bg-muted/50 rounded-lg p-3">{qf.answer}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Feedback:</p>
                      <p className="text-sm">{qf.feedback}</p>
                    </div>
                    {qf.tips && (
                      <div className="flex items-start gap-2 text-sm text-amber-600 bg-amber-50 rounded-lg p-3">
                        <Lightbulb className="w-4 h-4 mt-0.5 shrink-0" />
                        <p>{qf.tips}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="improvements">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ThumbsUp className="w-5 h-5 text-emerald-600" />
                  Strengths
                </CardTitle>
                <CardDescription>What you did well</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {feedback.strengths?.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                      <span className="text-sm">{strength}</span>
                    </li>
                  ))}
                  {(!feedback.strengths || feedback.strengths.length === 0) && (
                    <p className="text-sm text-muted-foreground">No strengths identified yet.</p>
                  )}
                </ul>
              </CardContent>
            </Card>

            {/* Areas for Improvement */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-600" />
                  Areas for Improvement
                </CardTitle>
                <CardDescription>Focus on these areas</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {feedback.improvements?.map((improvement, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                      <span className="text-sm">{improvement}</span>
                    </li>
                  ))}
                  {(!feedback.improvements || feedback.improvements.length === 0) && (
                    <p className="text-sm text-muted-foreground">No improvements suggested.</p>
                  )}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Actions */}
      <div className="flex items-center justify-center gap-4 pt-4">
        <Link to={`/interview/${id}`}>
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry Interview
          </Button>
        </Link>
        <Link to="/create-interview">
          <Button variant="gradient">
            <BarChart3 className="w-4 h-4 mr-2" />
            Try Different Role
          </Button>
        </Link>
      </div>
    </div>
  );
}

