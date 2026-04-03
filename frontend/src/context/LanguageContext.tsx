import { createContext, useContext, useState } from "react"
import { translations } from "../i18n"
import type { Lang, T } from "../i18n"

interface LanguageContextType {
    t: T
    lang: Lang
    setLang: (lang: Lang) => void
}

const LanguageContext = createContext<LanguageContextType>({} as LanguageContextType)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [lang, setLangState] = useState<Lang>(
        () => (localStorage.getItem("lang") as Lang) || "en"
    )

    const setLang = (newLang: Lang) => {
        localStorage.setItem("lang", newLang)
        setLangState(newLang)
    }

    const t = translations[lang]
    return (
        <LanguageContext.Provider value={{ t, lang, setLang }}>
            {children}
        </LanguageContext.Provider>
    )
}

export const useLang = () => useContext(LanguageContext)