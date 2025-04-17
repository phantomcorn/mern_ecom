import { useRef } from "react"
import { useLoginMutation, useVerifyMutation } from "../features/auth/authApiSlice"
import { useDispatch } from "react-redux"
import { setCredentials } from "../features/auth/authSlice"
import { useNavigate } from "react-router-dom"
export default function Login() {
    
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const infoRef = {
        email: useRef(),
        otp: useRef()
    }

    const [login, loginProps] = useLoginMutation()
    const [verify, verifyProps] = useVerifyMutation()
    
    const handleChange = (e) => infoRef[e.target.name].current = e.target.value
    async function handleClickSend(e) {
        e.preventDefault()
        try {
            const resp = await login({email: infoRef.email.current}).unwrap()

        } catch (err) {
            console.log(err)
        }
    }

    async function handleClickVerify(e) {
        e.preventDefault()
        try {
            const resp = await verify({email: infoRef.email.current, otp: infoRef.otp.current}).unwrap()
            dispatch(setCredentials({token : resp.token}))
            navigate("/dashboard")
        } catch (err) {
            console.log(err)
        }
    }

    if (loginProps.isUninitialized) {
        return(
            <div>
                <div>Enter your email address:</div>
                <input type="email" name="email" onChange={handleChange}/>
                <button onClick={handleClickSend}> Send OTP </button>
            </div>
        )
    } else {

        if (verifyProps.isUninitialized) {
            return (
                <div>
                    <div> An OTP has been sent to {infoRef.email.current}</div>
                    {/* {Array(6).map((_,i) => {
                        <input type="number" name="otp" maxLength={1} onChange={handleChange} onInput={handleOnInput}/>
                    })} */}
                    <input type="number" maxLength={6} name="otp" onChange={handleChange}/>
                    <button onClick={handleClickVerify}> Verify OTP </button>
                </div>
            )
        }  else if (verifyProps.isError) {
            return (
                <div> Error verifying OTP </div>
            )
        } else if (verifyProps.isSuccess) {
            return (
                <div> Navigating to dashboard...</div>
            )
        }
        
    }
    

}