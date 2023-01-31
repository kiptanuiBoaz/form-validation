import React, { useRef, useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthProvider";
import axios from "./api/axios";
const LOGIN_URL = "/auth"

export const Login = () => {
    //setting Auth as global context
    const { setAuth } = useContext(AuthContext);
    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

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
        console.log(user,pwd);
        try{
            const response = await axios.post(
                LOGIN_URL,
                JSON.stringify({ user, pwd }),
                {
                    headers: { 
                        "Content-Type": "application/json",
                        'Access-Control-Allow-Origin': '*'
                    },
                    withCredentials: true,
                    'Origin': 'http://127.0.0.1:5173',
                    credentials: 'same-origin',
                }
            );
            console.log(response?.data)
            console.log(response)
            console.log(response.accessToken)
            const accessToken = response?.data?.accessToken;
            const roles = response?.data?.roles;

            //send to global context
            setAuth({ pwd, user, accessToken, roles })
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
            //focus for screen readers
            errRef.current.focus();
            setPwd(""); setUser(""); 
        }
    }
   
    



return (
    <>
        {success ? (
            <section>
                <h1>You are logged in!</h1>
                <br />
                <p>
                    <a href="#">Go to Home</a>
                </p>
            </section>
        ) : (
            <section>
                {/* error msg */}
                <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                <h1>Sign In</h1>

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
                            <a href="#">Sign Up</a>
                        </span>
                    </p>
                </form>
            </section>
        )}
    </>
)
}
