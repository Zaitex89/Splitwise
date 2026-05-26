import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getUsers, createUser, deleteUser } from "../api/users"
import type { User } from "../types/index"
import { useLang } from "../context/LanguageContext"

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([])
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const navigate = useNavigate()
    const { t } = useLang()

    useEffect(() => {
        getUsers().then(setUsers)
    }, [])

    const handleCreate = async () => {
        if (!name || !email) return
        const user = await createUser({ name, email })
        setUsers([...users, user])
        setName("")
        setEmail("")
    }

    const handleDelete = async (id: number) => {
        await deleteUser(id)
        setUsers(users.filter(u => u.id !== id))
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white relative overflow-hidden">

<div className="relative z-10 max-w-2xl mx-auto px-6 py-20">
                <button
                    onClick={() => navigate("/")}
                    className="text-white/30 text-sm hover:text-white/60 transition mb-10 block"
                >
                    {t.back}
                </button>

                <h1 className="text-5xl font-bold tracking-tight mb-16">{t.members_page}</h1>

                <div className="flex flex-col gap-2 mb-12">
                    {users.map(user => (
                        <div key={user.id} className="border border-white/[0.08] rounded-2xl px-6 py-4 bg-white/[0.02] flex justify-between items-center">
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-[15px]">{user.name}</p>
                                <p className="text-[13px] text-white/35 mt-1">{user.email}</p>
                            </div>
                            <button
                                onClick={() => handleDelete(user.id)}
                                className="text-white/20 hover:text-red-400 text-sm transition ml-4"
                            >
                                {t.remove}
                            </button>
                        </div>
                    ))}
                </div>

                <div className="border border-white/10 rounded-2xl p-7 bg-white/[0.02]">
                    <p className="font-semibold text-base mb-4">{t.newMember}</p>
                    <input
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Namn"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none mb-3"
                    />
                    <input
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Email"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none mb-5"
                    />
                    <button
                        onClick={handleCreate}
                        className="bg-white text-black font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-white/90 transition"
                    >
                        {t.create}
                    </button>
                </div>
            </div>
        </div>
    )
}