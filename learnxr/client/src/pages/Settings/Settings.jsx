import { useState } from "react";
import Logo from "../../assets/LogoXROrange.png";

export default function Settings() {
    const [emailUpdates, setEmailUpdates] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(false);
    const [autoUpdates, setAutoUpdates] = useState(false);

    return (
        <div className="min-h-screen pt-24 bg-gradient-to-b from-[#0a0a23] to-[#1a1a3d] text-white flex">
            {/* Sidebar */}
            <aside className="hidden md:block w-64 bg-[#3b348b] p-10 space-y-4">
                <div className="flex items-center">
                    <img src={Logo} alt="Logo" className="w-10 h-10" />
                    <h1 className="text-xl font-bold">LearnXR</h1>
                </div>
                <ul className="space-y-2 text-sm text-left">
                    <li className="hover:underline cursor-pointer">Profile</li>
                    <li className="hover:underline cursor-pointer">Preferences</li>
                    <li className="hover:underline cursor-pointer">Accessibility</li>
                    <li className="hover:underline cursor-pointer">Study Settings</li>
                    <li className="hover:underline cursor-pointer">XR/VR Settings</li>
                </ul>
            </aside>

            
            <main className="flex-1 p-10 space-y-10">
                <div>
                    <h2 className="text-2xl font-bold mb-4">Settings</h2>

                    
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold">Profile Settings</h3>
                        <input
                            type="text"
                            placeholder="Username123"
                            className="w-full max-w-md p-2 rounded bg-[#1a1a3d] border border-white/20 text-sm"
                        />
                        <input
                            type="email"
                            placeholder="user@gmail.com"
                            className="w-full max-w-md p-2 rounded bg-[#1a1a3d] border border-white/20 text-sm"
                        />
                        <div className="flex justify-center gap-4 pt-2">
                            <button className="px-4 py-1 border border-white text-sm rounded">Change Password</button>
                            <button className="px-4 py-1 border border-white text-sm rounded">Update Profile Picture</button>
                        </div>
                    </div>
                </div>

                <div className="grid justify-center">
                    <h3 className="text-lg font-semibold mb-4">Preferences</h3>
                    <div className="flex gap-4 mb-4">
                        <select className="bg-[#1a1a3d] text-white border border-white/20 rounded px-3 py-2 text-sm">
                            <option>Theme</option>
                            <option>Light</option>
                            <option>Dark</option>
                        </select>
                        <select className="bg-[#1a1a3d] text-white border border-white/20 rounded px-3 py-2 text-sm">
                            <option>Language</option>
                            <option>English</option>
                            <option>Spanish</option>
                        </select>
                    </div>

                    {/* Toggle Switches */}
                    <div className="space-y-2 text-sm">
                        <Toggle label="Email Updates" value={emailUpdates} onChange={setEmailUpdates} />
                        <Toggle label="Push Notifications" value={pushNotifications} onChange={setPushNotifications} />
                        <Toggle label="Automatic Updates" value={autoUpdates} onChange={setAutoUpdates} />
                    </div>
                </div>
                <div className="pt-4">
                    <button className="px-6 py-2 bg-purple-500 hover:bg-purple-600 transition-colors rounded text-sm font-semibold">
                        Save Settings
                    </button>
                </div>
            </main>
        </div>
    );
}


function Toggle({ label, value, onChange }) {
    return (
        <div className="flex items-center justify-between max-w-md">
            <span>{label}</span>
            <button
                className={`w-10 h-5 rounded-full p-1 transition-colors ${value ? "bg-purple-400" : "bg-gray-500"
                    }`}
                onClick={() => onChange(!value)}
            >
                <div
                    className={`bg-white w-3 h-3 rounded-full transition-transform ${value ? "translate-x-5" : ""
                        }`}
                />
            </button>
        </div>
    );
}
