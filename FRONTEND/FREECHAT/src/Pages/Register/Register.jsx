import React , {useState} from "react";
import {makeApiRequest , setLocalStorage} from "../../utils/utils.helper"
import { useNavigate } from "react-router-dom";
function Register(props) {
  const navigate = useNavigate();
    const [userId , setUserId] = useState("");
    const [password , setPassword] = useState("");
    const [confirmPassword , setConfirmPassword] = useState("");
    const onSubmit = (e)=>
        {
            e.preventDefault();
            if(password !== confirmPassword)
            {
                alert("Passwords do not match");
                return;
            }
            console.log("User Id : " , userId);
            console.log("Password : " , password);
            console.log("Confirm Password : " , confirmPassword);
            makeApiRequest({method : "post" , urlPath : "register" , body : {user_id : userId , password} , encryptedKeys : []})
            .then((res)=>{
                console.log({res});

                if(res.data.status < 250)
                {
                    alert("Account created successfully");
                    setLocalStorage(userId);
                    props.setId(userId);
                    navigate("/messages");
                }
                else
                {
                    alert("Account creation failed");
                }
            }).catch((err)=>{
                console.log(err);
                alert("Account creation failed");
            })
        }
  return (
    <div className=" w-full h-full bg-black flex flex-col items-center justify-center">
      <div className=" border-[0.1rem] border-white p-[1rem] gap-[3rem] flex flex-col items-center">
        <h1 className=" text-[1.5rem] text-white">FREECHAT</h1>
        <div className=" w-[25rem] flex items-start flex-col gap-[1rem]">
          <div className=" flex items-center gap-[1rem] w-full justify-between">
            <label className="text-white text-[1.2rem]" htmlFor="userId">
              User Id   
            </label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder=" Enter your user id"
              className=" focus:outline-0 border-[0.1rem] text-white border-white"
              id="userId"
            />
          </div>
          <div className=" flex items-center gap-[1rem] w-full justify-between">
            <label className="text-white text-[1.2rem]" htmlFor="password">
              Password
            </label>
            <input
              type= "password"
              value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=" Enter your password"
              className=" focus:outline-0 border-[0.1rem] text-white border-white"
              id="password"
            />
          </div>
          <div className=" flex items-center gap-[1rem] w-full justify-between">
            <label className="text-white text-[1.2rem]" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder=" Confirm your password"
              className=" focus:outline-0 border-[0.1rem] text-white border-white"
              id="confirmPassword"
            />
          </div>
        </div>
          <button onClick={(e)=>
            {
              console.log("hi there")
                onSubmit(e);
            }} className=" text-[1.2rem] text-white w-full border-[0.1rem] border-white text-center flex items-center justify-center"> Create Your Account Today</button>
      </div>
    </div>
  );
}
export default Register;
