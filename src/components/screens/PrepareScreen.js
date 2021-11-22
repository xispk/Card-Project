import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ImArrowLeft } from 'react-icons/im'

const PrepareScreen = ({history}) => {

  useEffect(() => {
    if(!localStorage.getItem("authToken")){
      history.push('/auth');
    }

  }, [history]);

  return ( 
    <div className="prepare screen">
      <div className="prepare screen__container">
        <h1 className="prepare screen__title">Tela de Preparação</h1>
        <div className="prepare screen__menus">
          <Link to="/prepare/inventory" className="menu-btn">Inventorio</Link>
          <Link to="/prepare/craft" className="menu-btn">Criar Cartas</Link>
          <Link to="/prepare/decks" className="menu-btn">Editar Decks</Link>
        </div>
      </div>
      <div onClick={() => history.goBack()}className="return-btn">
        <ImArrowLeft />
      </div>
    </div>
  )
}
 
export default PrepareScreen;