import axios from "axios";

//set global baseurl
export default axios.create({
    baseURL: "http://localhost:3500",
    withCredentials: true,
    
})