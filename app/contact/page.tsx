import StaticPage from "@/components/layout/StaticPage";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
    return (
        <StaticPage title="Contact Us">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                    <h2 className="text-xl font-bold mb-6">Get in Touch</h2>
                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-indigo-50 text-primary rounded-lg flex items-center justify-center shrink-0">
                                <Mail size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">Email</h3>
                                <p className="text-slate-500">support@teachhub.ng</p>
                                <p className="text-slate-500">sales@teachhub.ng</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-indigo-50 text-primary rounded-lg flex items-center justify-center shrink-0">
                                <Phone size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">Phone</h3>
                                <p className="text-slate-500">+234 800 TEACHHUB</p>
                                <p className="text-slate-500">Mon-Fri, 9am - 5pm WAT</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-indigo-50 text-primary rounded-lg flex items-center justify-center shrink-0">
                                <MapPin size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">Office</h3>
                                <p className="text-slate-500">
                                    12 Innovation Drive,<br />
                                    Yaba, Lagos,<br />
                                    Nigeria
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <form className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                    <h3 className="font-bold text-lg mb-4">Send us a message</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                            <input type="text" className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                            <input type="email" className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                            <textarea className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none h-32"></textarea>
                        </div>
                        <button type="button" className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors">Send Message</button>
                    </div>
                </form>
            </div>
        </StaticPage>
    );
}
