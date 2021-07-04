function addNote(id,title,description){
    var template = `<article id="${id}"><div class="notes-items">
    <div class="note-content">
    <span>${title}</span>
      <div class="note-desc">
        <span>${description}</span>
      </div>
    </div>
    <img onclick="loadNote(\'${id}\')" id="noteEbtn" src="static/svg/right-arrow.svg" alt="Logo" style="width:25px;height:25px;" />
    <img onclick="editNote(\'${id}\',\'${title}\',\'${description}\')" id="noteEbtn" src="static/svg/edit.svg" alt="Logo" style="width:25px;height:25px;" />
    </div></article>`
    let cs = document.getElementById("notes-list");
    cs.innerHTML += template;
}
async function loadNote(noteId){
    console.log("loadNoteCalled");
    currentNoteId = noteId;
    await fetch(apiURL+username+"/id",{
        method:"post",
        headers:{
            "Content-Type": "application/json; charset=utf-8",
            "Authorization" : "Bearer "+bearer
        },
        body:JSON.stringify({noteId})
    }).then(res => res.json())
    .then(data => {
        console.log(data.data.title)
        document.getElementById("editorContent").value = data.data.content;
        document.getElementById("note-title").innerHTML = data.data.title;
        document.getElementById("editorContent").dispatchEvent(new KeyboardEvent("keyup"));
    })
}
async function populateNote(){
    await fetch(apiURL+"all/"+username,{
        method:"post",
        headers:{
            "Content-Type": "application/json; charset=utf-8",
            "Authorization" : "Bearer "+bearer
        },
        body:JSON.stringify({notebookId})
    }).then(res => res.json())
    .then(data => {
        console.log(data)
        for(i in data){
            addNote(data[i]._id,data[i].title,data[i].description)
        }
    })
}
populateNote();
function addNoteModal(){
    document.getElementById("anm").style.display = "block";
}
function closeAddNoteModal(){
    document.getElementById("anmtitle").value = "";
    document.getElementById("anmdesc").value = "";
    document.getElementById("anm").style.display = "none"
}

function closeUpdateNoteModal(){
    document.getElementById("enmtitle").value = "";
    document.getElementById("enmdesc").value = "";
    document.getElementById("enm").style.display = "none";
}
function editNote(id,title,desc){
    document.getElementById("enm").style.display = "block";
    document.getElementById("enmtitle").value = title;
    document.getElementById("enmdesc").value = desc;
    currentEditNoteId = id;
}

async function submitAddNoteModal(){
    let title = document.getElementById("anmtitle").value;
    let description = document.getElementById("anmdesc").value;
    await fetch(apiURL+username,{
        method:"post",
        headers:{
            "Content-Type": "application/json; charset=utf-8",
            "Authorization" : "Bearer "+bearer
        },
        body:JSON.stringify({notebookId,title,description})
    }).then(res => res.json())
    .then(data => {
        console.log(data)
        addNote(data.data._id,data.data.title,data.data.description);
    })
    closeAddNoteModal();
    // location.reload();
}
async function submitUpdateNoteModal(){
    let title = document.getElementById("enmtitle").value;
    let description = document.getElementById("enmdesc").value;
    await fetch(apiURL+username,{
        method:"put",
        headers:{
            "Content-Type": "application/json; charset=utf-8",
            "Authorization" : "Bearer "+bearer
        },
        body:JSON.stringify({"noteId":currentEditNoteId,title,description})
    }).then(res => res.json())
    .then(data => {
        if(data.data != "Updated!"){
            alert("Not Updated.Please contact developer!")
        }else{
            let note = document.getElementById(currentEditNoteId)
            note.childNodes[0].childNodes[1].childNodes[3].childNodes[1].textContent = description
            note.childNodes[0].childNodes[1].childNodes[1].textContent = title
            let iimg = document.createElement('img');
            iimg.onclick = function(){return editNote(currentEditNoteId,title,description)};
            iimg.id = "noteEbtn";
            iimg.src="static/svg/edit.svg";
            iimg.alt="Logo" ;
            iimg.style="width:25px;height:25px;";
            note.childNodes[0].childNodes[5].replaceWith(iimg)
        }
    })
    closeUpdateNoteModal();
    // location.reload();
}
function logout(){
    localStorage.clear();
    sessionStorage.clear();
    window.location = "/login.html";
}
function redirectToNotebooks(){
    sessionStorage.clear();
    window.location = "/home.html";
}
var editorToggle = true
function toggleEditor(){
    if(editorToggle){
        document.getElementById("handsEditor").style.display = "none"
        document.getElementById("togglelive").style.width = "100%"
        editorToggle = false
    }else{
        document.getElementById("handsEditor").style.display = "block"
        document.getElementById("togglelive").style.width = "50%"
        editorToggle = true
    }
}


function addMarkdown(id){
    console.log(id)
    let mdcursor = document.getElementById("editorContent").selectionStart
    let mdcontent = document.getElementById("editorContent").value
    console.log(mdcursor)
    console.log(mdcontent)
    if(id=="simage"){
        let replace = mdcontent.slice(0,mdcursor)+"![Alt text](http://192.168.1.106:5000/api/v1/image/)"+mdcontent.slice(mdcursor)
        document.getElementById("editorContent").value = replace
    }else if(id == "sblock"){
        let replace = mdcontent.slice(0,mdcursor)+"> "+mdcontent.slice(mdcursor)
        document.getElementById("editorContent").value = replace
    }else if(id == "stable"){
        let elem = "|   |   |" + "\n" +"| --- | --- |" + "\n" + "|   |   |"
        let replace = mdcontent.slice(0,mdcursor)+elem+mdcontent.slice(mdcursor)
        document.getElementById("editorContent").value = replace
    }else if(id == "slist"){
        let replace = mdcontent.slice(0,mdcursor)+"- "+mdcontent.slice(mdcursor)
        document.getElementById("editorContent").value = replace
    }else if(id == "scode"){
        let elem = "```"+"\n\n"+"```"
        let replace = mdcontent.slice(0,mdcursor)+elem+mdcontent.slice(mdcursor)
        document.getElementById("editorContent").value = replace
    }else if(id == "slink"){
        let replace = mdcontent.slice(0,mdcursor)+"[text](link)"+mdcontent.slice(mdcursor)
        document.getElementById("editorContent").value = replace
    }

}