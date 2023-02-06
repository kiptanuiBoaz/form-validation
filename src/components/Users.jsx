import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate"


const Users = () => {
    const [users, setUsers] = useState();
    //get axiosPrivate instance from useAxios private hook
    const axiosPrivate = useAxiosPrivate();
   
    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();//used to cancel pending requests if the compoent  unmounds

        const getUsers = async () => {
            try {
                const response = await axiosPrivate.get("/users", {
                    signal: controller.signal, //pass controller to axios

                });

                console.log(response.data)
                isMounted && setUsers(response.data);
            } catch (err) {
                console.error(err);
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