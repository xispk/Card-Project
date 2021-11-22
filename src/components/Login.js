import { useState, useEffect } from 'react';
import axios from 'axios';

import { Link } from 'react-router-dom';

import Loader from './Loader';

const Login = ({ history, isLogin, setIsLogin }) => {
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
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
    const user = { email, password };

    const url = `http://localhost:3001/api/v1/auth/login`;
    // const url = `https://gamedecartasapi.herokuapp.com/api/v1/auth/login`;

    const config = {
      header: {
        'Content-Type': 'application/json',
      }
    }

    try {
      const { data } = await axios.post(url, user, config);

      localStorage.setItem("authToken", data.token);

      setIsLoading(false);
      history.push('/');
    } catch (error) {
      setIsLoading(false);
      let text = "Ocorreu um erro, tente novamente!";
      // if(error.response.data.error){
      //   text = error.response.data.error;
      // }
      setMessage({class: "message failure", text: text});
    }
  };

  return ( 
    <div className="login-screen">
      <form onSubmit={handleSubmit} className="login-screen__form">
        <h3 className="login-screen__title">Entrar</h3>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input 
            type="text" 
            id="email"
            tabIndex={1}
            onChange={e => setEmail(e.target.value)}/>
        </div>
        <div className="form-group">
          <label htmlFor="password">Senha</label>
          <input 
            type="password" 
            id="password"
            tabIndex={2}

            onChange={e => setPassword(e.target.value)}/>
          <span className={message.class}>{message.text}</span>
        </div>
            
        { isLoading ? <Loader /> : 
        <button tabIndex={3} type="submit" className="btn">Enviar</button> }
        <p className="redirect-to">Não tem conta?
          <span 
            tabIndex={4} 
            onClick={() => setIsLogin(!isLogin)}>Cadastrar
          </span>
        </p>
        <Link 
          tabIndex={5} 
          className="forgot-password" 
          to="/forgotpassword">Esqueci Minha Senha
        </Link>
      </form>
    </div>
   );
}
 
export default Login;