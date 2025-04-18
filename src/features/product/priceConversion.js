const POUND_TO_PENNY = 100
const STANG_TO_BAHT = 100
const unitToPound = (unitAmt) => unitAmt / POUND_TO_PENNY
const unitToBaht = (unitAmt) => unitAmt / STANG_TO_BAHT

export default function getPrice(currency, unitAmt) {
    switch (currency) {
        case "gbp": return "£" + unitToPound(unitAmt)
        case "thb": return "฿" + unitToBaht(unitAmt)
    }
}