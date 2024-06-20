import axios from "axios"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

export const Navbarr = () => {
    const nav = useNavigate()

    const Logout = async () => {
        if (window.confirm('Logging Out?')) {

            try {
                const res = await axios.get(`http://localhost:8700/logout`)
                toast(res.data)
                nav('/')

            } catch (error) {
                console.log(error);
            }
        }
    }

    return (

        <div className="Navbar" style={{ border: "1px solid wheat", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "black", color: "wheat" }}>

            <button style={{ marginLeft: "7%" }} onClick={Logout} >Log Out</button>



            <h1 onClick={() => nav('/home')} style={{ color: "wheat", textAlign: "center", display: "flex", marginLeft: "30%" }}>Social Media🏠</h1>


            <div onClick={() => nav('/myprofile')} className="loggeduserdetails" style={{ color: "wheat", display: "flex", justifyContent: "flex-end", marginRight: "5%", alignItems: "center" }}>

                <img src={JSON.parse(localStorage.getItem('LoggedInUser'))[0].ProfilePic} alt="" style={{ width: "10%", borderRadius: "50%" }} />

                <p style={{ marginLeft: "3%" }}>{JSON.parse(localStorage.getItem('LoggedInUser'))[0].name}</p>

            </div>

        </div>
    )
}