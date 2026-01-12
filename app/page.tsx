"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Brain, Users, Play, Rocket, CheckCircle, Star } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 relative flex items-center justify-center">
              <img src="/logo.png" alt="TeachHub Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-bold text-2xl tracking-tight text-slate-900">TeachHub</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
              <Link href="/features" className="hover:text-primary transition-colors">Features</Link>
              <Link href="/about" className="hover:text-primary transition-colors">About</Link>
              <Link href="/#testimonials" className="hover:text-primary transition-colors">Testimonials</Link>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-slate-600 font-medium hover:text-slate-900 hidden sm:block">
                Sign In
              </Link>
              <Link
                href="/register/teacher"
                className="bg-primary hover:bg-indigo-700 text-white px-6 py-2.5 rounded-full font-bold transition-all shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/30 active:scale-95"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[55%] h-full bg-gradient-to-bl from-indigo-50 to-white rounded-bl-[150px] -z-10" />
        <div className="absolute top-20 right-20 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm text-slate-600 text-sm font-medium mb-8 hover:border-primary/50 transition-colors cursor-default">
              <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              Now live in Nigeria
            </div>

            <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight mb-8 leading-[1.1]">
              The Future of Learning <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-500 to-purple-600">
                Is Here.
              </span>
            </h1>

            <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
              Empowering Nigerian educators with a centralized, data-driven platform for curriculum resources, lesson planning, and student engagement.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/register/teacher"
                className="w-full sm:w-auto px-8 py-4 bg-primary text-white text-lg font-bold rounded-full hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/30 flex items-center justify-center gap-2 group"
              >
                Start Teaching Free
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 text-lg font-bold rounded-full border border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 hover:border-slate-300">
                <Play size={20} className="fill-slate-900" />
                Watch 2min Demo
              </button>
            </div>

            <div className="mt-12 flex items-center justify-center gap-8 text-slate-400 grayscale opacity-70">
              <span className="font-bold text-xl">CDDtech</span>
              <span className="font-bold text-xl">LagosInnovates</span>
              <span className="font-bold text-xl">EduNaija</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-slate-100 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <StatItem number="50+" label="Partner Schools" />
          <StatItem number="10k+" label="Active Students" />
          <StatItem number="5,000" label="Resources Library" />
          <StatItem number="98%" label="Teacher Satisfaction" />
        </div>
      </section>

      {/* About / Problem-Solution */}
      <section id="about" className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl opacity-20 blur-lg transform rotate-2"></div>
              <img
                src="/about-image.png"
                alt="Students learning in a modern African classroom"
                className="relative rounded-3xl shadow-2xl w-full object-cover h-[500px]"
              />
              <div className="absolute bottom-8 right-8 bg-white p-6 rounded-2xl shadow-xl max-w-xs">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                    <CheckCircle size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Compliance Ready</p>
                    <p className="text-xs text-slate-500">NERDC Curriculum</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <span className="text-primary font-bold tracking-wider uppercase text-sm mb-2 block">Our Mission</span>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">Bridging the Gap in <br />Digital Education.</h2>
              <p className="text-slate-500 text-lg leading-relaxed mb-6">
                Before TeachHub, educators in Nigeria struggled with fragmented resources and outdated tools. We're changing that narrative.
              </p>
              <div className="space-y-4">
                <FeatureRow title="Centralized Library" desc="Access thousands of vetted lesson plans and videos instantly." />
                <FeatureRow title="Offline Capable" desc="Designed for low-bandwidth environments to ensure no student is left behind." />
                <FeatureRow title="Automated Grading" desc="Save hours of administrative time with our AI-powered quiz tools." />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Everything You Need to Excel</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">A complete suite of tools built specifically for the modern Nigerian classroom.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={BookOpen}
              color="bg-blue-500"
              title="Curriculum Mapped"
              desc="Resources aligned perfectly with the Nigerian NERDC curriculum."
            />
            <FeatureCard
              icon={Brain}
              color="bg-purple-500"
              title="Interactive Quizzes"
              desc="Create and grade quizzes automatically with our smart tools."
            />
            <FeatureCard
              icon={Rocket}
              color="bg-orange-500"
              title="Gamified Learning"
              desc="Boost student engagement with leaderboards and fun games."
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-indigo-50/50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-16">Loved by Educators</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard
              quote="TeachHub has completely transformed how I plan my lessons. I save 5 hours every week!"
              author="Mrs. Adebayo"
              role="Principal, Heritage School"
            />
            <TestimonialCard
              quote="The offline mode is a lifesaver. My students can access quizzes even when the data is low."
              author="Mr. Okafor"
              role="Science Teacher"
            />
            <TestimonialCard
              quote="Finally, a platform that understands our local curriculum. The content is spot on."
              author="Ms. Ibrahim"
              role="Primary Educator"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 relative flex items-center justify-center">
                  <img src="/logo.png" alt="TeachHub Logo" className="w-full h-full object-contain" />
                </div>
                <span className="font-bold text-xl text-slate-900">TeachHub</span>
              </div>
              <p className="text-slate-500 text-sm">Empowering the next generation of African leaders through technology.</p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><Link href="/features" className="hover:text-primary">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-primary">Pricing</Link></li>
                <li><Link href="/enterprise" className="hover:text-primary">Enterprise</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><Link href="/about" className="hover:text-primary">About Us</Link></li>
                <li><Link href="/careers" className="hover:text-primary">Careers</Link></li>
                <li><Link href="/contact" className="hover:text-primary">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><Link href="/privacy" className="hover:text-primary">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-primary">Terms</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-8 text-center">
            <p className="text-slate-400 text-sm">© 2026 TeachHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function StatItem({ number, label }: { number: string, label: string }) {
  return (
    <div>
      <p className="text-4xl font-bold text-slate-900 mb-1">{number}</p>
      <p className="text-slate-500 font-medium">{label}</p>
    </div>
  );
}

function FeatureRow({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="flex gap-4">
      <div className="mt-1">
        <CheckCircle className="text-primary" size={20} />
      </div>
      <div>
        <h4 className="font-bold text-slate-900">{title}</h4>
        <p className="text-slate-500 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc, color }: { icon: any, title: string, desc: string, color: string }) {
  return (
    <div className="bg-white/10 backdrop-blur-sm p-8 rounded-3xl border border-white/10 hover:bg-white/20 transition-all">
      <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg`}>
        <Icon size={28} />
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-indigo-100 leading-relaxed">{desc}</p>
    </div>
  );
}

function TestimonialCard({ quote, author, role }: { quote: string, author: string, role: string }) {
  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
      <div className="flex gap-1 text-yellow-400 mb-4">
        {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="currentColor" />)}
      </div>
      <p className="text-slate-700 font-medium leading-relaxed mb-6">"{quote}"</p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-slate-200 rounded-full overflow-hidden">
          <img src={`https://ui-avatars.com/api/?name=${author}&background=random`} alt={author} />
        </div>
        <div>
          <p className="font-bold text-slate-900 text-sm">{author}</p>
          <p className="text-slate-500 text-xs">{role}</p>
        </div>
      </div>
    </div>
  );
}
