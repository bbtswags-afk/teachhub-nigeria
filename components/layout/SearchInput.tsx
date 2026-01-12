"use client";

import { Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { useState } from "react";

export function SearchInput() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set("q", term);
        } else {
            params.delete("q");
        }
        replace(`${pathname}?${params.toString()}`);
    }, 300);

    let placeholder = "Search...";
    if (pathname.includes("/dashboard")) placeholder = "Search my courses...";
    if (pathname.includes("/resources")) placeholder = "Search library...";

    return (
        <>
            {/* Mobile Trigger */}
            <button
                onClick={() => setIsMobileOpen(true)}
                className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-full"
            >
                <Search size={20} />
            </button>

            {/* Mobile Overlay Search */}
            {isMobileOpen && (
                <div className="fixed inset-0 z-50 bg-white px-4 py-3 flex items-center gap-4 lg:hidden border-b border-slate-200 h-16 animate-in slide-in-from-top-5 duration-200">
                    <Search size={20} className="text-slate-400 shrink-0" />
                    <input
                        autoFocus
                        type="text"
                        placeholder={placeholder}
                        onChange={(e) => handleSearch(e.target.value)}
                        defaultValue={searchParams.get("q")?.toString()}
                        className="flex-1 bg-transparent text-lg focus:outline-none placeholder:text-slate-400"
                    />
                    <button
                        onClick={() => setIsMobileOpen(false)}
                        className="p-2 text-slate-500 hover:bg-slate-100 rounded-full"
                    >
                        <X size={20} />
                    </button>
                </div>
            )}

            {/* Desktop Search */}
            <div className="hidden lg:flex items-center relative">
                <Search size={18} className="absolute left-3 text-slate-400" />
                <input
                    type="text"
                    placeholder={placeholder}
                    onChange={(e) => handleSearch(e.target.value)}
                    defaultValue={searchParams.get("q")?.toString()}
                    className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-64 transition-all focus:w-80"
                />
            </div>
        </>
    );
}
