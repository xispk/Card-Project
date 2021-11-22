import { useEffect } from 'react';
import { ImArrowLeft } from 'react-icons/im'

const StoreScreen = ({history}) => {

  useEffect(() => {
    if(!localStorage.getItem("authToken")){
      history.push('/auth');
    }

  }, [history]);

  return ( 
    <div className="store screen">
      <div className="store screen__container">
        <h1 className="store screen__title">Tela da loja</h1>
        <div className="store screen__menus">
        </div>
      </div>
      <div onClick={() => history.goBack()}className="return-btn">
        <ImArrowLeft />
      </div>
    </div>
  )
}
 
export default StoreScreen;