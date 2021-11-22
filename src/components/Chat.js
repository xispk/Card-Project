import { useEffect, useContext } from 'react';
import { MdSend } from 'react-icons/md';
import ScrollToBottom from 'react-scroll-to-bottom';
import { GlobalStates } from '../contexts/GlobalStates';

// Insert arrow icon on follow button
const Chat = () => {

  const { 
    newMessage,
    setNewMessage,
    userInfo, 
    socket,
    globalChatRoom,
    currentMessage,
    setCurrentMessage, 
    messagesList,
    setMessagesList 
  } = useContext(GlobalStates);
  
  useEffect(() => {
    if(newMessage.username === "Servidor"){
      setMessagesList([newMessage]);
      return;
    }
    if(newMessage !== "" && !messagesList.includes(newMessage)){
      setMessagesList((list) => [...list, newMessage]);
    }

  }, [newMessage]);


  // 
  useEffect(() => {
    socket.on("message_receive", data => {
      setNewMessage(data);
    })
  }, [socket]);

  const clearChatInput = () => {
    messageInput.value = "";
    setCurrentMessage("");
  };

  const handleSendMessage = async(event) => {
    event.preventDefault();
    if(currentMessage !== ""){
      clearChatInput();
      const messageData = {
        room: globalChatRoom,
        username: userInfo.username,
        message: currentMessage,
        time: 
          new Date(Date.now()).getHours() + 
          ":" + 
          new Date(Date.now()).getMinutes()
      }
  
      console.log(messageData);
      try {
        await socket.emit("message_send", messageData);
      } catch (error) {
        console.log(error);
      }
      setNewMessage(messageData);
    }
  };

  const messageInput = document.querySelector(".chat__form-group input");

  return ( 
    <div className="chat">
      <div className="chat__header">Chat Global</div>
      <div className="chat__body">
        <ScrollToBottom 
          className="message__container"
          followButtonClassName="message__follow-button"
          scrollViewClassName="message__scrollview">
          { messagesList.map((message, index) => { 
            return (
              <div 
                key={index} 
                className="message">
                <div className="message__info">
                  <p className={"message__username"}>{ message.username }</p>
                </div>
                <div className={
                  message.username === userInfo.username ? 
                  "message__content user" : 
                  message.username === "Servidor" ?
                  "message__content server" : "message__content"}>
                  <span className={"message__text"}>{ message.message }
                    <span className={"message__time"}>{ message.time }</span>
                  </span>
                </div>
              </div>
            )})}
          </ScrollToBottom>
      </div>
      <div className="chat__footer">
        <form onSubmit={e => handleSendMessage(e)} className="chat__form">
          <div className="chat__form-group">
            <input 
              type="text" 
              onChange={e => setCurrentMessage(e.target.value)}
              placeholder="Digite aqui sua mensagem" />
            <div 
              onClick={e => handleSendMessage(e)} 
              className="chat__button"><MdSend /></div>
          </div>
        </form>
      </div>
    </div>
  );
}
 
export default Chat;