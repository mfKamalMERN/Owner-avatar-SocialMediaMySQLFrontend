import axios from "axios"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { Navbarr } from "../Components/Navbarr"

export const Home = () => {
    const [posts, setPosts] = useState([])
    const [likes, setLikes] = useState([])
    const [likesstatus, setLikesstatus] = useState(false)
    const [targetpostlikes, setTargetpostlikes] = useState([])
    const nav = useNavigate()
    const [pid, setPid] = useState(null)
    const [likedpostid, setLikedpostid] = useState(null)
    const [cid, setCid] = useState(null)
    const [showcomments, setShowcomments] = useState(false)
    const [status, setStatus] = useState(false)
    const [cmnt, setCmnt] = useState([])
    const [newcomment, setNewcomment] = useState("")
    const [updatedcomment, setUpdatedcomment] = useState("")
    const refelem = useRef("")
    const [editstatus, setEditstatus] = useState(false)
    const [vstatus, setVstatus] = useState(false)
    const [luser, setLuser] = useState(null)
    const [fbody, setFbody] = useState("Follow")
    const [followings, setFollowings] = useState([])
    const [followers, setFollowers] = useState([])
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
                    setLikes(res.data.Likes)
                    setLuser(localStorage.getItem("Id"))
                    axios.get(`http://localhost:8700/myprofile`)
                        .then(res => {
                            setFollowings(res.data.Followings)
                            setFollowers(res.data.Followers)
                        })
                        .catch(er => console.log(er))
                    console.log(res.data.Posts);
                    // localStorage.setItem('fs', `Follow`)
                }

            })
            .catch(er => console.log(er))
    }

    useEffect(() => {
        tokenCHecker()
    }, [cmnt, posts, showcomments, editstatus, status, likes, targetpostlikes])

    


    const ViewComments = async (postId, statuss) => {

        try {

            const res = await axios.get(`http://localhost:8700/viewcomments/${postId}`)

            if (res.data.length > 0) {

                setPid(postId)
                setShowcomments(statuss)
                setStatus(!status)
                setCmnt(res.data)
                setLikesstatus(false)

                console.log(res.data);
            }

            else {

                setLikesstatus(false)
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

    const likePost = (postid) => {
        axios.post(`http://localhost:8700/likepost/${postid}`)
            .then(res => {
                toast(res.data.Msg)
                ViewLikes(postid, true)
            })
            .catch(er => console.log(er))
    }


    const ViewLikes = async (postid, vstatuss) => {
        try {
            const res = await axios.get(`http://localhost:8700/viewlikes/${postid}`)

            if (typeof (res.data) != "string") {
                setLikedpostid(postid)
                setVstatus(!vstatuss)
                setLikesstatus(!vstatuss)
                setTargetpostlikes(res.data)
                setShowcomments(false)
            }

            else {
                setVstatus(!vstatuss)
                setLikesstatus(false)
                setTargetpostlikes([])
                setShowcomments(false)
                setLikedpostid(null)
                toast(res.data)
            }

        } catch (error) {
            console.log(error);
        }
    }


    const FollowUnfollow = async (userid) => {
        try {
            const res = await axios.post(`http://localhost:8700/followunfollowuser/${userid}`)
            toast(res.data.Msg)
            setFbody(res.data.Status)
            localStorage.setItem('fs', res.data.Status)

        } catch (error) {
            console.log(error);
        }
    }

    return (

        <div className="all" style={{ minHeight: "200%", height: "auto", backgroundColor: "black" }}>

            <Navbarr />

            <br />
            <br />

            <div className="display" style={{ display: "flex", flexDirection: "column", justifyContent: "space-evenly", alignItems: "center", marginTop:"8%" }}>

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

                                <button style={{ background: "darkgreen", color: "wheat", borderRadius: "20px", fontSize: "medium" }} ref={refelem} onClick={() => ViewComments(post.id, !status)}>View Comments</button>

                                {
                                    likes.find((v) => v.userId == localStorage.getItem('Id') && v.postId == post.id) ?

                                        <button onClick={() => likePost(post.id)} style={{ background: "darkgreen", color: "wheat", borderRadius: "20px", fontSize: "medium" }} ref={refelem} >❤️ ({likes.filter((v) => v.postId == post.id).length})</button>
                                        :
                                        <button onClick={() => likePost(post.id)} style={{ background: "darkgreen", color: "wheat", borderRadius: "20px", fontSize: "medium" }} ref={refelem} >🩶 ({likes.filter((v) => v.postId == post.id).length})</button>

                                }


                                <button onClick={() => ViewLikes(post.id, vstatus)} style={{ background: "darkgreen", color: "wheat", borderRadius: "20px", fontSize: "medium" }}>View Likes</button>

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

                                                        <input type="text" name="" id="" value={updatedcomment} onChange={e => setUpdatedcomment(e.target.value)} style={{ height: "80%", color: "wheat", background: "black", textAlign: "center", fontSize: "medium" }} />

                                                        <button onClick={() => UpdateComment([comt.CommentId, post.id, comt.comment])} style={{ height: "100%", backgroundColor: "darkgreen", color: "wheat" }}>Update</button>


                                                    </div>
                                                    :
                                                    <>
                                                        <div className="imgamnt" style={{ display: "flex", alignItems: "center" }}>

                                                            <img src={comt.ProfilePic} alt="" style={{ width: "12%", height: "75%", borderRadius: "60%", marginRight: "5%" }} />
                                                            <p>{comt.comment}</p>
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

                            <div className="viewlikes" style={{ minWidth: "75%" }}>
                                {
                                    likesstatus && likedpostid == post.id ?
                                        targetpostlikes.map((v) => (

                                            <div className="likedusers" style={{ display: "flex", justifyContent: "space-between", border: "1px solid wheat", backgroundColor: "brown", width: "100%", alignItems: "center" }}>

                                                <div className="imgandcmnt" style={{ display: "flex" }}>

                                                    <img src={v.ProfilePic} alt="" style={{ width: "11%", height: "75%", borderRadius: "60%", marginLeft: "5%" }} />
                                                    <p style={{ marginLeft: "3%" }}>{v.name}</p>

                                                </div>

                                                <div className="btn" style={{ display: "flex", alignItems: "center" }}>

                                                    {
                                                        (v.userId == localStorage.getItem('Id')) ?
                                                            <p style={{ marginTop: "3.5%", marginRight: "13%" }}>It's You</p>
                                                            :
                                                            followings.find(f => f.UserId == v.userId) || followings.find(fvv => fvv.UserId == v.followinguserid) && v.followeruserid == localStorage.getItem('Id') ?

                                                                <button onClick={() => FollowUnfollow(v.userId)} style={{ height: "65%", backgroundColor: "darkred", color: "wheat", marginRight: "40%" }}>UnFollow</button>
                                                                :
                                                                <button onClick={() => FollowUnfollow(v.userId)} style={{ height: "55%", backgroundColor: "darkgreen", color: "wheat", marginRight: "40%" }}>Follow</button>
                                                    }

                                                </div>
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