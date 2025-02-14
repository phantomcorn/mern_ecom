import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { setCredentials } from '../features/auth/authSlice.js';
import { useLoginMutation, useRegisterMutation } from "../features/auth/authApiSlice.js"


export default function Main() {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const userRef = useRef("")
    const passRef = useRef("")

    const [msg, setMsg] = useState("")
    const [login, {isLoading}] = useLoginMutation()
    const [register, registerMutationProps] = useRegisterMutation()

    //Login
    async function handleLogin(e) {
        e.preventDefault()
        try {
            const resp = await login({email: userRef.current, password: passRef.current}).unwrap()
            if (resp.didVerify) { //user has verified their account, proceed as normal
                dispatch(setCredentials({token : resp.token}))
                navigate("/dashboard")
            } else {
                setMsg(resp.message)
            } 
        } catch (err) {
            if (!err.status) {
                setMsg("No server response")
            } else if (err.status == 400) {
                setMsg("Missing username or password")
            } else if (err.status == 401) {
                setMsg("Incorrect password")
            } else if (err.status === 404) {
                setMsg("No account found")
            } else {
                setMsg(err.data?.message)
            }
        } 
    }

    //Register
    async function handleRegister(e) {
        e.preventDefault()
        try {
            const resp = await register({email: userRef.current, password: passRef.current}).unwrap()
            setMsg(resp.message)
        } catch (err) {
            if (!err.status) {
                setMsg("No server response")
            } else if (err.status == 400) {
                setMsg("Missing username or password field")
            } else if (err.status == 409) {
                setMsg("The email you have provided has already taken. Please use a different email.")
            } else {
                setMsg(err.data?.message)
            }
        } 
    }

    return (
        <div className="App">
            <div className="email">
                <div> Email </div>
                <input onChange={(e) => {userRef.current = e.target.value}}/>
            </div>
            <div className="password">
                <div> Password</div>
                <input type="password" onChange={(e) => {passRef.current = e.target.value}}/>
            </div>
            <button onClick={handleLogin} >Log In</button>
            <button onClick={handleRegister} >Register</button>
            {msg && 
                <div>STATUS: {msg}</div>
            }
        </div>
    )
}