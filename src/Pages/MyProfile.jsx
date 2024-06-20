import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Navbarr } from "../Components/Navbarr"
import { toast } from "react-toastify"


export const MyProfile = () => {
    const nav = useNavigate()
    const [loggeduser, setLoggeduser] = useState([])
    const [followings, setFollowings] = useState([])
    const [followers, setFollowers] = useState([])
    const [followingstatus, setFollowingstatus] = useState(false)
    const [followerstatus, setFollowerstatus] = useState(false)
    const [dpupdatestatus, setDpupdatestatus] = useState(false)
    const [file, setFile] = useState(null)


    axios.defaults.withCredentials = true
    const tokenChecker = () => {
        axios.get(`http://localhost:8700/myprofile`)
            .then(res => {
                if (!res.data.Token) {
                    localStorage.clear()
                    nav('/')
                }
                else {
                    setLoggeduser(res.data.LoggedUser)
                    setFollowings(res.data.Followings)
                    setFollowers(res.data.Followers)
                }
            })
            .catch(er => console.log(er))
    }

    useEffect(() => {
        tokenChecker()
    }, [followers, followings, loggeduser])

    // const HOC = ({ nbar }) => nbar()  //Higher Order Component

    const sampleComponent = () =>
        <div style={{ color: "wheat" }}>
            <h2>My Profile</h2>
        </div>

    const HOC2 = ({ SC }) => <SC /> //HOC

    const followingusers = () => {
        setFollowingstatus(!followingstatus)
        setFollowerstatus(false)
    }

    const followerusers = () => {
        setFollowingstatus(false)
        setFollowerstatus(!followerstatus)
    }

    const FollowUnfollow = (UserId) => {
        axios.post(`http://localhost:8700/followunfollowuser/${UserId}`)
            .then(res => toast(res.data.Msg))
            .catch(er => console.log(er))
    }

    const dpUpdateSetter = () => setDpupdatestatus(!dpupdatestatus)

    const handleSubmit = e => {
        e.preventDefault()

        if (file === null) toast(`Please select an Image file`)

        else {
            const formdata = new FormData()
            formdata.append('file', file)

            axios.put(`http://localhost:8700/updateprofilepic/${localStorage.getItem('Id')}`, formdata)
                .then(res => {
                    toast(res.data.Msg)
                    localStorage.setItem('LoggedInUser', JSON.stringify(res.data.dt))
                    setDpupdatestatus(false)
                })
                .catch(er => console.log(er))

        }
    }

    return (

        <div className="all" style={{ minHeight: "150vh", height: "auto", backgroundColor: "black" }}>

            {/* <HOC nbar={Navbarr} /> */}
            <Navbarr />
            <br />
            <HOC2 SC={sampleComponent} />

            <br />
            <br />

            <div className="table" style={{ display: "flex", justifyContent: "center", marginTop: "0%" }}>

                <table border={1} style={{ textAlign: "center", color: "wheat", width: "50%" }}>

                    <thead>
                        <tr >
                            <th>S.NO</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Avatar</th>
                            <th>City</th>
                            <th>Following</th>
                            <th>Followers</th>
                        </tr>
                    </thead>

                    <tbody>

                        {
                            loggeduser.map((luser) => (

                                <tr>
                                    <td>1</td>
                                    <td>{luser.name}</td>
                                    <td>{luser.email}</td>
                                    {
                                        !dpupdatestatus ?
                                            <td><img src={luser.ProfilePic} alt="ProfilePic not found" style={{ width: "15%", borderRadius: "50%" }} />
                                                <button onClick={dpUpdateSetter}>✏️</button>
                                            </td>
                                            :
                                            <>
                                                <td>
                                                    <form action="" onSubmit={handleSubmit}>
                                                        <input type="file" onChange={e => setFile(e.target.files[0])} />
                                                        <button type="submit">Upload</button>
                                                        <button onClick={() => setDpupdatestatus(false)}>Cancel</button>
                                                    </form>
                                                </td>
                                            </>

                                    }


                                    <td>{luser.city}</td>

                                    <td><button onClick={() => followingusers()} style={{ backgroundColor: "darkgreen", color: "wheat", fontSize: "medium", borderRadius: "10px", padding: "5px" }}>{followings.length} users</button></td>

                                    <td><button onClick={followerusers} style={{ backgroundColor: "darkgreen", color: "wheat", fontSize: "medium", borderRadius: "10px", padding: "5px" }}>{followers.length} users</button></td>

                                </tr>
                            ))
                        }

                    </tbody>
                </table>
            </div>

            {
                !followingstatus ?
                    <></>
                    :
                    <div className="followinglistbox" style={{ marginTop: "3%" }}>

                        <h3 style={{ color: "wheat" }}>Followings:</h3>
                        <div className="followinglist" style={{ color: "wheat", display: "flex", justifyContent: "center" }}>


                            {followings.map((user) => (

                                <div className="singleuser" style={{ display: "flex", justifyContent: "space-evenly", marginTop: "0%", border: "1px solid wheat", width: "15%", backgroundColor: "darkgreen", borderRadius: "15px" }}>

                                    <div className="imgandname" style={{ display: "flex" }}>
                                        <img src={user.ProfilePic} alt="" style={{ width: "35%", borderRadius: "50%" }} />
                                        <p style={{ marginLeft: "5%" }}>{user.name}</p>
                                    </div>
                                    {
                                        user.FollowedBy == localStorage.getItem('Id') ?
                                            <button onClick={() => FollowUnfollow(user.UserId)} style={{ backgroundColor: "darkred", color: "wheat", height: "50%", marginTop: "6%", marginRight: "3%" }}>Unfollow</button>
                                            :
                                            <button onClick={() => FollowUnfollow(user.UserId)} style={{ backgroundColor: "darkred", color: "wheat", height: "50%", marginTop: "5%" }}>Follow</button>
                                    }

                                </div>

                            ))}


                        </div>
                    </div>
            }

            {
                !followerstatus ?
                    <></>
                    :
                    <div className="followerlistbox" style={{ marginTop: "3%" }}>

                        <h3 style={{ color: "wheat" }}>Followers:</h3>

                        <div className="followerlist" style={{ color: "wheat", display: "flex", justifyContent: "center" }}>

                            {followers.map((user) => (

                                <div className="singleuser" style={{ display: "flex", justifyContent: "space-evenly", marginTop: "0%", border: "1px solid wheat", width: "15%", backgroundColor: "darkgreen", borderRadius: "15px" }}>

                                    <div className="imgandname" style={{ display: "flex" }}>

                                        <img src={user.ProfilePic} alt="" style={{ width: "35%", borderRadius: "50%" }} />
                                        <p style={{ marginLeft: "5%" }}>{user.name}</p>
                                    </div>

                                    {
                                        followings.find((followinguser) => followinguser.UserId == user.UserId) ?
                                            <button onClick={() => FollowUnfollow(user.UserId)} style={{ backgroundColor: "darkred", color: "wheat", height: "50%", marginTop: "6%", marginRight: "3%" }}>Unfollow</button>
                                            :
                                            <button onClick={() => FollowUnfollow(user.UserId)} style={{ backgroundColor: "darkred", color: "wheat", height: "50%", marginTop: "6%", marginRight: "3%" }}>Follow</button>
                                    }

                                </div>
                            ))}

                        </div>

                    </div>
            }


        </div>
    )
}