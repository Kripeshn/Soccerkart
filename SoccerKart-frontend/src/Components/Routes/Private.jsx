import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "./Spinner";

 export default function PrivateRoute() {
    const [ok, setOk] = useState(false);
    const [auth, setAuth] = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const authCheck = async() => {
            const res = await axios.get('http://localhost:8080/userauth', {
                headers: {
                    "Authorization": auth?.token                            
                }
            } );

            console.log(res);
        
            if(res.data?.ok){
                setOk(true);
            }else{
                setOk(false);
            }

        console.log(res.data.ok);
           
       
   
        // console.log(auth?.token);
        }
        if(auth?.token) {
            authCheck()
        }else{
            navigate("/login");
        }
    }, [auth?.token]);

    return ok ? <Outlet /> : <Spinner />
 }