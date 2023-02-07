
import axios from "../api/axios"; //axios intance
import useAuth from "./useAuth"; //custom hook

const useRefreshToken = () => {
    //fn to update Authcontext
    const { setAuth } = useAuth();

    //called when the initial req fails due to expired refresh token
    const refresh = async () => {
        const response = await axios.get("/refresh", {
            withCredentials: true,

        });

        setAuth(prev => {
            console.log(JSON.stringify(prev));
            console.log(response.data.accessToken);
            //update global auth state
            return ({
                //overwrite the prev state with the new refresh token
                ...prev,
                roles: response.data.roles,
                accessToken: response.data.accessToken
            })
        })
        //return the new refresh token for use in the current request
        return response.data.accessToken;
    };

    return refresh;
}

export default useRefreshToken;