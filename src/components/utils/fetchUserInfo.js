import axios from 'axios';

const fetchUserInfo = async() => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('authToken')}`
    }
  }

  const url = `http://localhost:3001/api/v1/users`;
  // const url = `https://gamedecartasapi.herokuapp.com/api/v1/users`;

  try {
    const { data } = await axios.get(url, config);
    
    const user = data.data;
    return user;
  } catch (error) {
    return;
  }
};

export default fetchUserInfo;