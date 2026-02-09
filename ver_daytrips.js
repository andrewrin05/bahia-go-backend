const axios = require('axios');

axios.get('http://192.168.1.18:8085/daytrips')
  .then(res => {
    console.log(JSON.stringify(res.data, null, 2));
  })
  .catch(err => {
    console.error('Error:', err.message);
  });
