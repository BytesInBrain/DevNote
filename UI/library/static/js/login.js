
const url = "http://192.168.1.200:5000/auth/"

/*===== LOGIN SHOW and HIDDEN =====*/
const signUp = document.getElementById('sign-up'),
    signIn = document.getElementById('sign-in'),
    loginIn = document.getElementById('login-in'),
    loginUp = document.getElementById('login-up')
signUp.addEventListener('click', ()=>{
    // Remove classes first if they exist
    loginIn.classList.remove('block')
    loginUp.classList.remove('none')

    // Add classes
    loginIn.classList.toggle('none')
    loginUp.classList.toggle('block')
})

signIn.addEventListener('click', ()=>{
    // Remove classes first if they exist
    loginIn.classList.remove('none')
    loginUp.classList.remove('block')

    // Add classes
    loginIn.classList.toggle('block')
    loginUp.classList.toggle('none')
})

let signup = document.getElementById("jSignUp")
let signin = document.getElementById("jSignIn")

signup.addEventListener("click",(e)=>{
    register()
})
signin.addEventListener("click",(e)=>{
    login()
})

function login(){
    let user = document.getElementById("loginUser").value
    let pass = document.getElementById("loginPass").value
    if (!ValidateEmail(user)){
        alert("Please Enter a Valid Email")
        return
    }
    fetch(url+"login", {
    headers: { "Content-Type": "application/json; charset=utf-8" },
    method: 'POST',
    body: JSON.stringify({
    email: user,
    password: pass,
  })
}).then(res => res.json())
  .then(data => {
      if(data.token){
          localStorage.setItem("bearer",data.token);
          localStorage.setItem("username",data.username);
          window.location.href = "/home.html"
      }else{
          alert("Please try again with correct Credentials!")
      }
  })
}
function register(){
    let user = document.getElementById("registerUser").value
    let email = document.getElementById("registerEmail").value
    let pass = document.getElementById("registerPass").value
    if (!ValidateEmail(email)){
        alert("Please Enter a Valid Email")
        return
    }
    fetch(url+"register", {
    headers: { "Content-Type": "application/json; charset=utf-8" },
    method: 'POST',
    body: JSON.stringify({
    username: user,
    email: email,
    password: pass,
  })
}).then(res => res.json())
.then(data => {
    if(data.Data == "success"){
        loginIn.classList.remove('none')
        loginUp.classList.remove('block')
        loginIn.classList.toggle('block')
        loginUp.classList.toggle('none')
    }else{
        alert("Username or Email already Exists!")
        
    }
})
}
function ValidateEmail(mail) 
{
 if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail))
  {
    return (true)
  }
    return (false)
}
function JustUse(){
    localStorage.setItem("bearer","false")
}

















