import { Menu, Bell, Search } from "lucide-react";
import { MOCK_USER } from "@/data/mocks";
import Link from "next/link";
import { SearchInput } from "./SearchInput";

export function Header({ onMenuClick, user }: { onMenuClick: () => void, user?: any }) {
    return (
        <header className="h-16 bg-white border-b border-border flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="p-2 -ml-2 text-slate-600 hover:bg-slate-50 rounded-lg lg:hidden"
                >
                    <Menu size={24} />
                </button>
                <span className="font-semibold text-lg lg:hidden">Dashboard</span>

                {/* Search Bar (Desktop) */}
                <SearchInput />
            </div>

            <div className="flex items-center gap-4">
                <Link href="/notifications" className="relative p-2 text-slate-500 hover:text-primary transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                </Link>

                <div className="flex items-center gap-3 pl-2 border-l border-slate-100">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-slate-900">{user?.name || "Teacher"}</p>
                        <p className="text-xs text-slate-500">
                            {user?.email ? (() => {
                                const [local, domain] = user.email.split('@');
                                if (!local || local.length < 4) return user.email; // Too short to mask safely
                                const maskedLocal = `${local.slice(0, 2)}***${local.slice(-2)}`;
                                return `${maskedLocal}@${domain}`;
                            })() : "Teacher Access"}
                        </p>
                    </div>
                    <img
                        src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "Teacher")}`}
                        alt="Profile"
                        className="w-8 h-8 rounded-full bg-slate-200 border border-slate-200"
                    />
                </div>
            </div>
        </header>
    );
}
