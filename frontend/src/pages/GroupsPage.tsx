import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getGroups, createGroup } from "../api/groups"
import { getUsers } from "../api/users"
import type { Group, User } from "../types/index"

export default function GroupsPage() {
    const [groups, setGroups] = useState<Group[]>([])
    const [users, setUsers] = useState<User[]>([])
    const [showForm, setShowForm] = useState(false)
    const [name, setName] = useState("")
    const [selectedIds, setSelectedIds] = useState<number[]>([])
    const navigate = useNavigate()

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
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                {/* Purple glow */}
                <div style={{
                    position: "absolute",
                    top: "-20%",
                    left: "-10%",
                    width: "500px",
                    height: "500px",
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(120,60,255,0.25) 0%, transparent 70%)",
                    filter: "blur(60px)"
                }} />
                {/* Blue glow */}
                <div style={{
                    position: "absolute",
                    bottom: "-20%",
                    right: "-10%",
                    width: "500px",
                    height: "500px",
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(30,100,255,0.2) 0%, transparent 70%)",
                    filter: "blur(60px)"
                }} />
                {/* sublte white noise vibe */}
                <div style={{
                    position: "absolute",
                    inset: 0,
                    background: "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.04) 0%, transparent 60%)"
                }} />
            </div>
            

            <div className="relative z-10 max-w-2xl mx-auto px-6 py-20">
                <p className="text-xs tracking-widest text-white/30 uppercase mb-3">Dela kostnader</p>
                <h1 className="text-5xl font-bold tracking-tight mb-16">Splitwise</h1>

                <div className="flex flex-col gap-2 mb-12">
                    {groups.map(group => (
                        <div
                            key={group.id}
                            onClick={() => navigate(`/groups/${group.id}`)}
                            className="border border-white/[0.08] rounded-2xl px-6 py-5 cursor-pointer bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.15] transition-all flex justify-between items-center"
                        >
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-[15px]">{group.name}</p>
                                <p className="text-[13px] text-white/40 mt-1">{group.members.length} medlemmar</p>
                            </div>
                            <span className="text-white/20 text-lg">→</span>
                        </div>
                    ))}
                </div>
                <button
                    onClick={() => navigate("/users")}
                    className="text-white/50 text-sm px-5 py-2.5 rounded-xl border border-white/10 hover:border-white/20 hover:text-white/60 transition"
                >
                    Hantera medlemmar
                </button>

                {showForm ? (
                    <div className="border border-white/10 rounded-2xl p-7 bg-white/[0.02]">
                        <p className="font-semibold text-base mb-4">Ny grupp</p>
                        <input
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Gruppnamn"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none mb-5"
                        />
                        <p className="text-[11px] uppercase tracking-widest text-white/35 mb-3">Välj medlemmar</p>
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
                                Skapa
                            </button>
                            <button
                                onClick={() => setShowForm(false)}
                                className="text-white/40 text-sm px-5 py-2.5 rounded-xl border border-white/10 hover:border-white/20 transition"
                            >
                                Avbryt
                            </button>
                        </div>
                    </div>
                ) : (
                    
                    <button
                        onClick={() => setShowForm(true)}
                        className="text-white/50 text-sm px-5 py-2.5 rounded-xl border border-white/10 hover:border-white/20 hover:text-white/60 transition"
                    >
                        + Ny grupp
                    </button>
                )}
            </div>
        </div>
    )
}