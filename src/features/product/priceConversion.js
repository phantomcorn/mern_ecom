const POUND_TO_PENNY = 100
const unitToPound = (unitAmt) => {
    return unitAmt / POUND_TO_PENNY
}

export default function getPrice(currency, unitAmt) {
    switch (currency) {
        case "gbp": return "£" + unitToPound(unitAmt)
    }
}