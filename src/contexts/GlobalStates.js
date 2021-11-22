import { createContext, useState, useEffect } from 'react';
import io from 'socket.io-client';

export const GlobalStates = createContext();
// this should be outside (global) for .emit to work
const socket = io("http://localhost:3001", { autoConnect: false });

const GlobalStatesProvider = (props) => {

  const [ userInfo, setUserInfo ] = useState(null);
  const [ roomInfo, setRoomInfo ] = useState(null);
  const [ globalChatRoom, setGlobalChatRoom ] = useState("Global-00");
  const [ currentMessage, setCurrentMessage ] = useState('');
  const [ messagesList, setMessagesList ] = useState([]);
  const [ newMessage, setNewMessage ] = useState("");
  const [ gameInfo, setGameInfo ] = useState(null);
  const [ isGameReady, setIsGameReady ] = useState(false);

  useEffect(() => {

    socket.on("lobby_playerJoined", data => {
      const { room } = data;
      setRoomInfo({...room});
    });

    socket.on("lobby_playerLeft", data => {
      const { room } = data;
      setRoomInfo({...room});
    });

    socket.on("lobby_readyChanged", updatedRoom => {
      setRoomInfo({...updatedRoom});
    })

  }, [socket]);

  useEffect(() => {

    if ( userInfo ) {
      socket.connect();
      socket.on("connect", () => {
        socket.emit("chat_join", globalChatRoom);

      });
      socket.on("chat_joined", data => {
        setNewMessage(data);
      });
      socket.emit("connected_user", {userId: userInfo._id});
    }
  }, [userInfo]);

  const logoutHandler = (history) => {
    localStorage.removeItem("authToken");
    history.push("/auth");
  };

  const values = { 
    userInfo,
    setUserInfo,
    roomInfo,
    setRoomInfo,
    socket,
    setGlobalChatRoom,
    globalChatRoom,
    currentMessage,
    setCurrentMessage,
    newMessage,
    setNewMessage,
    messagesList,
    setMessagesList,
    logoutHandler,
    gameInfo,
    setGameInfo,
    isGameReady,
    setIsGameReady };

  return (
    <GlobalStates.Provider value={values}>
      {props.children}
    </GlobalStates.Provider>
  )
}

export default GlobalStatesProvider;