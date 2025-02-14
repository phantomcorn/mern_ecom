import { createContext, useContext, useState } from "react";

const AuthContext = createContext()

// Public getter for child component under AuthProvider component
export function useAuthContext() {
    return useContext(AuthContext)
}

//Any children component under this parent has access to AuthContext
export function AuthProvider({children}) {

    //access token
    const [token, setToken] = useState("")

    const value = {token, setToken}

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

