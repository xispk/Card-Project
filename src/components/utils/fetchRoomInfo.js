import axios from 'axios';

const fetchRoomInfo = async(roomId) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('authToken')}`
    }
  }

  const url = `http://localhost:3001/api/v1/rooms?_id=${roomId}`;
  // const url = `https://gamedecartasapi.herokuapp.com/api/v1/rooms?room=${roomId}`;

  try {
    const { data } = await axios.get(url, config);
    
    const room = data.data;
    return room;
  } catch (error) {
    return;
  }
};

export default fetchRoomInfo;