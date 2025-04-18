import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import { Outlet } from "react-router-dom";
import axios from "axios";
import Spinner from "./Spinner";

 export default function AdminRoute() {
    const [ok, setOk] = useState(false);
    const [auth, setAuth] = useAuth();

    useEffect(() => {
        const authCheck = async() => {
            const res = await axios.get('http://localhost:8080/admin-auth', {
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
        if(auth?.token) authCheck()
    }, [auth?.token]);

    return ok ? <Outlet /> : <Spinner path ="/" />
 }