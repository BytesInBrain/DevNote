const axios = require('axios')

let authData = {
    "token":"sgdsgsdfdsfsdfsdf",
    "username": "sdfgsdgfdfdfdgdfgdfgdgdfg"
}


async function b(){
  axios.post('http://172.19.0.3:5000/auth/verify', {params : {authData}})
  .then((resp)=>{
    if(resp.status !== 200 && resp.data.data !== "Verified!"){
      res.statusCode = 203
      console.log("HIT")
      return
    }
    console.log(resp.data.userId);
  })
  .catch((error)=>{
    console.log(error);
  });
}

b()