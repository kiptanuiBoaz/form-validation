import React, { useRef, useEffect, useState } from 'react';
import { FaInfoCircle, FaCheck, FaTimes } from "react-icons/fa";

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

export const Register = () => {
    const errREf = useRef();
    const userRef = useRef();

    //user
    const [user, setUser] = useState("");
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    //pwd
    const [pwd, setPwd] = useState("");
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    //pwd match field
    const [matchPwd, setMatchPwd] = useState("");
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    //error and success msg
    const [success, setSuccess] = useState(false);
    const [errMsg, setErrMsg] = useState("");


    useEffect(() => {
        //setting the focus on user field on load 
        userRef.current.focus()
    }, [])

    //validate the username
    useEffect(() => {
        setValidName(USER_REGEX.test(user));

    }, [user])//check everytime the user changes

    //validate the username
    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd));
        const match = pwd === matchPwd;
        setValidMatch(match);

    }, [pwd, matchPwd])//check everytime the pwd and matchpwd changes

    useEffect(() => {
        //empty the error msg when user makes changes
        setErrMsg("");
    }, [user, pwd, matchPwd]);

    //submit function
    const handleSubmit = async (e) => {
        e.preventDefault();
        // if button enabled with JS hack
        const v1 = USER_REGEX.test(user);
        const v2 = PWD_REGEX.test(pwd);
        if (!v1 || !v2) {
            setErrMsg("Invalid Entry");
            return;
        }

        console.log(pwd, user);
        setSuccess(true)

    }

    return (
        <>
            {success ? (
                <section>
                    <h1>Success!</h1>
                    <p>
                        <a href="#">Sign In</a>
                    </p>
                </section>
            ) : (
                <section>
                    {/* assertive means accesible by screen readers when fucused */}
                    <p ref={errREf} className={errMsg ? "errmsg" : "offscreen"} aria-live='assertive'>
                        {errMsg}
                    </p>

                    <h1>Register</h1>

                    <form onSubmit={handleSubmit}>
                        {/* username */}
                        <label htmlFor="username">
                            Username:
                            <FaCheck className={validName ? "valid" : "hide"} />
                            <FaTimes className={validName || !user ? "hide" : "invalid"} />
                        </label>
                        <input
                            type="text"
                            id="username"
                            ref={userRef}
                            autoComplete="off"
                            onChange={(e) => setUser(e.target.value)}
                            value={user}
                            required
                            aria-invalid={validName ? "false" : "true"}
                            aria-describedby="uidnote"
                            onFocus={() => setUserFocus(true)}
                            onBlur={() => setUserFocus(false)}
                        />

                        {/* username formate instructions */}
                        <p id="uidnote" className={userFocus && user && !validName ? "instructions" : "offscreen"}>
                            <FaInfoCircle />
                            4 to 24 characters.<br />
                            Must begin with a letter.<br />
                            Letters, numbers, underscores, hyphens allowed.
                        </p>

                        {/* password */}
                        <label htmlFor="username">
                            Password:
                            <FaCheck className={validPwd ? "valid" : "hide"} />
                            <FaTimes className={validPwd || !pwd ? "hide" : "invalid"} />
                        </label>

                        <input
                            type="password"
                            id="password"
                            onChange={(e) => setPwd(e.target.value)}
                            value={pwd}
                            required
                            aria-invalid={validPwd ? "false" : "true"}
                            aria-describedby="pwdnote"
                            onFocus={() => setPwdFocus(true)}
                            onBlur={() => setPwdFocus(false)}
                        />

                        {/* password format instructins */}
                        <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                            <FaInfoCircle />
                            8 to 24 characters.<br />
                            Must include uppercase and lowercase letters, a number and a special character.<br />
                            Allowed special characters:
                            <span aria-label="exclamation mark">!</span>
                            <span aria-label="at symbol">@</span>
                            <span aria-label="hashtag">#</span>
                            <span aria-label="dollar sign">$</span>
                            <span aria-label="percent">%</span>
                        </p>

                        {/* confirm password */}
                        <label htmlFor="confirm_pwd">
                            Confirm Password:
                            <FaCheck className={validMatch && matchPwd ? "valid" : "hide"} />
                            <FaTimes className={validMatch || !matchPwd ? "hide" : "invalid"} />
                        </label>
                        <input
                            type="password"
                            id="confirm_pwd"
                            onChange={(e) => setMatchPwd(e.target.value)}
                            value={matchPwd}
                            required
                            aria-invalid={validMatch ? "false" : "true"}
                            aria-describedby="confirmnote"
                            onFocus={() => setMatchFocus(true)}
                            onBlur={() => setMatchFocus(false)}
                        />
                        {/* confirm password instructions */}
                        <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                            <FaInfoCircle />
                            Must match the first password input field.
                        </p>

                        {/* submit button */}
                        <button disabled={!validName || !validPwd || !validMatch ? true : false}>Sign Up</button>
                        {/* links */}
                        <p>
                            Already registered?<br />
                            <span className="line">
                                {/*put router link here*/}
                                <a href="#">Sign In</a>
                            </span>
                        </p>
                    </form>
                </section>
            )}
        </>
    )
}
