import { useEffect, useState, useContext } from 'react';
import { ImArrowLeft, ImCheckmark } from 'react-icons/im';
import { MdAddCircle } from 'react-icons/md';
import { 
  BsFillLockFill, 
  BsFillUnlockFill, 
  BsThreeDotsVertical } from 'react-icons/bs';

import { GiImperialCrown } from 'react-icons/gi';
import { GlobalStates } from '../../contexts/GlobalStates';

const LobbyScreen = ({history}) => {

  const { 
    userInfo, 
    roomInfo, 
    setRoomInfo, 
    socket,
    setGameInfo } = useContext(GlobalStates);
  const [ isLeaving, setIsLeaving ] = useState(false);
  const [ isReady, setIsReady ] = useState(false);

  useEffect(() => {
    if(!localStorage.getItem("authToken")){
      history.push('/auth');
    }

    if( !roomInfo || !userInfo ){
      history.push('/');
    }

  }, [history]);

  useEffect(() => {
    socket.on("game_starting", data => {
      setGameInfo(data);
      history.push('/cardgame');
    });
  }, [socket]);

  useEffect(() => {
    socket.emit("lobby_ready", {
      roomId: roomInfo._id, 
      userId: userInfo._id, 
      newReadyState: isReady});
  }, [isReady]);

  const handleLeaveLobby = () => {
    socket.emit("lobby_leave", {roomId: roomInfo._id, userId: userInfo._id});
    setRoomInfo(undefined);
    history.push('/');
  };

  const handleStartGame = () => {
    console.log("checking");
    socket.emit("lobby_start", {roomId: roomInfo._id, userId: userInfo._id});
  }

  let maxPlayers = [];
  if (roomInfo) {
    for ( let i = 0; i < roomInfo.maxPlayers; i++ ) {
      maxPlayers.push(i);
    }
  }

  return ( 
    <div className="lobby screen">
      { !isLeaving ? 
      <>
        <div className="lobby screen__container">
          <h1 className="lobby screen__title">
              {roomInfo && `Sala: ${roomInfo.name}`}
          </h1>
          <div className="lobby players">
            { roomInfo && maxPlayers.map((player) => {
              const { currentPlayers } = roomInfo;
              if (currentPlayers[player]) {
                const { _id: id, username, isLeader, isReady } = currentPlayers[player];
                return (
                  <div 
                    key={player} 
                    className={ userInfo._id === id ? 
                    "lobby player user" : "lobby player" }>
                    { isLeader ?
                    <div className="lobby leader__icon">
                      <GiImperialCrown/>
                    </div>
                    :
                    <div className="lobby ready__icon">
                    { isReady && <ImCheckmark />}
                    </div> }
                    <span className="lobby player__name">{username}</span>
                    { userInfo._id !== id && 
                      <div className="lobby player__icon">
                        <BsThreeDotsVertical/>
                      </div>
                    }
                  </div>
                )
              } else {
                return (
                  <div key={player} className="lobby player">
                    <span className="lobby player__name">Vazio</span>
                    <div className="lobby player__icon">
                      <MdAddCircle />
                    </div>
                  </div>
                )
              }
            })}
          </div>
          { roomInfo && roomInfo.currentPlayers[0]._id === userInfo._id ? 
            <button 
              onClick={() => handleStartGame()}
              className="lobby btn start">Começar</button>
            :
            <button 
              onClick={() => setIsReady(!isReady)} 
              className={isReady ? `lobby btn ready` 
              : `lobby btn not-ready`}>
              Pronto{isReady ? 
              <div className="lobby lock-icon">
                <BsFillLockFill /> 
              </div>
              : 
              <div className="lobby lock-icon">
                <BsFillUnlockFill />
              </div>}
            </button>
          }
        </div>
        <div onClick={() => setIsLeaving(true)}className="return-btn">
          <ImArrowLeft />
        </div>
      </>
      :
      <div className="lobby screen__container modal">
        <h1 className="lobby screen__title">Deseja mesmo sair?</h1>
        <div className="lobby buttons">
          <button 
            onClick={handleLeaveLobby}
            className="lobby btn failure">Sair
          </button>
          <button 
            onClick={() => setIsLeaving(false)} 
            className="lobby btn success">Cancelar
          </button>
        </div>
      </div>
      }
    </div>
  )
  
}
 
export default LobbyScreen;