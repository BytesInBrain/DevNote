const md = require('markdown-it')()
  .use(require('markdown-it-highlightjs'));
  const DOMPurify = require('dompurify');
var saveUpdatedNote;
function setBuffer(status){
  if(status=='typing'){
    let buf = document.getElementById("saveStatus")
    buf.innerHTML = '<svg height="25px" viewBox="0 0 512 512" width="25px" xmlns="http://www.w3.org/2000/svg"><path d="m512 256c0 141.386719-114.613281 256-256 256s-256-114.613281-256-256 114.613281-256 256-256 256 114.613281 256 256zm0 0" fill="#e76e54"/><path d="m384 256c0 70.691406-57.308594 128-128 128s-128-57.308594-128-128 57.308594-128 128-128 128 57.308594 128 128zm0 0" fill="#dd523c"/></svg>'
  }if(status=='saved'){
    let buf = document.getElementById("saveStatus")
    buf.innerHTML = '<svg height="25px" viewBox="0 0 512 512" width="25px" xmlns="http://www.w3.org/2000/svg"><path d="m512 256c0 141.386719-114.613281 256-256 256s-256-114.613281-256-256 114.613281-256 256-256 256 114.613281 256 256zm0 0" fill="#addb31"/><path d="m199.503906 358.335938-110.449218-107.488282 68.65625-66.816406 41.792968 40.671875 138.785156-135.039063 68.65625 66.816407zm0 0" fill="#fff"/><g fill="#6fbb2e"><path d="m144 384h96c8.835938 0 16 7.164062 16 16s-7.164062 16-16 16h-96c-8.835938 0-16-7.164062-16-16s7.164062-16 16-16zm0 0"/><path d="m288 384h32v32h-32zm0 0"/><path d="m352 384h32v32h-32zm0 0"/></g></svg>'
  }
}
function convert() {
  let editorC = document.getElementById("editorContent").value;
  console.log(editorC);
  let html = md.render(editorC);
  let sanitized = DOMPurify.sanitize(html);
  document.getElementById("liveEditor").innerHTML = sanitized;
}
async function saveNote(){
  let content = document.getElementById("editorContent").value;
  if(currentNoteId == '' || currentNoteId == undefined || currentNoteId == null){
    return
  }
  await fetch(apiURL+username,{
    method:"put",
    headers:{
        "Content-Type": "application/json; charset=utf-8",
        "Authorization" : "Bearer "+bearer
    },
    body:JSON.stringify({
      "noteId":currentNoteId,
      content
    })
    }).then(res => res.json())
    .then(data => {
    if(data.data != "Updated!"){
      alert("Notes Not Saved.Please contact Developer")
      return
    }
    setBuffer('saved')
    })
}

var editorC = document.getElementById("editorContent");
editorC.addEventListener('keyup',function(event){
    clearTimeout(saveUpdatedNote)
    setBuffer('typing')
    convert()
    saveUpdatedNote = setTimeout(function(){saveNote()},2000)
});
