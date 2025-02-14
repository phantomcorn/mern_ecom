import { useSendLogoutMutation } from "../features/auth/authApiSlice.js"
import { useGetUserInfoQuery } from "../features/user/userApiSlice.js"
import { useNavigate } from "react-router-dom"
export default function Dashboard() {

    const navigate = useNavigate()

    const { data, isLoading, isError } = useGetUserInfoQuery(undefined, {
        pollingInterval: 5 * 60 * 1000, //Retrieve information every 5 minutes
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })

    const [sendLogout, logoutMutationProps] = useSendLogoutMutation()

    async function handleLogout(e) {
        e.preventDefault()
        try {
            sendLogout().unwrap
            navigate("/")
        } catch (err) {
            console.log(err)
        }
    }


    if (isError) return <div> Error </div>
    if (isLoading) return <div> Loading... </div>

    return (
        <div className="dashboard">
            <div> Dashboard </div>
            {data &&
                <div> 
                    User: {data.email} <br/>
                    Email Verified : {data.didVerify?.toString()}
                </div>
            }
            <button onClick={handleLogout}> Sign out </button>
        </div>
        
    )
}