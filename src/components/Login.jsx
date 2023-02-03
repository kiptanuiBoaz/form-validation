import React, { useRef, useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import axios from "../api/axios";
import { useLocation, useNavigate, Link } from "react-router-dom";
const LOGIN_URL = "/auth"

export const Login = () => {
    //setting Auth as global context
    const { setAuth } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    //wher the user navigated from
    const from = location?.state?.from?.pathname || "/";

    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');


    //focus on the user when the component loads 
    useEffect(() => {
        userRef.current.focus();

    }, [])//only runs ounce

    //umpty the error message on user state change
    useEffect(() => {
        setErrMsg("");
    }, [pwd, user]);

    //submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(user, pwd);
        try {
            const response = await axios.post(
                LOGIN_URL,
                JSON.stringify({ user, pwd }),
                {
                    headers: {
                        "Content-Type": "application/json",
                        withCredentials: true, //allows sending coockies
                    },
                  
                    
                }
            );
            console.log(response?.data)
            console.log(response)
            console.log(response.data.accessToken)
            const accessToken = response?.data?.accessToken;
            const roles = response?.data?.roles;

            //send to global context
            setAuth({ pwd, user, accessToken, roles });
            
            // setUser("");
            // setPwd("");
            //navigate user to the route theyre from
            navigate(from, { replace: true });
        } catch (err) {
           
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.response?.status === 401) {
                setErrMsg('Password is incorrect');
            } else {
                setErrMsg('Login Failed');
            }
            //focus for screen readers
            errRef.current.focus();
            setPwd(""); setUser("");
        }
    }





    return (

        <section>
            {/* error msg */}
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            <Link to={"/login"}>Sign In</Link>

            <form onSubmit={handleSubmit}>
                {/* username */}
                <label htmlFor='username'>Username:</label>
                <input
                    type='text'
                    id='username'
                    ref={userRef}
                    autoComplete="off"
                    onChange={(e) => setUser(e.target.value)}
                    value={user}
                    required
                >
                </input>
                {/* password */}
                <label htmlFor='password'>Password:</label>
                <input
                    type='password'
                    id='password'
                    autoComplete="off"
                    onChange={(e) => setPwd(e.target.value)}
                    value={pwd}
                    required
                >
                </input>

                <button>Sign In</button>

                <p>
                    Need an Account?<br />
                    <span className="line">
                        {/*put router link here*/}
                        <Link to={"/register"}>Sign Up</Link>
                    </span>
                </p>
            </form>
        </section>

    )
}
