import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import api from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { 
  PlusCircle, Clock, TrendingUp, Target, 
  ArrowRight, Brain, Star, Loader2, 
  BarChart3, MessageSquare, CheckCircle2
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useUser();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    averageScore: 0,
    improvement: 0,
  });

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const res = await api.get('/interviews');
      const data = res.data;
      setInterviews(data);

      const completed = data.filter(i => i.status === 'completed');
      const avgScore = completed.length > 0
        ? Math.round(completed.reduce((sum, i) => sum + (i.score || 0), 0) / completed.length)
        : 0;

      setStats({
        total: data.length,
        completed: completed.length,
        averageScore: avgScore,
        improvement: completed.length > 1 ? Math.min(avgScore, 85) : 0,
      });
    } catch (err) {
      console.error('Failed to fetch interviews:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      case 'in_progress':
        return <Badge variant="warning">In Progress</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  return (
    <div className="container py-8 space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {user?.firstName || 'User'} 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's your interview preparation overview
          </p>
        </div>
        <Link to="/create-interview">
          <Button variant="gradient" size="lg" className="group">
            <PlusCircle className="w-5 h-5 mr-2" />
            Start New Interview
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Interviews</p>
                <p className="text-3xl font-bold mt-1">{stats.total}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
                <Brain className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-3xl font-bold mt-1">{stats.completed}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Score</p>
                <p className="text-3xl font-bold mt-1">{stats.averageScore}%</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Improvement</p>
                <p className="text-3xl font-bold mt-1">+{stats.improvement}%</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interview List */}
      <div>
        <Tabs defaultValue="all" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Your Interviews</h2>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="space-y-4">
            {interviews.length === 0 ? (
              <EmptyState />
            ) : (
              interviews.map((interview) => (
                <InterviewCard key={interview._id} interview={interview} getStatusBadge={getStatusBadge} />
              ))
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {interviews.filter(i => i.status === 'completed').length === 0 ? (
              <EmptyState />
            ) : (
              interviews.filter(i => i.status === 'completed').map((interview) => (
                <InterviewCard key={interview._id} interview={interview} getStatusBadge={getStatusBadge} />
              ))
            )}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            {interviews.filter(i => i.status !== 'completed').length === 0 ? (
              <EmptyState />
            ) : (
              interviews.filter(i => i.status !== 'completed').map((interview) => (
                <InterviewCard key={interview._id} interview={interview} getStatusBadge={getStatusBadge} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function InterviewCard({ interview, getStatusBadge }) {
  return (
    <Link to={`/interview/${interview._id}`}>
      <Card className="hover:shadow-md hover:border-primary/20 transition-all duration-200 group cursor-pointer">
        <CardContent className="flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shrink-0">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold group-hover:text-primary transition-colors">
                {interview.role} - {interview.type} Interview
              </h3>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-sm text-muted-foreground">{formatDate(interview.createdAt)}</span>
                {getStatusBadge(interview.status)}
                {interview.score && (
                  <span className="text-sm font-medium text-emerald-600">{interview.score}% Score</span>
                )}
              </div>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{interview.duration || 0} questions</span>
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function EmptyState() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-16">
        <div className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center mb-4">
          <Brain className="w-8 h-8 text-purple-600" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No interviews yet</h3>
        <p className="text-muted-foreground mb-6 text-center max-w-sm">
          Start your first mock interview to practice and improve your skills
        </p>
        <Link to="/create-interview">
          <Button variant="gradient">
            <PlusCircle className="w-4 h-4 mr-2" />
            Create Your First Interview
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

