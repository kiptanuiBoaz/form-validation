import axios, { axiosPrivate } from "../api/axios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";


const useAxiosPrivate = () =>{
    const refresh = useRefreshToken(); 
    const {auth}= useAuth();

    //interceptors are like vanilla js event listeners
    useEffect(()=>{
        //add request intercept
        const requestIntercept = axiosPrivate.interceptors.request.use(
            config =>{
                //check if authorizatin doenst exit, meaning it's not a retry
                if(!config?.headers["Authorization"]){
                    config.headers["Authorization"] = `Bearer ${auth?.accessToken}`
                }
                return config;
            },(error)=> Promise.reject(error)
        )
        //add response interceptor
        const responseIntercept = axiosPrivate.interceptors.response.use(
            //if respose exist just return the resone
            response => response,
            //err thrown if token has expired
            async(err) => {
                const prevRequest = err?.config;
                //check the status and custom property "sent";
                //403 means forbidded and 401 meams unAuthorized
                if(err?.response?.status === 403 && !prevRequest?.sent ){
                    prevRequest.sent = true;//avoid infinity loop
                    //get newAccessToken from useRefresh hoook
                    const newAccessToken = await refresh();
                    //set newAccessToken in the req headers
                    prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

                    //retry the request after updating the access token
                    return axiosPrivate(prevRequest);
                }
                return Promise.reject(err);
            }
        );

        //return a clean up fn to remove the response and request interceptor
        return() =>{
            axiosPrivate.interceptors.response.eject(responseIntercept);
            axiosPrivate.interceptors.request.eject(requestIntercept);
        }
    },[auth, refresh])
    return axiosPrivate;
}

export default useAxiosPrivate;