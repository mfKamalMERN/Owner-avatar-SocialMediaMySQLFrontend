import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"

export const ViewLikes = () => {
    const nav = useNavigate()
    const { postid } = useParams()
    const [usernames, setUsernames] = useState([])
    const [msg, setMsg] = useState("")

    axios.defaults.withCredentials = true

    const tokenChecker = async () => {

        try {
            const res = await axios.get(`http://localhost:8700/getposts`)

            if (!res.data.Token) {
                localStorage.clear()
                nav('/')
            }

            else {

                const response = await axios.get(`http://localhost:8700/viewlikes/${postid}`)

                if (typeof (response.data) != "string") setUsernames(response.data.map((v) => v.name))

                else {
                    setMsg(response.data)
                    toast(response.data)
                }

            }

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        tokenChecker()
    }, [])

    return (
        <>
            {
                !usernames.length > 0 ?
                    <>
                        <h2>{msg}</h2>
                    </>
                    :
                    usernames.map((un) => (
                        <p>{un}</p>
                    ))
            }
        </>
    )
}