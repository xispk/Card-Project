import { useEffect } from 'react';
import { ImArrowLeft } from 'react-icons/im'

const CraftScreen = ({history}) => {

  useEffect(() => {
    if(!localStorage.getItem("authToken")){
      history.push('/auth');
    }

  }, [history]);

  return ( 
    <div className="craft screen">
      <div className="craft screen__container">
        <h1 className="craft screen__title">Criar Cartas</h1>
        <div className="craft screen__menus">
        </div>
      </div>
      <div onClick={() => history.goBack()}className="return-btn">
        <ImArrowLeft />
      </div>
    </div>
  )
}
 
export default CraftScreen;