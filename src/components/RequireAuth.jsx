import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const  RequireAuth = ({allowedRoles}) => {
    const {auth} = useAuth();
    const location = useLocation();

    return (
        //check if allowed roles in in the auth roles
        auth?.roles.find(role=>allowedRoles.includes(role))
            ? <Outlet/>// go to requested route
            : auth?.user 
                ? <Navigate to="/unauthorized"  state={{from: location}} replace /> //user is logged in but not authrized or visit the requested page
                : <Navigate to="/login" state={{from: location}} replace />
            //redirect them to login and puth /login to their browser history

    );
 
}

export default RequireAuth;