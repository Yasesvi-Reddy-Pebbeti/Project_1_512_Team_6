import React, { useState  , useEffect, useRef} from "react";
import { makeApiRequest, setLocalStorage  , useLocalStorage} from "../../utils/utils.helper";
import { useNavigate } from "react-router-dom";
import "./messages.css";
function Register(props) {
    const navigate = useNavigate();
    const socketRef = useRef(null);
    const [messages , setMessages] = useState();
    const [users , setUsers] = useState();
    const [message , setMessage] = useState();
    const [connection , setConnection] = useState(false);
    const [selected , setSelected] = useState();
    

    useEffect(()=>
        {
            if (!props.id)
            {
                props.setId(useLocalStorage(navigate));
            }
        } , [])
        useEffect(()=>
            {
                if(props.id)
                    {
                        makeApiRequest({method : "post" , urlPath : "get-messages" , body : {user_id : props.id} , encryptedKeys : []})
                        .then((res)=>{
                            console.log({res});
                            if(res.data.status < 250)
                            {
                                setMessages({...res.data.data.conversations});  
                                setUsers([...res.data.data.users]);
                            }
                            else
                            {
                                alert("Failed to fetch messages");
                            }

                        }).catch((err)=>{
                            console.log(err);
                            alert("Failed to fetch messages");
                        })
                    }
            } , [props.id])
  return (
    <div className=" w-full h-full bg-black flex flex-col items-start justify-start">
      <div className=" h-full w-full flex flex-col items-start">
        <div className="w-full h-[4rem] flex items-center justify-between p-[1rem]">
          <h1 className=" text-white text-[1.5rem]">FREECHAT</h1>
          <div className="div flex w-fit items-center gap-[1rem]">
            <span></span>
            <button onClick={()=>{navigate("/login")}} className=" text-slate-500 text-[1rem]">Log out</button>
          </div>
        </div>  
        <div className="w-full scroller flex">
            <div className="1 flex-1 flex flex-col items-start">
                <div className="w-full h-[3rem] flex items-center justify-center">
                    <span className="text-white text-[1.1rem]">Users</span>
                </div>
                <div className="users w-full border-[0.2rem] border-white flex flex-col items-start">
                    {users && users.map((user)=>
                        {
                            return <button onClick={()=>
                                {
                                    setSelected(user);
                                }} className="user hover:bg-white hover:text-black w-full text-start h-[3rem] flex items-center justify-center text-white text-[1.2rem]">{user}</button>
                        })}
                </div>
                <div></div>
            </div>
            <div className="1 flex-3 flex flex-col items-start">
                {selected ? <><div className="w-full h-[3rem] flex items-center justify-center">
                    <span className="text-white text-[1.1rem]">{selected}</span>
                </div>
                <div className="users w-full border-[0.2rem] border-white flex flex-col items-start">
                    <div className="w-full h-full flex flex-col">
                        <div className="messages shrink-0 w-full flex flex-col"></div>
                        <div className=" w-full h-[2.5rem] flex items-center justify-between border-[0.1rem] border-white">
                            <input value={message} onChange={(e)=>{
                                setMessage(e.target.value);
                            }} type="text" placeholder="type your message here" className="text-white pl-[1rem] focus:outline-none text-[1rem] w-[90%] h-full" />
                            <button onClick={()=>{
                                setMessage("");
                            }} className="text-black bg-white text-[1rem] px-[.8rem] h-full">SEND</button>
                        </div>
                    </div>
                </div></> : <div className="flex flex-col items-center justify-center w-full h-full">
                    <span className=" text-[1.3rem] text-slate-500">Please select a user to chat with</span>
                    </div>}
            </div>
        </div>
      </div>
    </div>
  );
}
export default Register;
