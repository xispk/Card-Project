import { useState, useEffect } from 'react';
import axios from 'axios';

import { Link } from 'react-router-dom';

import Loader from '../Loader';

const ForgotPasswordScreen = ({ history }) => {
  const [ email, setEmail ] = useState('');
  const [ isLoading, setIsLoading ] = useState(false);
  const [ message, setMessage ] = useState({class: "message", text: "Message"});

  useEffect(() => {
    if(localStorage.getItem("authToken")){
      history.push('/');
    }
  }, [history]);

  useEffect(() => {
    let removeMessage = setTimeout(() => {
      setMessage({class: "message", text: "Message"});
    }, 5000);

    return () => clearInterval(removeMessage);
  }, [message]);


  const handleSubmit = async e => {
    setIsLoading(true);
    e.preventDefault();
    const user = { email };

    const url = `http://localhost:3001/api/v1/auth/forgotpassword`;
    // const url = `https://gamedecartasapi.herokuapp.com/api/v1/auth/forgotpassword`;

    const config = {
      header: {
        'Content-Type': 'application/json',
      }
    }

    const pattern = /^([a-z\d\._-]+)@([a-z_-]+)\.([a-z]{2,20})(\.[a-z]{2,20})?$/
    const validation = pattern.test(email);

    if(!validation){
      setIsLoading(false);
      setMessage({
        class: "message failure", 
        text: "Email invalido"});
      return;
    }
    
    try {
      await axios.post(url, user, config);

      setIsLoading(false);
      setMessage({
        class: "message success", 
        text: "Email enviado com sucesso!"});

    } catch (error) {
      setIsLoading(false);
      let text = "Ocorreu um erro, tente novamente mais tarde";
      if(error.response.data.error){
        text = error.response.data.error;
      }
      setMessage({
        class: "message failure", 
        text: text});
    }
    
  };

  return ( 
    <div className="auth-container">
      <div className="forgotpassword-screen">
        <form onSubmit={handleSubmit} className="forgotpassword-screen__form">
          <h3 className="forgotpassword-screen__title">Recuperação de Senha</h3>
          <p className="forgotpassword-screen__text">Para recuperar a sua senha informe abaixo o email cadastrado e você receberá em algums instantes um email com informações para continuar.</p>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="text" 
              id="email"
              onChange={e => setEmail(e.target.value)}/>
            <span className={message.class}>{message.text}</span>
          </div>

          { isLoading ? <Loader /> : <button type="submit" className="btn">Enviar</button> }
          <Link className="to-login" to="/auth">Voltar para o Login</Link>
        </form>
      </div>
    </div>
  );
}
 
export default ForgotPasswordScreen;