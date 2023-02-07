import { useEffect, useState } from "react";
import useRefreshToken from "../hooks/useRefreshToken";
import useAuth from "../hooks/useAuth";
import { Outlet } from "react-router-dom";

const PersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken(); //hook to request a new access token
    const { auth, persist } = useAuth(); //global authstate

    useEffect(() => {
        let isMounted = true;

        const verifyRefreshToken = async () => {
            try {
                await refresh();
            } catch (err) {
                console.error(err);
            } finally {
               isMounted && setIsLoading(false);
            }
        }
        //checkif auth state exists and hit the refreshToken endpoint
        !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);
        return ()=> isMounted = false
    }, [])//runs only when the component loads\

    return (
        <>
            {!persist
                ? <Outlet />
                : isLoading
                    ? <p>Loading...</p>
                    : <Outlet /> // all the child components
            }
        </>
    )
}

export default PersistLogin;