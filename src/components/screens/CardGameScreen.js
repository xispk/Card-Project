import { useState, useContext, useEffect, createContext } from 'react';
import Card from '../Card.js';
import Showdown from './CardGameScreen/Showdown';
import Popup from './CardGameScreen/Popup';
import { GlobalStates } from '../../contexts/GlobalStates';
import { 
  BsArrowRight, 
  BsArrowLeft, 
  BsArrowUpRight, 
  BsArrowDownLeft } from 'react-icons/bs';

import { 
  GiPokerHand, 
  GiHearts, 
  GiTimeBomb, 
  GiCardBurn } from 'react-icons/gi';

import { RiCloseFill, RiSwordFill, RiShieldFill } from 'react-icons/ri';

import { ImUser } from 'react-icons/im';

const CardGameScreen = ({history}) => {
  const { 
    userInfo,
    socket,
    gameInfo,
    setGameInfo,
    isGameReady,
    setIsGameReady } = useContext(GlobalStates);
    
  const [ isModalActive, setIsModalActive ] = useState(false);
  const [ isMyTurn, setIsMyTurn ] = useState(false);
  const [ isShowdown, setIsShowdown ] = useState(false);
  const [ isPopupActive, setIsPopupActive ] = useState(false);
  const [ turnMessage, setTurnMessage ] = useState("");
  const [ popupText, setPopupText ] = useState("");
  const [ previewCards, setPreviewCards ] = useState([]);
  const [ previewContainer, setPreviewContainer ] = useState();
  const [ opponentCurrentDiscard, setOpponentCurrentDiscard ] = useState(0);
  const [ playerCurrentDiscard, setPlayerCurrentDiscard ] = useState(0);
  const [ opponent, setOpponent ] = useState(null);
  const [ player, setPlayer ] = useState(null);
  const [ selectedCard, setSelectedCard ] = useState(null);
  const [ selectedStance, setSelectedStance ] = useState(null);

  useEffect(() => {
    if(!localStorage.getItem("authToken")){
      history.push('/auth');
    }

    if( !gameInfo || !userInfo ){
      history.push('/');
    }

  }, [history]);

  useEffect(() => {
    if ( gameInfo ) {
      gameInfo.players.forEach(object => {
        if ( object._id === userInfo._id ) {
          setPlayer(object);
        } else {
          setOpponent(object);
        }
      })

      if ( gameInfo.state === "initializing" ) {
        socket.emit("game_playerReady", {
          userId: userInfo._id, 
          gameId: gameInfo._id});
      } else {
        setIsGameReady(true);
      }
    }
  }, [])

  useEffect(() => {
    if (gameInfo) {
      // Separa os players em player e oponente
      gameInfo.players.forEach(object => {
        if ( object._id === userInfo._id ) {
          setPlayer(object);
        } else {
          setOpponent(object);
        }
      })

      // Acontecimentos no inicio do primeiro turno da partida
      if ( gameInfo.trigger === "beginGame" && gameInfo.turn === 1 ) {
        // Inicia o showdown
        setIsShowdown(true);
        
        // Habilita tela do campo durante o showdown fechado
        setTimeout(() => {
          setIsGameReady(true);
        }, 3000);

        // Finaliza o showdown
        setTimeout(() => {
          setIsShowdown(false);
          if ( player._id === gameInfo.playing ){
            setIsPopupActive(true);
            setPopupText("Você joga primeiro");
          } else {
            setIsPopupActive(true);
            setPopupText("Oponente joga primeiro");
          }
        }, 6500);

        // Finaliza o anuncio do banner inicial
        setTimeout(() => {
          setIsPopupActive(false);
          if ( player._id === gameInfo.playing ){
            setIsMyTurn(true);
            setTurnMessage("Escolha uma carta para posicionar");
            handleCardsPreview([...player.hand]);
          } else {
            setTurnMessage("Oponente está posicionando cartas");
            handleCardsPreview([...player.hand]);
          }
        }, 10000);
      } 

      // Acontecimentos no inicio da fase de batalha
      if ( gameInfo.trigger === "beginBattle" ) {
        setIsModalActive(false);
        setIsPopupActive(true);
        setPopupText("Fase de batalha");
        setTimeout(() => {
          setIsPopupActive(false);
        }, 3500);
      }
      
      // Acontecimentos no inicio de um novo turno normal
      if ( gameInfo.trigger === "beginTurn" ) {
        if ( player._id === gameInfo.playing ){
          setIsMyTurn(true);
          setSelectedCard(null);
          setTurnMessage("É a sua vez de jogar!");
          handleCardsPreview([...player.hand]);
        } else {
          setIsMyTurn(false);
          setSelectedCard(null);
          setTurnMessage("É a vez do Oponente jogar!");
          handleCardsPreview([...player.hand]);
        }
      }
    }

  }, [gameInfo])

  useEffect(() => {
    socket.on("game_firstTurn", (data) => {
      setGameInfo({...data});
    })

    socket.on("game_cardPositioned", data => {
      setGameInfo({...data});
    })

    socket.on("game_startBattle", data => {
      setGameInfo({...data});
    })

    socket.on("game_newTurn", data => {
      console.log("check");
      setGameInfo({...data});
    })

  }, [socket]);

  const handleCurrentDiscardChangeAdd = (which) => {
    if( which === "player" ) {
      const lastIndex = player.board[2].length -1;
      const newValue = playerCurrentDiscard +1;
      if( newValue > lastIndex) {
        setPlayerCurrentDiscard(lastIndex);
      } else if ( newValue < 0 ) {
        setPlayerCurrentDiscard(0);
      } else {
        setPlayerCurrentDiscard(newValue);
      }
      
    }
    if ( which === "opponent" ) {
      const lastIndex = opponent.board[2].length -1;
      const newValue = opponentCurrentDiscard +1;
      if( newValue > lastIndex) {
        setOpponentCurrentDiscard(lastIndex);
      }else if( newValue < 0 ) {
        setOpponentCurrentDiscard(0);
      } else {
        setOpponentCurrentDiscard(newValue);
      }
    }
  }

  const handleCurrentDiscardChangeSub = (which) => {
    if( which === "player" ) {
      const lastIndex = player.board[2].length -1;
      const newValue = playerCurrentDiscard - 1;
      if( newValue > lastIndex) {
        setPlayerCurrentDiscard(lastIndex);
      } else if ( newValue < 0 ) {
        setPlayerCurrentDiscard(0);
      } else {
        setPlayerCurrentDiscard(newValue);
      }
      
    }
    if ( which === "opponent" ) {
      const lastIndex = opponent.board[2].length -1;
      const newValue = opponentCurrentDiscard -1;
      if( newValue > lastIndex) {
        setOpponentCurrentDiscard(lastIndex);
      }else if( newValue < 0 ) {
        setOpponentCurrentDiscard(0);
      } else {
        setOpponentCurrentDiscard(newValue);
      }
    }
  }

  const handleCardsPreview = (tokenCards) => {
    if ( tokenCards.length !== 0 ) {
      const cardsToPreview = tokenCards.map((card, index) => {
        let previewCard = {...card};

        previewCard.version = "preview"
        return previewCard;
      });
      setPreviewCards([...cardsToPreview]);
      setIsModalActive(true);
    }
  };

  const handleCardSelection = (card) => {
    setIsModalActive(false);
    if ( card.category === "normal" || card.category === "effect" ) {
      setSelectedStance("offensive");
    }
    setSelectedCard(card);
  }

  const handleSelectAnotherCard = () => {
    setSelectedCard(null);
    handleCardsPreview([...player.hand]);
  }

  const handlePositionCard = (a, b) => {
    let destination = {a, b}
    if ( isMyTurn && player.cardsToPosition > 0 ) {
      socket.emit("game_positionCard", {
        userId: userInfo._id, 
        selectedCard, 
        selectedStance, 
        destination,
        gameId: gameInfo._id });
      setSelectedCard(null);
    }
  }

  const handleEndTurn = () => {
    if ( isMyTurn ) {
      socket.emit("game_endTurn", { 
        userId: userInfo._id, 
        nextPlayerId: opponent._id,
        gameId: gameInfo._id });
    }
  }

  const handleStartBattlePhase = () => {
    if ( isMyTurn ) {
      socket.emit("game_endPositionPhase", {
        userId: userInfo._id,
        gameId: gameInfo._id
      });
    }
  }

  // LEMBRAR DE ENVIAR DO SERVIDOR PARA O CLIENTE APENAS OS DADOS QUE EU QUERO 
  // QUE O CLIENTE VEJA

  return ( 
  <div className="game screen">
    { isShowdown &&
      <Showdown player={player} opponent={opponent} />
    }
    { isPopupActive && 
      <Popup popupText={popupText} />
    }
    { isGameReady ?
    <div className="game screen__container">
      { isModalActive && <div className="game cards-preview__modal">
        <div className="game cards-preview__modal-title">
          <h2>{turnMessage}</h2>
        </div>
        <div className="game cards-preview">
          {previewCards.length !== 0 
          && previewCards.map(card => 
          <Card 
            card={card} 
            handleCardSelection={handleCardSelection} 
            isMyTurn={isMyTurn} />)}
        </div>
        { isMyTurn ?
          <div className="game cards-preview__buttons">
            <button 
              onClick={handleStartBattlePhase}
              className={gameInfo.turn !== 1 ? 
                "game btn battle-phase" 
                : 
                "game btn battle-phase disabled"}>
              Iniciar fase de batalha
            </button>
            <button 
              onClick={handleEndTurn}
              className="game btn end-turn">
              Passar a vez
            </button>
            <button 
              className="game btn surrender">
              Se render
            </button>

          </div>
          :
          <div 
            onClick={()=> setIsModalActive(false)} 
            className="game cards-preview__close">
              <RiCloseFill />
          </div> 
        } 
        </div> 
      }
      <div className="game left__container">
        <div 
          onClick={() => handleCardsPreview(opponent.board[2])}
          className="game opponent__discard">
          <div 
            onClick={() => handleCurrentDiscardChangeSub("opponent")}
            className="game opponent__discard go-left">
            <BsArrowLeft />
          </div>
          <div 
            onClick={() => handleCurrentDiscardChangeAdd("opponent")}
            className="game opponent__discard go-right">
            <BsArrowRight />
          </div>
          { opponent.board[2].length !== 0 ? 
          <Card card={opponent.board[2][opponentCurrentDiscard]} />
          :
          <div className="game card__holder"></div>
          }
        </div>
        <div className="game battle-history__container">
          <div className="game battle-history"></div>
        </div>
        <div 
          onClick={() => handleCardsPreview(player.board[2])}
          className="game player__discard">
          <div 
            onClick={() => handleCurrentDiscardChangeSub("player")}
            className="game player__discard go-left">
            <BsArrowLeft />
          </div>
          <div 
            onClick={() => handleCurrentDiscardChangeAdd("player")}
            className="game player__discard go-right">
            <BsArrowRight />
          </div>
          { player.board[2].length !== 0 ? 
          <Card card={player.board[2][playerCurrentDiscard]} />
          :
          <div className="game card__holder"></div>
          }
        </div>
      </div>
      <div className="game middle__container">
        <div className="game opponent__board">
          <div className="game opponent__slots magic">
            {opponent.board[1][0].length !== 0 ? 
            <Card card={opponent.board[1][0]} /> : 
            <div className="game card__holder"></div>
            }
            {opponent.board[1][1].length !== 0 ? 
            <Card card={opponent.board[1][1]} /> : 
            <div className="game card__holder"></div>
            }
            {opponent.board[1][2].length !== 0 ? 
            <Card card={opponent.board[1][2]} /> : 
            <div className="game card__holder"></div>
            }
            {opponent.board[1][3].length !== 0 ? 
            <Card card={opponent.board[1][3]} /> : 
            <div className="game card__holder"></div>
            }
            {opponent.board[1][4].length !== 0 ? 
            <Card card={opponent.board[1][4]} /> : 
            <div className="game card__holder"></div>
            }
          </div>
          <div className="game opponent__slots fighter">
            {opponent.board[0][0].length !== 0 ? 
            <Card card={opponent.board[0][0]} /> : 
            <div className="game card__holder"></div>
            }
            {opponent.board[0][1].length !== 0 ? 
            <Card card={opponent.board[0][1]} /> : 
            <div className="game card__holder"></div>
            }
            {opponent.board[0][2].length !== 0 ? 
            <Card card={opponent.board[0][2]} /> : 
            <div className="game card__holder"></div>
            }
            {opponent.board[0][3].length !== 0 ? 
            <Card card={opponent.board[0][3]} /> : 
            <div className="game card__holder"></div>
            }
            {opponent.board[0][4].length !== 0 ? 
            <Card card={opponent.board[0][4]} /> : 
            <div className="game card__holder"></div>
            }
          </div>
        </div>
        <div className="game player__board">
          <div className="game player__slots fighter">
            {player.board[0][0].length !== 0 ? 
            <Card card={player.board[0][0]} /> : 
            <div
              onClick={() => handlePositionCard(0, 0)}
              className={selectedCard && selectedCard.category === "normal" ? 
              "game card__holder focus": "game card__holder"}></div>
            }
            {player.board[0][1].length !== 0 ? 
            <Card card={player.board[0][1]} /> : 
            <div 
              onClick={() => handlePositionCard(0, 1)}
              className={selectedCard && selectedCard.category === "normal" ? 
              "game card__holder focus": "game card__holder"}></div>
            }
            {player.board[0][2].length !== 0 ? 
            <Card card={player.board[0][2]} /> : 
            <div 
              onClick={() => handlePositionCard(0, 2)}
              className={selectedCard && selectedCard.category === "normal" ? 
              "game card__holder focus": "game card__holder"}></div>
            }
            {player.board[0][3].length !== 0 ? 
            <Card card={player.board[0][3]} /> : 
            <div 
              onClick={() => handlePositionCard(0, 3)}
              className={selectedCard && selectedCard.category === "normal" ? 
              "game card__holder focus": "game card__holder"}></div>
            }
            {player.board[0][4].length !== 0 ? 
            <Card card={player.board[0][4]} /> : 
            <div 
              onClick={() => handlePositionCard(0, 4)}
              className={selectedCard && selectedCard.category === "normal" ? 
              "game card__holder focus": "game card__holder"}></div>
            }
          </div>
          <div className="game player__slots magic">
            {player.board[1][0].length !== 0 ? 
            <Card card={player.board[1][0]} /> : 
            <div className="game card__holder"></div>
            }
            {player.board[1][1].length !== 0 ? 
            <Card card={player.board[1][1]} /> : 
            <div className="game card__holder"></div>
            }
            {player.board[1][2].length !== 0 ? 
            <Card card={player.board[1][2]} /> : 
            <div className="game card__holder"></div>
            }
            {player.board[1][3].length !== 0 ? 
            <Card card={player.board[1][3]} /> : 
            <div className="game card__holder"></div>
            }
            {player.board[1][4].length !== 0 ? 
            <Card card={player.board[1][4]} /> : 
            <div className="game card__holder"></div>
            }
          </div>
        </div>
      </div>
      <div className="game right__container">
        { selectedCard && <div className="game card-selected__container">
            <div className="game card-selected__title">
              <h2>
                Escolha um dos campos destacados à esquerda para 
                posicionar a carta selecionada
              </h2>
            </div>
            <div className="game card-selected__card">

              <Card card={selectedCard} />
            </div>
            { selectedStance &&
              <div className="game card-selected__stance">
                <div className="game card-selected__subtitle">
                  <h2>Posição da Carta</h2>
                </div>
                <div className="game card-selected__stance-icons">
                  <div 
                    onClick={() => setSelectedStance("offensive")}
                    className={ selectedStance === "offensive" ?
                    "card-selected__stance-icon selected"
                    :
                    "card-selected__stance-icon"
                    }>
                    <RiSwordFill />
                  </div>
                  <div 
                    onClick={() => setSelectedStance("defensive")}
                    className={ selectedStance === "defensive" ?
                    "card-selected__stance-icon selected"
                    :
                    "card-selected__stance-icon"
                    }>
                    <RiShieldFill />
                  </div>
                </div>
              </div>
            }
            <button 
              onClick={handleSelectAnotherCard}
              className="game btn" >Escolher outra Carta</button>
          </div>
        }
        <div className="game right__opponent">
          <div className="game opponent ui-stats">
            <div className="game opponent user-profile-container">
              <div className="game opponent user-img"><ImUser /></div>
              <div className="game opponent user-name">{opponent.username}</div>
            </div>
            <div className="game opponent stats">
              <div className="game opponent health-amount-container">
                <div className="game opponent health-icon">
                  <GiHearts />
                </div>
                <div className="game opponent health-amount">
                  <span className="game opponent health-amount__current">{opponent.currentHealth}
                  </span>
                  <span className="game opponent health-amount__max">/{opponent.maxHealth}
                  </span>
                </div>
              </div>
              <div className="game opponent card-icons">
                <div className="game opponent hand-amount-container">
                  <div className="game opponent hand-icon">
                    <GiPokerHand />
                  </div>
                  <div className="game opponent hand-amount">
                    <span className="game opponent hand-amount__current">{opponent.hand.length}</span>
                    <span className="game opponent hand-amount__max">/10</span>
                  </div>
                </div>
                <div className="game opponent deck-amount-container">
                  <div className="game opponent deck-icon">
                    <GiCardBurn  />
                  </div>
                  <div className="game opponent deck-amount">
                    <span className="game opponent deck-amount__current">{opponent.deck.length}</span>
                    <span className="game opponent deck-amount__max">/30</span>
                  </div>
                </div>
              </div>
              <div className="game opponent time-amount-container">
                <div className="game opponent time-icon">
                  <GiTimeBomb />
                </div>
                <div className="game opponent time-amount">
                  <span className="game opponent time-amount__current">00:00</span>
                </div>
              </div>
            </div>
          </div>
          <div className="game opponent__hand">
            { opponent.hand.length !== 0 
              && opponent.hand.map((card, index) => {
              return (
              <div key={`opponent-hand__slot ${index}`} style={{zIndex: index}} className="game opponent hand__slot">
                <Card card={card} />
              </div>
              )
            }) }
          </div>
        </div>
        <div className="game right__player">
          <div 
            onClick={() => handleCardsPreview(player.hand)}
            className="game player__hand">
            { player.hand.length !== 0 
              && player.hand.map((card, index) => {
              return (
              <div key={`player-hand__slot ${index}`} style={{zIndex: index}} className="game player hand__slot">
                <Card card={card} />
              </div>
              )
            }) }
          </div>
          <div className="game player ui-stats">
            <div className="game player user-profile-container">
              <div className="game player user-img"><ImUser /></div>
              <div className="game player user-name">{player.username}</div>
            </div>
            <div className="game player stats">
              <div className="game player health-amount-container">
                <div className="game player health-icon">
                  <GiHearts />
                </div>
                <div className="game player health-amount">
                  <span className="game player health-amount__current">{player.currentHealth}
                  </span>
                  <span className="game player health-amount__max">/{player.maxHealth}
                  </span>
                </div>
              </div>
              <div className="game player card-icons">
                <div className="game player hand-amount-container">
                  <div className="game player hand-icon">
                    <GiPokerHand />
                  </div>
                  <div className="game player hand-amount">
                    <span className="game player hand-amount__current">{player.hand.length}</span>
                    <span className="game player hand-amount__max">/10</span>
                  </div>
                </div>
                <div className="game player deck-amount-container">
                  <div className="game player deck-icon">
                    <GiCardBurn  />
                  </div>
                  <div className="game player deck-amount">
                    <span className="game player deck-amount__current">{player.deck.length}</span>
                    <span className="game player deck-amount__max">/30</span>
                  </div>
                </div>
              </div>
              <div className="game player time-amount-container">
                <div className="game player time-icon">
                  <GiTimeBomb />
                </div>
                <div className="game player time-amount">
                  <span className="game player time-amount__current">00:00</span>
                </div>
              </div>
            </div>
          </div>
        </div>  
      </div>
    </div>
    :
    <div className="game screen__container">
      <h1 className="game screen__title">
        Aguardando o oponente...
      </h1>
    </div>
    }
  </div>
  );
}
 
export default CardGameScreen;