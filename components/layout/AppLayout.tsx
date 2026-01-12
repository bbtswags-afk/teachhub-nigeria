"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import clsx from "clsx";

export function AppLayout({ children, user }: { children: React.ReactNode, user?: any }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main Content */}
            <div className={clsx(
                "flex-1 flex flex-col min-h-screen transition-all duration-300"
                // Removed lg:ml-64 because sidebar is static (flex item) on desktop
            )}>
                <Header onMenuClick={() => setSidebarOpen(true)} user={user} />

                <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto w-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
