import { useEffect } from 'react';
import { ImArrowLeft } from 'react-icons/im'

const InventoryScreen = ({history}) => {

  useEffect(() => {
    if(!localStorage.getItem("authToken")){
      history.push('/auth');
    }

  }, [history]);

  return ( 
    <div className="inventory screen">
      <div className="inventory screen__container">
        <h1 className="inventory screen__title">Inventorio</h1>
        <div className="inventory screen__menus">
        </div>
      </div>
      <div onClick={() => history.goBack()}className="return-btn">
        <ImArrowLeft />
      </div>
    </div>
  )
}
 
export default InventoryScreen;