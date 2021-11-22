import Chat from './Chat';

const FriendsModal = ({modalState}) => {
  return ( 
    <div className={modalState ? "modal-container active" : "modal-container"}>
      <Chat/>
    </div> );
}
 
export default FriendsModal;