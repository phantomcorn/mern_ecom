import { useRef, useState } from "react"

import { useDispatch } from "react-redux"
import { setCredentials } from "../../features/auth/authSlice"
import { useNavigate } from "react-router-dom"
import { useAdminLoginMutation, useAdminVerifyMutation} from "../../features/admin/auth/authApiSlice"
export default function AdminLogin() {
    
    /* TODO: clear stale data */
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const infoRef = {
        user: useRef(),
        pass: useRef(),
        otp: useRef()
    }

    const [login, loginProps] = useAdminLoginMutation()
    const [verify, verifyProps] = useAdminVerifyMutation()
    const [errMsg, setErrMsg] = useState(null)
    const handleChange = (e) => infoRef[e.target.name].current = e.target.value
    async function handleClickSend(e) {
        e.preventDefault()
        try {
            const resp = await login({user: infoRef.user.current, pass: infoRef.pass.current}).unwrap()
            if (errMsg) setErrMsg(null)
        } catch (err) {
            setErrMsg(err.data.message)
        }
    }

    async function handleClickVerify(e) {
        e.preventDefault()
        try {
            const resp = await verify({user: infoRef.user.current, otp: infoRef.otp.current}).unwrap()
            dispatch(setCredentials({token : resp.token}))
            navigate("/admin/dashboard")
        } catch (err) {
            if (err.status === 401) setErrMsg("Incorrect code")
            else if (err.status === 403) setErrMsg("Session expired, please refresh this page and try again.")
            else if (err.status === 400) setErrMsg(`Please enter a 6 digit number sent to ${infoRef.user.current}`)
            else setErrMsg(err.data.message)
        }
    }

    let content = <div>
                    <div>Username:</div>
                    <input type="user" name="user" onChange={handleChange}/>
                    <div>Password:</div>
                    <input type="password" name="pass" onChange={handleChange}/>
                    <button onClick={handleClickSend}> Login </button>
                    <div>{errMsg? errMsg : ""}</div>
                </div>


    if (loginProps.isSuccess) {
        
        content = 
            <div>
                <div> An OTP has been sent to the admin email</div>
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