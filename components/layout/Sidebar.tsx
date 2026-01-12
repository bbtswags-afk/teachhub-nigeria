"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, PenTool, Gamepad2, Settings, LogOut, X } from "lucide-react";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Library", href: "/resources", icon: BookOpen },
    { label: "Content Suite", href: "/dashboard/create-course", icon: PenTool },
    { label: "Game Center", href: "/games", icon: Gamepad2 },
    { label: "Settings", href: "/settings", icon: Settings },
];

function SidebarContent({ onClose, isMobile = false }: { onClose?: () => void, isMobile?: boolean }) {
    const pathname = usePathname();

    return (
        <div className="flex flex-col h-full bg-white border-r border-slate-200">
            <div className="flex items-center justify-between p-6">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 relative flex items-center justify-center">
                        <img src="/logo.png" alt="TeachHub Logo" className="w-full h-full object-contain" />
                    </div>
                    <span className="font-bold text-lg text-slate-800">TeachHub</span>
                </div>
                {isMobile && onClose && (
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-800">
                        <X size={24} />
                    </button>
                )}
            </div>

            <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onClose}
                            className={clsx(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium",
                                isActive
                                    ? "bg-indigo-50 text-indigo-700"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                            )}
                        >
                            <item.icon size={20} className={isActive ? "text-primary" : "text-slate-400"} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-100">
                <Link href="/login" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-red-600 transition-colors w-full rounded-xl hover:bg-slate-50">
                    <LogOut size={20} />
                    Sign Out
                </Link>
            </div>
        </div>
    );
}

export function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    return (
        <>
            {/* Mobile Drawer (Animated) */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
                            onClick={onClose}
                        />
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                            className="fixed top-0 left-0 h-full w-64 z-50 lg:hidden"
                        >
                            <SidebarContent onClose={onClose} isMobile={true} />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Desktop Sidebar (Static) */}
            <aside className="hidden lg:block w-64 h-screen sticky top-0 bg-white border-r border-slate-200 shrink-0">
                <SidebarContent />
            </aside>
        </>
    );
}
