import { useState } from "react";

const useInput = (initValue)=>{
const [value, setValue] = useState(initValue);
}
 
export default useInput;