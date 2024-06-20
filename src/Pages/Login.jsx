import { useEffect, useState } from "react"
import axios from 'axios'
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

const Login = () => {
    const [email, setEmail] = useState("")
    const [pwd, setPwd] = useState("")
    const nav = useNavigate()

    axios.defaults.withCredentials = true

    const tokenCHecker = () => {
        axios.get(`http://localhost:8700/getposts`)
            .then(res => {
                if (!res.data.Token) {
                    localStorage.clear()
                    nav('/')
                }

                else nav('/home')
            })
            .catch(er => console.log(er))
    }

    useEffect(() => {
        tokenCHecker()
    }, [])

    const handleLogin = (e) => {
        e.preventDefault()

        if (email.trim() === "" || pwd.trim() === "") toast("Missing fields")

        else {
            axios.post(`http://localhost:8700/login`, { email, pwd })
                .then(res => {

                    if (res.data.LoggedIn) {
                        localStorage.setItem('LoggedInUser', JSON.stringify(res.data.LoggedUser))

                        localStorage.setItem('Id', res.data.LoggedUser[0].id)

                        nav('/home')
                    }

                    else {

                        if (res.data === "Incorrect Password") toast(res.data)
                        else toast(res.data)
                    }


                })
                .catch(er => console.log(er))
        }
    }

    return (
        <>
            <form action="" onSubmit={handleLogin}>
                <label htmlFor="email">Email</label>
                <br />
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />

                <br />
                <br />

                <label htmlFor="pwd">Password</label>
                <br />
                <input type="password" id="pwd" value={pwd} onChange={(e) => setPwd(e.target.value)} />

                <br />
                <br />

                <button type="submit">Login</button>
            </form>
        </>
    )
}

export { Login }