import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";


const Users = () => {
    const [users, setUsers] = useState();
    //get axiosPrivate instance from useAxios private hook
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        let isMounted = true;
        //used to cancel pending requests if the compoent  unmounds
        const controller = new AbortController();//used to cancel pending requests if the compoent  unmounds

        const getUsers = async () => {
            try {
                const response = await axiosPrivate.get("/users", {
                    signal: controller.signal, //pass controller to axios

                });

                console.log(response.data)
                isMounted && setUsers(response.data);
            } catch (err) {
                //axios controllere throws an error of cancelled when the component is unmounted 
                // before the request is completed. And this is considered an ecxtected behaviour
                if (err.message !== 'canceled') {
                    console.error(err);
                    // change the navigation state to previous location if theres an error
                    navigate('/login', { state: { from: location }, replace: true });
                }
            }
        }

        getUsers();
        //clean up fn
        return () => {
            isMounted = false; //dont attempt to set users state
            controller.abort(); //cancel any pending request
        }
    }, []);

    return (

        <article>
            <h2>Users List</h2>
            {users?.length
                ? (
                    <ul>
                        {users.map((user, i) => <li key={i}>{user?.username}</li>)}

                    </ul>
                )
                : (<p>No users to display</p>)

            }

        </article>
    )

}

export default Users