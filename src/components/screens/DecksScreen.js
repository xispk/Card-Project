import { useEffect } from 'react';
import { ImArrowLeft } from 'react-icons/im'

const DecksScreen = ({history}) => {
  useEffect(() => {
    if(!localStorage.getItem("authToken")){
      history.push('/auth');
    }

  }, [history]);

  return ( 
    <div className="decks screen">
      <div className="decks screen__container">
        <h1 className="decks screen__title">Editar Decks</h1>
        <div className="decks screen__menus">
        </div>
      </div>
      <div onClick={() => history.goBack()}className="return-btn">
        <ImArrowLeft />
      </div>
    </div>
  )
}
 
export default DecksScreen;