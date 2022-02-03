import React, { createContext, useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";

const SocketContext = createContext();

const socket = io("http://localhost:8080");

const ContextProvider = ({ children }) => {

  const [stream, setStream] = useState(null);
  const [me , setMe] = useState("");
  const [call , setCall] = useState({})
  const [callAccepted , setCallAccepted] = useState(false)
  const [callEnded , setCallEnded] = useState(false)


  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true }) // get user media return promise
      .then((currentStream) => {
        setStream(currentStream);
        myVideo.current.srcObject = currentStream;
      });

      socket.on('me' , (id) => setMe(id));

      socket.on('callUser' , ({from ,name:callerName , signal}) => {
        setCall({isRecededCall: true , from , name: callerName , signal});
      })
  },[]);

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer ({initiator : false , trickle : false , stream});
    
    peer.on('signal' , (data) => {
      socket.on('answerCall', { signal : data , to : call.from});
    })


    peer.on('stream' , (currentStream)=> {
      userVideo.current.srcObject = currentStream;
    })

    
    peer.signal(call.signal);


    connectionRef.current = peer;






  
  
  };

  const callUser = () => {};

  const leaveCall = () => {};
};
