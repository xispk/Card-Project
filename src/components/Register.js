import { useState, useEffect } from 'react';
import axios from 'axios';

import Loader from './Loader';

const Register = ({ history, isLogin, setIsLogin }) => {
  const [ username, setUsername ] = useState('');
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ confirmPassword, setConfirmPassword ] = useState('');
  const [ isLoading, setIsLoading ] = useState(false);
  const [ message, setMessage ] = useState({class: "message", text: "Message"});
  const [ checkEmail, setCheckEmail ] = useState(
    {class: "check-email", text: "Checar Email"});

  // Use effects
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

  useEffect(() => {
    let resetCheckEmail;
    if(checkEmail.class !== "check-email success"){
      resetCheckEmail = setTimeout(() => {
        setCheckEmail({class: "check-email", text: "Checar Email"});
      }, 5000);
    }

    return () => clearInterval(resetCheckEmail);
  }, [checkEmail])

  useEffect(() => {
    setCheckEmail({class: "check-email", text: "Checar Email"});
    
  }, [email]);

  // Functions
  const patterns = {
    username: /^[a-z\d\._-]{2,30}$/i,
    email: /^([a-z\d\._-]+)@([a-z_-]+)\.([a-z]{2,20})(\.[a-z]{2,20})?$/,
    password: /^[\w-]{8,30}$/
  }; 

  const config = {
    header: {
      'Content-Type': 'application/json',
    }
  }

  const url = {
    email: `http://localhost:3001/api/v1/users`,
    submit: `http://localhost:3001/api/v1/auth/register`
  }

  // const url = {
  //   email: `https://gamedecartasapi.herokuapp.com/api/v1/users`,
  //   submit: `https://gamedecartasapi.herokuapp.com/api/v1/auth/register`
  // }

  const verifyEmail = async value => {
    const emailInput = document.querySelector('#email');
    if(patterns.email.test(value) && checkEmail.class === "check-email"){
      setCheckEmail({class: "check-email checking", text: "Checando..."});
      try {
        const { data } = await axios.post(url.email, {email: value}, config)
  
        if(data.data === 'available'){
          setCheckEmail({class: "check-email success", text: "Disponivel"});
          emailInput.className = "success";
          return;
        }
        if(data.data === 'unavailable'){
          emailInput.className = "failure";
          setCheckEmail({class: "check-email failure", text: "Indisponivel"});
          return;
        }
      } catch (error) {
        setCheckEmail({class: "check-email failure", text: "Erro"});
        setMessage({class: "message failure", text: "Ocorreu um erro, tente novamente!"});
      }
    } else if((
        !patterns.email.test(value)) && 
        checkEmail.class === "check-email") {
      setCheckEmail({class: "check-email failure", text: "Email Invalido"});
      emailInput.className = "failure";
    }
  };

  const handleSubmit = async e => {
    setIsLoading(true);
    e.preventDefault();
    const username = e.target.querySelector('#username');
    const email = e.target.querySelector('#email');
    const password = e.target.querySelector('#password');
    const confirmPassword = e.target.querySelector('#confirmPassword');

    const user = {username: username.value, email: email.value, password: password.value, confirmPassword: confirmPassword.value};

    const validate = () => {
      let results = [
        false, 
        false, 
        false, 
        false];

      if(patterns.username.test(username.value)){
        username.className = "success";
        results[0] = true;
      } else {
        username.className = "failure";
      }

      if(patterns.email.test(email.value)){
        email.className = "success";
        results[1] = true;
      } else {
        email.className = "failure";
      }

      if(checkEmail.class !== "check-email success"){
        verifyEmail(email.value);
        if(checkEmail.class !== "check-email success"){
          email.className = "failure";
          results[1] = false;
        }
      }
      
      if(patterns.password.test(password.value)){
        password.className = "success";
        results[2] = true;
      } else {
        password.className = "failure";
      }

      if(password.value === confirmPassword.value && 
        confirmPassword.value !== ""){
        confirmPassword.className = "success";
        results[3] = true;
      } else {
        confirmPassword.className = "failure";
      }

      results.forEach(result => {
        if(result === false){
          return false;
        }
      })
      return true;
    };

    const validation = validate();
    
    if(validation){
      try {
        const { data } = await axios.post(url.submit, user, config);
  
        localStorage.setItem("authToken", data.token);
  
        history.push('/');
        setIsLoading(true);
        return; 
      } catch (error) {
        let text = "Ocorreu um erro, tente novamente!";
        if(error.response.data.error){
          text = "Verifique os campos vermelhos e tente novamente";
        }
        setMessage({class: "message failure", text: text});
        setIsLoading(false);
        return; 
      }
    }
    setIsLoading(false);
    
  };

  
  return ( 
    <div className="register-screen">
      <form onSubmit={handleSubmit} className="register-screen__form">
        <h3 className="register-screen__title">Cadastrar</h3>
        <div className="form-group">
          <div className="input-info">
            <label htmlFor="username">Usuario</label>
          </div>
          <input 
            type="text" 
            id="username"
            autoComplete="off"
            placeholder="Min 2/Max 20 caracteres - (a-z) (A-Z) (0-9) (_ - .)"
            tabIndex={1}
            onChange={e => setUsername(e.target.value)}/>
        </div>
        <div className="form-group">
          <div className="input-info">
            <label htmlFor="email">Email</label>
            <button 
              tabIndex={3} 
              type="button" 
              onClick={() => verifyEmail(email)} 
              className={checkEmail.class}>{checkEmail.text}</button>
          </div>
          <input 
            type="text" 
            id="email"
            placeholder="Ex: meunome@email.com"
            tabIndex={2}
            onChange={e => setEmail(e.target.value)}/>
        </div>
        <div className="form-group">
          <div className="input-info">
            <label htmlFor="password">Senha</label>
          </div>
          <input 
            type="password" 
            id="password"
            autoComplete="off"
            placeholder="Min 8/Max 30 caracteres (a-z) (A-Z) (0-9) (_ -)"
            tabIndex={4}
            onChange={e => setPassword(e.target.value)}/>
        </div>
        <div className="form-group">
          <div className="input-info">
            <label htmlFor="confirmPassword">Confirmar Senha</label>
          </div>
          <input 
            type="password" 
            id="confirmPassword"
            autoComplete="off"
            placeholder="Deve ser igual a senha"
            tabIndex={5}
            onChange={e => setConfirmPassword(e.target.value)}/>
            <span className={message.class}>{message.text}</span>
        </div>
        { isLoading ? <Loader /> : 
        <button tabIndex={6} type="submit" className="btn">Enviar</button> }
        
        <p className="redirect-to">Ja tem conta?
          <span 
            tabIndex={7}
            onClick={() => setIsLogin(!isLogin)}>Fazer Login
          </span>
        </p>
      </form>
    </div>
   );
}
 
export default Register;