import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getGroups, createGroup } from "../api/groups"
import { getUsers } from "../api/users"
import type { Group, User } from "../types/index"
import { useLang } from "../context/LanguageContext"

export default function GroupsPage() {
    const [groups, setGroups] = useState<Group[]>([])
    const [users, setUsers] = useState<User[]>([])
    const [showForm, setShowForm] = useState(false)
    const [name, setName] = useState("")
    const [selectedIds, setSelectedIds] = useState<number[]>([])
    const navigate = useNavigate()
    const { t, lang, setLang } = useLang()

    useEffect(() => {
        getGroups().then(setGroups).catch(() => setGroups([]))
        getUsers().then(setUsers)
    }, [])

    const handleCreate = async () => {
        if (!name || selectedIds.length === 0) return
        const group = await createGroup({ name, member_ids: selectedIds })
        setGroups([...groups, group])
        setShowForm(false)
        setName("")
        setSelectedIds([])
    }

    const toggleUser = (id: number) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        )
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white relative overflow-hidden">

            <div className="relative z-10 max-w-2xl mx-auto px-6 py-20">
                <p className="text-xs tracking-widest text-white/30 uppercase mb-3">{t.subtitle}</p>
                <h1 className="text-5xl font-bold tracking-tight mb-16">{t.appName}</h1>
                <button
                    onClick={() => setLang(lang === "en" ? "sv" : "en")}
                    className="absolute top-5 right-2 text-white/30 text-sm border border-white/10 px-4 py-2 rounded-xl hover:text-white/60 hover:border-white/20 transition"
                >
                    {lang === "en" ? "🇸🇪 Svenska" : "🇺🇸 English"}
                </button>
                <div className="flex flex-col gap-2 mb-12">
                    {groups.map(group => (
                        <div
                            key={group.id}
                            onClick={() => navigate(`/groups/${group.id}`)}
                            className="border border-white/[0.08] rounded-2xl px-6 py-5 cursor-pointer bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.15] transition-all flex justify-between items-center"
                        >
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-[15px]">{group.name}</p>
                                <p className="text-[13px] text-white/40 mt-1">{group.members.length} {t.members}</p>
                            </div>
                            <span className="text-white/20 text-lg">→</span>
                        </div>
                    ))}
                </div>
                <button
                    onClick={() => navigate("/users")}
                    className="text-white/50 text-sm px-5 py-2.5 rounded-xl border border-white/10 hover:border-white/20 hover:text-white/60 transition"
                >
                    {t.manageMembers}
                </button>

                {showForm ? (
                    <div className="border border-white/10 rounded-2xl p-7 bg-white/[0.02]">
                        <p className="font-semibold text-base mb-4">{t.newGroup}</p>
                        <input
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Gruppnamn"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none mb-5"
                        />
                        <p className="text-[11px] uppercase tracking-widest text-white/35 mb-3">{t.selectMembers}</p>
                        <div className="flex flex-wrap gap-2 mb-6">
                            {users.map(user => (
                                <button
                                    key={user.id}
                                    onClick={() => toggleUser(user.id)}
                                    className={`px-4 py-1.5 rounded-full text-[13px] border transition-all ${
                                        selectedIds.includes(user.id)
                                            ? "bg-white text-black border-white"
                                            : "bg-transparent text-white/50 border-white/15 hover:border-white/30"
                                    }`}
                                >
                                    {user.name}
                                </button>
                            ))}
                        </div>
                        <div className="flex gap-2.5">
                            <button
                                onClick={handleCreate}
                                className="bg-white text-black font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-white/90 transition"
                            >
                                {t.create}
                            </button>
                            <button
                                onClick={() => setShowForm(false)}
                                className="text-white/40 text-sm px-5 py-2.5 rounded-xl border border-white/10 hover:border-white/20 transition"
                            >
                                {t.cancel}
                            </button>
                        </div>
                    </div>
                ) : (
                    
                    <button
                        onClick={() => setShowForm(true)}
                        className="text-white/50 text-sm px-5 py-2.5 rounded-xl border border-white/10 hover:border-white/20 hover:text-white/60 transition"
                    >
                        {t.newGroup}
                    </button>
                )}
            </div>
        </div>
    )
}