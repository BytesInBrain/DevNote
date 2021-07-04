const apiURL = "http://192.168.1.200:5001/notebook/"
const username = localStorage.getItem("username");
function addCard(id,title,description){
    var template =  `<article class="card" id="${id}">
    <header class="card-header">
      <h2 class="card-title">${title}</h2>
    </header>
    <div class="card-content">${description}</div>
    <img id="notebookEbtn" src="static/svg/edit.svg" alt="Logo" style="width:25px;height:25px;" />
  </article>`
   let cs = document.getElementById("card-section");
   cs.innerHTML += template;
}
async function populateNotebooks(){
    await fetch(apiURL+"all/"+username,{
        method:"get",
        headers:{
            "Authorization" : "Bearer "+bearer
        }
    }).then(res => res.json())
    .then(data => {
        for(i in data){
            addCard(data[i]._id,data[i].title,data[i].description)
        }
    })
    //Event Listner for Card clicks
    var goToNotebook = document.getElementsByClassName("card");
    for(var i = 0 ; i < goToNotebook.length; i++){
    goToNotebook[i].addEventListener("click",function(event){
        console.log(event)
        if(event.path[0].nodeName === "ARTICLE"){
            sessionStorage.setItem("notebookId",event.path[0].id)
            window.location = "/note.html"
        }else if(event.path[1].nodeName === "ARTICLE"){
            sessionStorage.setItem("notebookId",event.path[1].id)
            window.location = "/note.html"
        }else if(event.path[2].nodeName === "ARTICLE"){
            sessionStorage.setItem("notebookId",event.path[2].id)
            window.location = "/note.html"
        }
    },false)
}}
populateNotebooks();
function addNotebookModal(){
    document.getElementById("anbm").style.display = "block";
}
function closeAddNotebookModal(){
    document.getElementById("anbmtitle").value = "";
    document.getElementById("anbmdesc").value = "";
    document.getElementById("anbm").style.display = "none";
}

async function submitAddNotebookModal(){
    let title = document.getElementById("anbmtitle").value;
    let description = document.getElementById("anbmdesc").value;
    await fetch(apiURL+username,{
        method:"post",
        headers:{
            "Content-Type": "application/json; charset=utf-8",
            "Authorization" : "Bearer "+bearer
        },
        body:JSON.stringify({title,description})
    }).then(res => res.json())
    .then(data => {
        let insertedId = data.data.insertedId;
        addCard(insertedId,title,description)
        let addedCard = document.getElementById(insertedId);
        addedCard.addEventListener("click",function(event){
            console.log(event)
            if(event.path[0].nodeName === "ARTICLE"){
                sessionStorage.setItem("notebookId",event.path[0].id)
                window.location = "/note.html"
            }else if(event.path[1].nodeName === "ARTICLE"){
                sessionStorage.setItem("notebookId",event.path[1].id)
                window.location = "/note.html"
            }else if(event.path[2].nodeName === "ARTICLE"){
                sessionStorage.setItem("notebookId",event.path[2].id)
                window.location = "/note.html"
            }
        },false)
    })
    closeAddNotebookModal();
    // location.reload();
}
function logout(){
    localStorage.clear();
    sessionStorage.clear();
    window.location = "/login.html";
}


