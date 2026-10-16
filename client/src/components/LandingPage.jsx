import { Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, Sparkles, Shield, Zap, Mic, Brain, 
  BarChart3, Star, ChevronRight, GraduationCap,
  CheckCircle2, MessageSquare, Clock
} from 'lucide-react';

export default function LandingPage() {
  const { isSignedIn } = useUser();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-indigo-50" />
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-purple-100/50 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-indigo-100/50 to-transparent rounded-full blur-3xl" />
        
        <div className="relative container pt-20 pb-32">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 animate-float">
              <Sparkles className="w-4 h-4" />
              AI-Powered Interview Preparation
            </div>

            {/* Heading */}
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              Ace Your Next
              <span className="block bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Technical Interview
              </span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Practice with AI-generated interview questions tailored to your role, 
              get real-time feedback, and track your progress. Land your dream job with confidence.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {isSignedIn ? (
                <Link to="/dashboard">
                  <Button size="xl" variant="gradient" className="group">
                    Go to Dashboard
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/login">
                    <Button size="xl" variant="gradient" className="group">
                      Start Practicing Free
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Button size="xl" variant="outline">
                    Watch Demo
                  </Button>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16 max-w-lg mx-auto">
              {[
                { value: '10K+', label: 'Interviews' },
                { value: '95%', label: 'Success Rate' },
                { value: '50+', label: 'Roles' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered platform provides comprehensive interview preparation tools
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: 'Smart Question Generation',
                description: 'AI generates relevant questions based on your role, experience, and the specific job description.',
                color: 'from-purple-500 to-purple-600',
                bgColor: 'bg-purple-50',
              },
              {
                icon: Mic,
                title: 'Voice Recognition',
                description: 'Practice speaking your answers naturally with real-time voice-to-text transcription.',
                color: 'from-blue-500 to-blue-600',
                bgColor: 'bg-blue-50',
              },
              {
                icon: BarChart3,
                title: 'Detailed Analytics',
                description: 'Track your performance over time with detailed metrics and progress charts.',
                color: 'from-emerald-500 to-emerald-600',
                bgColor: 'bg-emerald-50',
              },
              {
                icon: MessageSquare,
                title: 'AI Feedback',
                description: 'Get instant, detailed feedback on your answers with suggestions for improvement.',
                color: 'from-orange-500 to-orange-600',
                bgColor: 'bg-orange-50',
              },
              {
                icon: Zap,
                title: 'Real-time Practice',
                description: 'Simulate real interview conditions with timed responses and pressure scenarios.',
                color: 'from-pink-500 to-pink-600',
                bgColor: 'bg-pink-50',
              },
              {
                icon: Shield,
                title: 'Multiple Interview Types',
                description: 'Practice technical, behavioral, system design, and general interviews.',
                color: 'from-indigo-500 to-indigo-600',
                bgColor: 'bg-indigo-50',
              },
            ].map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group relative p-6 rounded-2xl border bg-white hover:shadow-lg hover:border-primary/20 transition-all duration-300"
                >
                  <div className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 bg-gradient-to-br ${feature.color} bg-clip-text text-transparent`} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gradient-to-br from-purple-50 via-white to-indigo-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get started in minutes with our simple three-step process
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-4xl mx-auto">
            {[
              {
                step: '01',
                title: 'Set Up Your Profile',
                description: 'Tell us your target role, experience level, and interview type you want to practice.',
                color: 'from-purple-500 to-indigo-500',
              },
              {
                step: '02',
                title: 'Practice with AI',
                description: 'Answer AI-generated questions using voice or text. Get real-time feedback on your responses.',
                color: 'from-indigo-500 to-blue-500',
              },
              {
                step: '03',
                title: 'Track & Improve',
                description: 'Review detailed feedback, track your progress, and focus on areas that need improvement.',
                color: 'from-blue-500 to-cyan-500',
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                  <span className="text-2xl font-bold text-white">{item.step}</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by Job Seekers
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of professionals who landed their dream jobs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: 'Sarah Chen',
                role: 'Software Engineer at Google',
                content: 'The AI feedback system is incredible. It helped me identify weak spots in my answers and improve dramatically before my actual interview.',
                rating: 5,
              },
              {
                name: 'James Wilson',
                role: 'Product Manager at Meta',
                content: 'The behavioral interview practice was incredibly realistic. I felt completely prepared after just a week of practice.',
                rating: 5,
              },
              {
                name: 'Priya Patel',
                role: 'Data Scientist at Amazon',
                content: 'Finally, a tool that understands technical interviews. The question quality is outstanding and very relevant to actual interviews.',
                rating: 5,
              },
            ].map((testimonial) => (
              <div key={testimonial.name} className="p-6 rounded-2xl border bg-card hover:shadow-md transition-shadow">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-semibold text-sm">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-purple-600 to-indigo-600">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Ace Your Interview?
          </h2>
          <p className="text-lg text-purple-100 max-w-2xl mx-auto mb-10">
            Join thousands of professionals who have already improved their interview skills. Start practicing for free.
          </p>
          {isSignedIn ? (
            <Link to="/dashboard">
              <Button size="xl" className="bg-white text-primary hover:bg-white/90 shadow-xl shadow-black/20">
                Go to Dashboard
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button size="xl" className="bg-white text-primary hover:bg-white/90 shadow-xl shadow-black/20">
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t bg-background">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg">
                <GraduationCap className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg">MockAI</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-foreground transition-colors">Contact</a>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 MockAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

