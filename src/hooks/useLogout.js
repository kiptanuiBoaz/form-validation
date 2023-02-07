import axios from "../api/axios";
import useAuth from "./useAuth";

const useLogout = () => {
    const { setAuth } = useAuth();

    const logout = async () => {
        setAuth({});//emtpty out the current auth state

        try {
            const response = await axios.get("/logout", {
                withCredentials: true
            })
            console.log(response)
        }catch(error) {
            console.error(error);
        }

    }

    return logout;
}

export default useLogout;