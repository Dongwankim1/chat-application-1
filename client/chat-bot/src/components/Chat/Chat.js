import React, { useState } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client'
import { useEffect } from 'react';
import Infobar from '../InfoBar/InfoBar';
import './Chat.css';
import Info from '../Info/info';
import Messages from '../messages/Messages';
import TextContainer from '../TextContainer/TextContainer';
let socket;
const Chat = ({location}) =>{
    const [name,setName] = useState('');
    const [room,setRoom] = useState('');
    const [users, setUsers] = useState('');
    const [message,setMessage] = useState('');
    const [messages,setMessages] = useState([]);
    const ENDPOINT = 'localhost:5000';
    useEffect(()=>{
        const {name ,room} = queryString.parse(location.search);

        socket = io(ENDPOINT);        
        setName(name);
        setRoom(room);

        socket.emit('join',{name,room},(error)=>{
            console.log(error);
            if(error){
                alert(error);
                socket.emit('disconnect');
            }
            
        });

        return () =>{
            socket.emit('disconnect');

            socket.off();
        }

    },[ENDPOINT,location.search]);
    useEffect(()=>{
        socket.on('message',(message)=>{
            setMessages([...messages,message])
        })

        socket.on("roomData", ({ users }) => {
            setUsers(users);
          });
    },[messages])

    const sendMessage = (event) =>{
        event.preventDefault();

        if(message){
            socket.emit('sendMessage',message, () =>{
                return setMessage('');
            })
        }
    }

    console.log(message,messages);

    return (
    <div className="outerContainer">
        <div className="container">
            <Infobar room={room}></Infobar>
            <Messages messages={messages} name={name}/>
            <Info message={message} setMessage={setMessage} sendMessage={sendMessage}/>
        </div>
        <TextContainer users={users} />
    </div>
    )
}

export default Chat;