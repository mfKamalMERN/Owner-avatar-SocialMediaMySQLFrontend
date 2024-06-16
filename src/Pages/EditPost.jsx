import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"

export const EditPost = () => {
    const { postid } = useParams()
    const nav = useNavigate()
    const [postdescription, setPostdescription] = useState("")
    const [file, setFile] = useState(null)

    axios.defaults.withCredentials = true
    const tokenChecker = () => {
        axios.get(`http://localhost:8700/getposts`)
            .then(async res => {
                if (!res.data.Token) {
                    localStorage.clear()
                    nav('/')
                }
                else {
                    try {
                        const response = await axios.get(`http://localhost:8700/editpostdata/${postid}`)

                        setPostdescription(response.data.TargetPost.desc)

                    } catch (error) {
                        console.log(error);
                    }
                }
            })
            .catch(er => console.log(er))
    }

    useEffect(() => {
        tokenChecker()
    }, [])

    const UpdatePost = async e => {
        e.preventDefault()

        if (file === null) toast("No file selected")

        else {
            const formdata = new FormData()

            formdata.append('file', file)
            formdata.append('postdescription', postdescription)

            try {
                const res = await axios.put(`http://localhost:8700/editpost/${postid}`, formdata)
                toast(res.data)
                nav('/home')
            } catch (error) {
                console.log(error);
            }

        }
    }

    return (
        <>
            <form action="" onSubmit={UpdatePost}>

                <label htmlFor="desc">Post Description</label>
                <br />
                <input id="desc" type="text" value={postdescription} onChange={e => setPostdescription(e.target.value)} />
                <br />
                <br />
                <input type="file" onChange={e => setFile(e.target.files[0])} />
                <br />
                <br />
                <button type="submit">Update Post</button>

            </form>
        </>
    )
}