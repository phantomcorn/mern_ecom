import { useEffect, useState } from "react"

//Component which holds our persist flag (true/false)
const usePersist = () => {
    //Whenever setPersist is called, we trigger useEffect and update our local storage
    //The next time we reload/refresh, we grab persist flag from our local storage 
    const [persist, setPersist] = useState(JSON.parse(localStorage.getItem("persist")) || false)

    useEffect(() => {
        localStorage.setItem("persist", JSON.stringify(persist))
    }, [persist])

    return [persist, setPersist]
}

export default usePersist