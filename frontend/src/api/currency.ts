export const getUSDRate = async (): Promise<number> => {
    const res = await fetch("https://api.frankfurter.app/latest?from=SEK&to=USD")
    const data = await res.json()
    console.log("rate:", data.rates.USD)
    return data.rates.USD
}