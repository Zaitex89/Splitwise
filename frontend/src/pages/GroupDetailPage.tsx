import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getGroupExpenses, createExpense } from "../api/expenses"
import { getGroupBalances } from "../api/balances"
import type { Group, Expense, Balance } from "../types/index"
import { getGroup, deleteGroup } from "../api/groups"
import { useLang } from "../context/LanguageContext"
import { getUSDRate } from "../api/currency"

const calculateTransactions = (balances: Balance[]) => {
    const debtors = balances.filter(b => b.amount < 0).map(b => ({ ...b }))
    const creditors = balances.filter(b => b.amount > 0).map(b => ({ ...b }))
    const transactions: { from: string; to: string; sum: number }[] = []

    for (const debtor of debtors) {
        for (const creditor of creditors) {
            if (debtor.amount === 0 || creditor.amount === 0) continue
            const amount = Math.min(Math.abs(debtor.amount), creditor.amount)
            transactions.push({ from: debtor.name, to: creditor.name, sum: Math.round(amount) })
            debtor.amount += amount
            creditor.amount -= amount
        }
    }
    return transactions
}

export default function GroupDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const groupId = Number(id)
    const { t, lang } = useLang()
    const [rate, setRate] = useState<number>(1)
    const [group, setGroup] = useState<Group | null>(null)
    const [expenses, setExpenses] = useState<Expense[]>([])
    const [balances, setBalances] = useState<Balance[]>([])
    const [showForm, setShowForm] = useState(false)
    const [title, setTitle] = useState("")
    const [expenseAmount, setExpenseAmount] = useState("")
    const [paidBy, setPaidBy] = useState<number | null>(null)
    const [selectedIds, setSelectedIds] = useState<number[]>([])
    const [inputCurrency, setInputCurrency] = useState<"kr" | "$">("kr")

    useEffect(() => {
        if (lang === "en") {
            getUSDRate()
                .then(r => setRate(r))
                .catch(err => console.log("fetch error:", err))
        } else {
            getUSDRate().then(() => setRate(1))
        }
    }, [lang])

    useEffect(() => {
        getGroup(groupId).then(setGroup)
        getGroupExpenses(groupId).then(setExpenses)
        getGroupBalances(groupId).then(setBalances)
    }, [groupId])

    const formatAmount = (amount: number) => {
        return lang === "en"
            ? `$${(amount * rate).toFixed(2)}`
            : `${parseFloat(amount.toFixed(2))} kr`
    }

    const getAmountInKr = () => {
        const val = parseFloat(expenseAmount)
        return inputCurrency === "$" ? val / rate : val
    }

    const handleDelete = async () => {
        await deleteGroup(groupId)
        navigate("/")
    }

    const toggleUser = (uid: number) => {
        setSelectedIds(prev =>
            prev.includes(uid) ? prev.filter(i => i !== uid) : [...prev, uid]
        )
    }

    const handleCreate = async () => {
        if (!title || !expenseAmount || !paidBy || selectedIds.length === 0) return
        const expense = await createExpense({
            title,
            amount: getAmountInKr(),
            group_id: groupId,
            paid_by: paidBy,
            split_between: selectedIds
        })
        setExpenses([...expenses, expense])
        const newBalances = await getGroupBalances(groupId)
        setBalances(newBalances)
        setShowForm(false)
        setTitle("")
        setExpenseAmount("")
        setPaidBy(null)
        setSelectedIds([])
    }

    const transactions = calculateTransactions(balances)

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white relative overflow-hidden">
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div style={{
                    position: "absolute", top: "-20%", left: "-10%",
                    width: "500px", height: "500px", borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(120,60,255,0.25) 0%, transparent 70%)",
                    filter: "blur(60px)"
                }} />
                <div style={{
                    position: "absolute", bottom: "-20%", right: "-10%",
                    width: "500px", height: "500px", borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(30,100,255,0.2) 0%, transparent 70%)",
                    filter: "blur(60px)"
                }} />
                <div style={{
                    position: "absolute", inset: 0,
                    background: "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.04) 0%, transparent 60%)"
                }} />
            </div>

            <div className="relative z-10 max-w-2xl mx-auto px-6 py-20">
                <div className="flex justify-between items-center mb-10">
                    <button
                        onClick={() => navigate("/")}
                        className="text-white/40 text-sm hover:text-white/60 transition"
                    >
                        {t.back}
                    </button>
                    <button
                        onClick={handleDelete}
                        className="text-white/40 hover:text-red-400 text-sm transition"
                    >
                        {t.remove}
                    </button>
                </div>

                <h1 className="text-5xl font-bold tracking-tight mb-16">{group?.name}</h1>

                <p className="text-[11px] uppercase tracking-widest text-white/50 mb-3">{t.toPay}</p>
                <div className="flex flex-col gap-2 mb-12">
                    {transactions.length === 0 ? (
                        <p className="text-white/45 text-sm">{t.zero}</p>
                    ) : transactions.map((tr, i) => (
                        <div key={i} className="border border-white/[0.08] rounded-2xl px-6 py-4 bg-white/[0.02] text-sm">
                            <span className="text-red-400 font-medium">{tr.from}</span>
                            <span className="text-white/30"> {t.toPayText} </span>
                            <span className="text-emerald-400 font-medium">{tr.to}</span>
                            <span className="text-white/50"> {formatAmount(tr.sum)}</span>
                        </div>
                    ))}
                </div>

                <p className="text-[11px] uppercase tracking-widest text-white/50 mb-3">{t.expenses}</p>
                <div className="flex flex-col gap-2 mb-12">
                    {expenses.map(e => (
                        <div key={e.id} className="border border-white/[0.08] rounded-2xl px-6 py-4 bg-white/[0.02] flex justify-between items-center">
                            <p className="text-[15px] font-medium">{e.title}</p>
                            <p className="text-white/40 text-sm">{formatAmount(e.amount)}</p>
                        </div>
                    ))}
                </div>

                {showForm ? (
                    <div className="border border-white/10 rounded-2xl p-7 bg-white/[0.02]">
                        <p className="font-semibold text-base mb-4">{t.newExpense}</p>
                        <input
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder={t.title}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none mb-3"
                        />
                        <div className="flex gap-2 mb-5">
                            <input
                                value={expenseAmount}
                                onChange={e => setExpenseAmount(e.target.value)}
                                placeholder={t.amount}
                                type="number"
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none"
                            />
                            <button
                                onClick={() => setInputCurrency(prev => prev === "kr" ? "$" : "kr")}
                                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white/50 hover:text-white/80 hover:border-white/20 transition min-w-[60px]"
                            >
                                {inputCurrency}
                            </button>
                        </div>
                        <p className="text-[11px] uppercase tracking-widest text-white/35 mb-3">{t.whoPaid}</p>
                        <div className="flex flex-wrap gap-2 mb-5">
                            {group?.members.map(user => (
                                <button
                                    key={user.id}
                                    onClick={() => setPaidBy(user.id)}
                                    className={`px-4 py-1.5 rounded-full text-[13px] border transition-all ${
                                        paidBy === user.id
                                            ? "bg-white text-black border-white"
                                            : "bg-transparent text-white/50 border-white/15 hover:border-white/30"
                                    }`}
                                >
                                    {user.name}
                                </button>
                            ))}
                        </div>
                        <p className="text-[11px] uppercase tracking-widest text-white/35 mb-3">{t.splitBetween}</p>
                        <div className="flex flex-wrap gap-2 mb-6">
                            {group?.members.map(user => (
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
                                {t.addExpense}
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
                        className="text-white/40 text-sm px-5 py-2.5 rounded-xl border border-white/10 hover:border-white/20 hover:text-white/60 transition"
                    >
                        {t.newExpense}
                    </button>
                )}
            </div>
        </div>
    )
}