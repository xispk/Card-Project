import { useEffect } from 'react';
import { ImArrowLeft } from 'react-icons/im'

const CampaignScreen = ({history}) => {

  useEffect(() => {
    if(!localStorage.getItem("authToken")){
      history.push('/auth');
    }

  }, [history]);

  return ( 
    <div className="campaign screen">
      <div className="campaign screen__container">
        <h1 className="campaign screen__title">Tela de Campanha</h1>
        <div className="campaign screen__menus">
        </div>
      </div>
      <div onClick={() => history.goBack()}className="return-btn">
        <ImArrowLeft />
      </div>
    </div>
  )
}
 
export default CampaignScreen;