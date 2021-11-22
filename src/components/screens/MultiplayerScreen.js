import { useEffect, useState, useContext } from 'react';
import { ImArrowLeft } from 'react-icons/im';
import { BiRefresh } from 'react-icons/bi';
import Loader from '../Loader';
import axios from 'axios';
import { GlobalStates } from '../../contexts/GlobalStates';

const MultiplayerScreen = ({history}) => {

  const { userInfo, setRoomInfo, socket } = useContext(GlobalStates); 

  const [ isInQueue, setIsInQueue ] = useState(false);
  const [ isLookingForGames, setIsLookingForGames ] = useState(false);
  const [ isCreatingRoom, setIsCreatingRoom ] = useState(false);
  const [ isLoading, setIsLoading ] = useState(false);

  const [ gameName, setGameName ] = useState("");
  const [ gameMode, setGameMode ] = useState("normal");
  const [ gamePlayers, setGamePlayers ] = useState("2");

  const [ selectedRoom, setSelectedRoom ] = useState(null);
  const [ lobbyRooms, setLobbyRooms ] = useState([]);

  useEffect(() => {
    if (!localStorage.getItem("authToken")) {
      history.push('/auth');
    }

    if (!userInfo) {
      history.push('/');
    }

  }, [history]);

  useEffect(() => {
    socket.on("lobby_created", room => {

      handleLobbyJoin(room, userInfo);
    
    });

  }, [socket]);

  const handleLobbyJoin = (roomInfo, userInfo) => {
    socket.emit("lobby_join", {roomId: roomInfo._id, userId: userInfo._id});
      
    socket.on("lobby_joined", data => {
      const { messageData, room } = data;
      socket.emit("lobby_playerJoin", {messageData, room})

      setIsLoading(false);

      setRoomInfo(room);
      
      history.push('/lobby');
      console.log(data);
    });
  }

  const fetchLobbyRooms = async() => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
      }
    }
  
    const url = `http://localhost:3001/api/v1/rooms/queue?rank=custom`;
    // const url = `https://gamedecartasapi.herokuapp.com/api/v1/rooms/queue?rank=custom`;
  
    try {
      setIsLoading(true);
      let availableRooms = [];
      const { data } = await axios.get(url, config);
      
      const queue = data.data;
      
      availableRooms = queue.rooms.filter(room => {
        const { currentPlayers, maxPlayers } = room;
        return (
          currentPlayers.length > 0 && 
          currentPlayers.length < maxPlayers)
      })
      setIsLoading(false);
      setLobbyRooms(availableRooms);

    } catch (error) {
      setIsLoading(false);
      setLobbyRooms([]);
    }
  };

  useEffect(() => {
    fetchLobbyRooms();

  }, []);

  const handleCreateRoom = () => {
    const roomOptions = {
      name: gameName,
      mode: gameMode,
      maxPlayers: gamePlayers,
      creator: userInfo.username,
      rank: "custom"
    };

    if(gameName !== ""){
      setIsLoading(true);

      socket.emit("lobby_create", roomOptions);
    
    }
  };

  return ( 
    <div className="multiplayer screen">
      { isInQueue ?
        <> 
          <div className="multiplayer screen__container">
            <h1 className="multiplayer screen__title queue">
              Procurando Oponente
            </h1>
            <Loader /> 
            <div 
              onClick={() => setIsInQueue(false)} 
              className="multiplayer cancel-queue-btn">Cancelar
            </div>
          </div>
        </> 
        : isCreatingRoom ?
        <> 
          <div className="multiplayer screen__container">
            <h1 className="multiplayer screen__title">Opções de Jogo</h1>
            <div className="game-options">
              <div className="game-option">
                <div className="option-input">
                  <input 
                    type="text" 
                    name="game-name" 
                    id="game-name"
                    autoComplete="off"
                    onChange={e => setGameName(e.target.value)}
                    placeholder="Escolha um nome para o jogo" />
                </div>
              </div>
              <div className="game-option">
                <div className="option-label">
                  <label htmlFor="game-mode">Modo:</label>
                </div>
                <div className="option-select">
                  <select 
                    onChange={e => setGameMode(e.target.value)} 
                    name="game-mode" 
                    id="game-mode">
                    <option value="nomal">Normal</option>
                    {/* <option value="classic">Classico</option> */}
                  </select>
                </div>
              </div>
              <div className="game-option">
                <div className="option-label">
                  <label htmlFor="game-players">Jogadores:</label>
                </div>
                <div className="option-select">
                  <select 
                    onChange={e => setGamePlayers(e.target.value)}
                    name="game-players" 
                    id="game-players">
                    <option value="2">2</option>
                    {/* <option value="3">3</option>
                    <option value="4">4</option> */}
                  </select>
                </div>
              </div>
            </div>
            { isLoading && isCreatingRoom ? 
            <Loader /> 
            : 
            <div 
              onClick={handleCreateRoom} 
              className="multiplayer create-room-btn">Criar
            </div> }
            <div onClick={() => setIsCreatingRoom(false)}className="return-btn">
              <ImArrowLeft />
            </div>
          </div>
        </>
        : isLookingForGames ?
        <> 
          <div className="multiplayer screen__container">
            <h1 className="multiplayer screen__title">Salas Disponiveis</h1>
            <form action="">
              <div className="multiplayer filter-form">
                <div className="multiplayer filter-input">
                  <input 
                    type="text" 
                    placeholder="Pesquisar por nome" />
                </div>
                <div className="multiplayer filter-button">
                  <button>Pesquisar</button>
                </div>
              </div>
            </form>
            <div className="multiplayer table-container">
                <div className="thead">
                  <div className="tr">
                    <span className="th">Nome da Sala</span>
                    <span className="th">Players</span>
                    <span className="th">Criador</span>
                    <span className="th">Modo</span>
                  </div>
                </div>
              <div className="multiplayer rooms-list">
                { 
                lobbyRooms.length === 0 && !isLoading ? 
                <div className="multiplayer no-rooms">
                  <p>
                    Nenhuma sala encontrada no momento, atualize "<BiRefresh />"
                    para verificar novamente ou cria uma nova sala.
                  </p>
                </div> 
                : isLoading ? 
                <div className="multiplayer loading-rooms"><Loader /> </div> 
                : lobbyRooms.map((room) => {
                  const { _id: id, name, creator, mode, maxPlayers, currentPlayers} = room;
                  return (
                  <div key={id} className="tbody">
                    <div 
                      onClick={() => {
                        if (selectedRoom && selectedRoom._id === id) {
                          setSelectedRoom(null);
                        } else {
                          setSelectedRoom(room);
                        }
                        }} 
                      className={ selectedRoom && selectedRoom._id === id ?
                      "rooms-list__selected tr" : "tr"}>
                      <span className="td">{name}</span>
                      <span className="td">{`${currentPlayers.length} / ${maxPlayers}`}</span>
                      <span className="td">{creator}</span>
                      <span className="td">{mode}</span>
                    </div>
                  </div>
                  )
                })}
              </div>
              <div className="rooms-list__buttons">
                <button
                  className="multiplayer btn" 
                  onClick={() => setIsCreatingRoom(true)}>Criar Sala
                </button>
                <div 
                  className="mltiplayer icon"
                  onClick={fetchLobbyRooms}>
                  <BiRefresh />
                </div>
                <button
                  onClick={() => handleLobbyJoin(selectedRoom, userInfo)}
                  className={selectedRoom ? 
                  "multiplayer btn" : 
                  "multiplayer btn disabled"}>Entrar na Sala
                </button>
              </div>
            </div>
            <div 
              onClick={() => setIsLookingForGames(false)}
              className="return-btn">
              <ImArrowLeft />
            </div>
          </div>
        </>
        :
        <>
          <div className="multiplayer screen__container">
            <h1 className="multiplayer screen__title">Tela de Multijogador</h1>
            <div className="multiplayer screen__menus">
              <div 
                onClick={() => setIsInQueue(true)}
                className="menu-btn">Jogo Rapido
              </div>
              <div 
                onClick={() => setIsLookingForGames(true)}
                className="menu-btn">Salas Personalizadas
              </div>
            </div>
          </div>
          <div onClick={() => history.goBack()}className="return-btn">
            <ImArrowLeft />
          </div>
        </>
      }
    </div>
  )
}
 
export default MultiplayerScreen;