"use client";

import { useState } from "react";
import { updateProfile, changePassword } from "@/app/actions/settings";
import { Eye, EyeOff, Save, Loader2, User as UserIcon, MapPin, Lock, FileImage, Fingerprint, Upload } from "lucide-react";
import { useRouter } from "next/navigation";

interface SettingsFormProps {
    user: any;
}

export default function SettingsForm({ user }: SettingsFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showUserId, setShowUserId] = useState(false);

    // Form States
    const [name, setName] = useState(user.name || "");
    const [address, setAddress] = useState(user.address || "");
    const [avatar, setAvatar] = useState(user.avatar || "");

    // Password States
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const formData = new FormData();
        formData.append("name", name);
        formData.append("address", address);
        formData.append("avatar", avatar);

        const result = await updateProfile(null, formData);

        if (result.success) {
            setMessage({ type: 'success', text: "Profile updated successfully!" });
            router.refresh();
        } else {
            setMessage({ type: 'error', text: result.message || "Failed to update profile." });
        }
        setLoading(false);
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const formData = new FormData();
        formData.append("oldPassword", oldPassword);
        formData.append("newPassword", newPassword);

        const result = await changePassword(null, formData);

        if (result.success) {
            setMessage({ type: 'success', text: "Password changed successfully!" });
            setOldPassword("");
            setNewPassword("");
        } else {
            setMessage({ type: 'error', text: result.message || "Failed to change password." });
        }
        setLoading(false);
    };

    return (
        <div className="space-y-8">
            {message && (
                <div className={`p-4 rounded-xl border ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            {/* Profile Settings */}
            <form onSubmit={handleProfileUpdate} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-primary">
                        <UserIcon />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Personal Information</h2>
                        <p className="text-slate-500 text-sm">Update your public profile details.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Full Name</label>
                        <div className="relative">
                            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 text-slate-900 font-medium"
                                placeholder="Your Name"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Email Address</label>
                        <div className="relative">
                            <input
                                type="email"
                                value={user.email}
                                readOnly
                                disabled
                                className="w-full pl-4 pr-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 font-medium cursor-not-allowed opacity-70"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Address</label>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 text-slate-900 font-medium"
                                placeholder="Your Address"
                            />
                        </div>
                    </div>

                    <div className="col-span-1 md:col-span-2 space-y-2">
                        <label className="text-sm font-bold text-slate-700">Profile Picture</label>
                        <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-white border-2 border-slate-200 shadow-sm flex-shrink-0">
                                {avatar ? (
                                    <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                                        <UserIcon size={32} />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 space-y-2 w-full sm:w-auto text-center sm:text-left">
                                <div className="flex flex-col sm:flex-row gap-3 justify-center sm:justify-start">
                                    <label className="cursor-pointer bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm">
                                        <Upload size={16} />
                                        Upload New Picture
                                        <input
                                            type="file"
                                            accept="image/png, image/jpeg"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => {
                                                        setAvatar(reader.result as string);
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                        />
                                    </label>
                                    {avatar && (
                                        <button
                                            type="button"
                                            onClick={() => setAvatar("")}
                                            className="text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl font-bold text-sm transition-colors"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                                <p className="text-xs text-slate-400">
                                    Recommended: Square JPG or PNG. The image will be resized automatically.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ID Toggle */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-3">
                        <Fingerprint className="text-slate-400" />
                        <div>
                            <p className="font-bold text-slate-900">User ID</p>
                            <p className="text-xs text-slate-500">{showUserId ? user.id : "•".repeat(user.id.length)}</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowUserId(!showUserId)}
                        className="text-primary text-sm font-bold hover:underline"
                    >
                        {showUserId ? "Hide" : "Show"}
                    </button>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-primary hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-500/20 active:scale-95 transition-all"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                        Save Details
                    </button>
                </div>
            </form>

            {/* Password Settings */}
            <form onSubmit={handlePasswordChange} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-primary">
                        <Lock />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Security</h2>
                        <p className="text-slate-500 text-sm">Manage your password and security settings.</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Old Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                className="w-full pl-4 pr-12 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 text-slate-900 font-medium"
                                placeholder="Enter current password"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">New Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full pl-4 pr-12 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 text-slate-900 font-medium"
                                placeholder="Enter new password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <Lock size={18} />}
                        Update Password
                    </button>
                </div>
            </form>
        </div>
    );
}
