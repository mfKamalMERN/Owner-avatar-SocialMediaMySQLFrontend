import axios from "axios"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

export const Home = () => {
    const [posts, setPosts] = useState([])
    const nav = useNavigate()
    const [pid, setPid] = useState(null)
    const [cid, setCid] = useState(null)
    const [showcomments, setShowcomments] = useState(false)
    const [status, setStatus] = useState(false)
    const [cmnt, setCmnt] = useState([])
    const [newcomment, setNewcomment] = useState("")
    const [updatedcomment, setUpdatedcomment] = useState("")
    const refelem = useRef("")
    const [editstatus, setEditstatus] = useState(false)

    axios.defaults.withCredentials = true

    const tokenCHecker = () => {
        axios.get(`http://localhost:8700/getposts`)
            .then(res => {
                if (!res.data.Token) {
                    localStorage.clear()
                    nav('/')
                }

                else {
                    setPosts(res.data.Posts)
                    console.log(res.data.Posts);
                }

            })
            .catch(er => console.log(er))
    }

    useEffect(() => {
        tokenCHecker()
    }, [cmnt, posts, showcomments, editstatus, status])



    const Logout = async () => {
        try {
            const res = await axios.get(`http://localhost:8700/logout`)
            toast(res.data)
            nav('/')

        } catch (error) {
            console.log(error);
        }
    }

    const ViewComments = async (postId, statuss) => {

        try {

            const res = await axios.get(`http://localhost:8700/viewcomments/${postId}`)

            if (res.data.length > 0) {

                setPid(postId)
                setShowcomments(statuss)
                setStatus(!status)
                setCmnt(res.data)

                console.log(res.data);
            }

            else {

                toast("No comments yet")
                setPid(null)
                setShowcomments(false)
                setCmnt([])

                console.log(res.data);

            }

        } catch (error) {
            console.log(error);
        }

    }

    const DeletePost = (pid) => {
        if (window.confirm("Delete this post?")) {
            axios.delete(`http://localhost:8700/removepost/${pid}`)
                .then(res => toast(res.data))
                .catch()
        }
    }

    const addComment = async (pid) => {
        if (newcomment.trim() === "") toast("Please type your comment")
        else {
            try {
                const res = await axios.post(`http://localhost:8700/addcomment/${pid}`, { newcomment })

                ViewComments(pid, true)

                toast(res.data.Msg)

                setNewcomment("")

            } catch (error) {
                console.log(error);
            }
        }
    }

    const RemoveComment = (values) => {

        const commentid = values[0]
        const pid = values[1]

        if (window.confirm(`Remove this comment?`)) {
            axios.delete(`http://localhost:8700/deletecomment/${commentid}`)
                .then(res => {
                    toast(res.data)
                    ViewComments(pid, true)

                })
                .catch(er => console.log(er))
        }
    }

    const EditComment = async (values) => {
        const commentid = values[0]
        const commenttoupdate = values[1]
        setEditstatus(!editstatus)
        setCid(commentid)
        setUpdatedcomment(commenttoupdate)
    }

    const UpdateComment = (values) => {
        const commentid = values[0]
        const postId = values[1]

        if (updatedcomment.trim() === "") toast(`Invalid Comment`)

        else {
            axios.put(`http://localhost:8700/editcomment/${commentid}`, { updatedcomment })
                .then(res => {
                    toast(res.data)
                    setEditstatus(!editstatus)
                    setUpdatedcomment("")
                    ViewComments(postId, true)

                })
                .catch(er => console.log(er))
        }

    }

    return (
        <div className="all" style={{ minHeight: "200%", height: "auto", backgroundColor: "black" }}>

            <button onClick={Logout}>Log Out</button>

            <br />
            <br />

            <div className="display" style={{ display: "flex", flexDirection: "column", justifyContent: "space-evenly", alignItems: "center" }}>

                {
                    posts.map((post) => (

                        <div className="card" style={{ marginBottom: "20%", color: "wheat", border: "1px solid wheat", minWidth: "40%", height: "75%", display: "flex", flexDirection: "column", alignItems: "center", backgroundColor: 'darkred', borderRadius: "30px", width: "auto" }}>

                            <h3>{post.desc}</h3>

                            <div className="ownerdetails" style={{ display: "flex", width: "12vw", alignItems: "center", justifyContent: "space-evenly" }}>
                                <h5>Created By: </h5>

                                <div className="c" style={{ display: "flex" }}>
                                    <img src={post.ProfilePic} alt="" style={{ width: "20%", marginLeft: "35%", marginRight: "8%" }} />
                                    {post.ownername}
                                </div>

                            </div>

                            <img src={post.img} alt="" style={{ width: "90%", height: "50vh" }} />

                            <br />

                            {
                                post.owner === JSON.parse(localStorage.getItem('Id')) ?

                                    <div className="actions" style={{ display: "flex", justifyContent: "space-evenly", width: "35%" }}>

                                        <button onClick={() => nav(`/editpost/${post.id}`)} style={{ background: "darkgreen" }}> ✏️</button>

                                        <button onClick={() => DeletePost(post.id)} style={{ background: "red", color: "white", borderRadius: "20px" }}> Delete Post</button>

                                    </div>
                                    :
                                    <></>
                            }


                            <div className="btns" style={{ marginBottom: "5%", marginTop: "5%", display: "flex", justifyContent: "space-between", width: "50%" }}>

                                <button style={{ background: "darkgreen", color: "wheat", borderRadius: "20px" }} ref={refelem} onClick={() => ViewComments(post.id, !status)}>View Comments</button>

                                <button style={{ background: "darkgreen", color: "wheat", borderRadius: "20px" }}>View Likes</button>

                            </div>

                            <br />
                            <br />

                            <div className="comments" style={{ display: "flex", justifyContent: "space-between", backgroundColor: "brown", width: "100%", flexDirection: "column" }}>


                                {post.id === pid && showcomments ?

                                    cmnt.map((comt) => (
                                        <div className="sinflecomment" style={{ display: "flex", justifyContent: "space-between", marginBottom: "10%", border: "1px solid wheat", backgroundColor: "darkred" }}>

                                            {
                                                editstatus && comt.CommentId == cid ?
                                                    <div className="inputs" style={{ display: "flex" }}>

                                                        <img src={comt.ProfilePic} alt="" style={{ width: "10%", height: "70%", borderRadius: "60%" }} />

                                                        <input type="text" name="" id="" value={updatedcomment} onChange={e => setUpdatedcomment(e.target.value)} style={{ height: "50%", color: "wheat", background: "darkred" }} />

                                                        <button onClick={() => UpdateComment([comt.CommentId, post.id, comt.comment])} style={{ height: "65%", backgroundColor: "darkgreen", color: "wheat" }}>Update</button>


                                                    </div>
                                                    :
                                                    <>
                                                        <div className="imgamnt" style={{ display: "flex" }}>

                                                            <img src={comt.ProfilePic} alt="" style={{ width: "12%", height: "75%", borderRadius: "60%" }} />
                                                            {comt.comment}
                                                        </div>

                                                        {
                                                            comt.commentby == localStorage.getItem('Id') ?
                                                                <div className="actionbtns" style={{ marginLeft: "40%", height: "100%" }}>

                                                                    <button onClick={() => RemoveComment([comt.CommentId, post.id])} style={{ height: "60%", background: "red", color: "wheat" }}>Delete</button>

                                                                    <button onClick={() => EditComment([comt.CommentId, comt.comment])} style={{ background: "darkgreen", height: "60%" }}>✏️</button>

                                                                </div>

                                                                :
                                                                <></>

                                                        }
                                                        {/* <hr style={{ color: "brown" }} /> */}
                                                    </>
                                            }

                                        </div>

                                    ))
                                    :
                                    <></>
                                }

                            </div>

                            <div className="commentadder" style={{ display: "flex", width: "100%", justifyContent: "center" }}>

                                <input type="text" placeholder="Comment..." value={newcomment} onChange={(e) => setNewcomment(e.target.value)} style={{ width: "84%", backgroundColor: "darkgreen", color: "wheat", textAlign: "center", borderRadius: "55px" }} />

                                <button onClick={() => addComment(post.id)}>➕</button>

                            </div>

                        </div>
                    ))
                }

            </div>

        </div >
    )
}