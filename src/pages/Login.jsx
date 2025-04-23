import { useRef, useState } from "react"
import { useLoginMutation, useVerifyMutation } from "../features/auth/authApiSlice"
import { useDispatch } from "react-redux"
import { setCredentials } from "../features/auth/authSlice"
import { useNavigate } from "react-router-dom"
export default function Login() {
    
    /* TODO: clear stale data */
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const infoRef = {
        email: useRef(),
        otp: useRef()
    }

    const [login, loginProps] = useLoginMutation()
    const [verify, verifyProps] = useVerifyMutation()
    const [errMsg, setErrMsg] = useState(null)
    const handleChange = (e) => infoRef[e.target.name].current = e.target.value
    async function handleClickSend(e) {
        e.preventDefault()
        try {
            const resp = await login({email: infoRef.email.current}).unwrap()
            if (errMsg) setErrMsg(null)
        } catch (err) {
            setErrMsg(err.data.message)
        }
    }

    async function handleClickVerify(e) {
        e.preventDefault()
        try {
            const resp = await verify({email: infoRef.email.current, otp: infoRef.otp.current}).unwrap()
            dispatch(setCredentials({token : resp.token}))
            navigate("/dashboard")
        } catch (err) {
            if (err.status === 401) setErrMsg("Incorrect code")
            else if (err.status === 403) setErrMsg("Session expired, please refresh this page and try again.")
            else if (err.status === 400) setErrMsg(`Please enter a 6 digit number sent to ${infoRef.email.current}`)
            else setErrMsg(err.data.message)
        }
    }

    let content = <div>
                    <div>Enter your email address:</div>
                    <input type="email" name="email" onChange={handleChange}/>
                    <button onClick={handleClickSend}> Send OTP </button>
                    <div>{errMsg? errMsg : ""}</div>
                </div>


    if (loginProps.isSuccess) {
        

        content = 
            <div>
                <div> An OTP has been sent to {infoRef.email.current}</div>
                {/* {Array(6).map((_,i) => {
                    <input type="number" name="otp" maxLength={1} onChange={handleChange} onInput={handleOnInput}/>
                })} */}
                <input type="number" maxLength={6} name="otp" onChange={handleChange}/>
                <button onClick={handleClickVerify}> Verify OTP </button>
                <div> {errMsg ? errMsg : ""} </div>
            </div>
    }  else if (verifyProps.isError) {
        content = <div> Error verifying OTP </div>
    } else if (verifyProps.isSuccess) {
        content = <div> Navigating to dashboard...</div>
    }

    return content
}