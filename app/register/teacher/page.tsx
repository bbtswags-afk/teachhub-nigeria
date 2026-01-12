"use client";

import { useActionState, useState } from "react";
import { registerTeacher } from "@/app/actions/auth";
import { Mail, Lock, User, School, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function RegisterTeacherPage() {
    const [state, action, isPending] = useActionState(registerTeacher, undefined);
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-600 to-slate-50 opacity-10" />
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
            <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />

            <div className="absolute top-8 left-8 z-20">
                <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium transition-colors">
                    <ArrowRight size={20} className="rotate-180" /> Back to Home
                </Link>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md p-8 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 relative z-10 mx-4"
            >
                <div className="text-center mb-8">
                    <div className="w-16 h-16 relative flex items-center justify-center mx-auto mb-6 transform rotate-3 hover:rotate-6 transition-transform">
                        <img src="/logo.png" alt="TeachHub Logo" className="w-full h-full object-contain" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create Teacher Account</h1>
                    <p className="text-slate-500 mt-2">Join TeachHub to start creating lessons</p>
                </div>

                <form action={action} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 ml-1">Full Name</label>
                        <div className="relative group">
                            <User className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                            <input
                                name="name"
                                type="text"
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 font-medium"
                                placeholder="e.g. John Doe"
                                required
                            />
                        </div>
                        {state?.errors?.name && <p className="text-red-500 text-xs ml-1">{state.errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 ml-1">Properties (School Name)</label>
                        <div className="relative group">
                            <School className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                            <input
                                name="school"
                                type="text"
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 font-medium"
                                placeholder="e.g. CDDtech Academy"
                                required
                            />
                        </div>
                        {state?.errors?.school && <p className="text-red-500 text-xs ml-1">{state.errors.school}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 ml-1">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                            <input
                                name="email"
                                type="email"
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 font-medium"
                                placeholder="teacher@example.com"
                                required
                            />
                        </div>
                        {state?.errors?.email && <p className="text-red-500 text-xs ml-1">{state.errors.email}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 ml-1">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                            <input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                className="w-full pl-12 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 font-medium"
                                placeholder="Create a password"
                                required
                                minLength={6}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {state?.errors?.password && <p className="text-red-500 text-xs ml-1">{state.errors.password}</p>}
                    </div>

                    {state?.message && <p className="text-red-500 text-sm text-center">{state.message}</p>}

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full py-4 bg-primary hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 transition-all transform active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group mt-6"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                Creating Account...
                            </>
                        ) : (
                            <>
                                Create Account
                                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-slate-500 text-sm">
                        Already have an account?
                        <Link href="/login" className="text-primary font-bold ml-1 hover:underline">Sign in</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
