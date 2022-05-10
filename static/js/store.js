
async function popup(tit,res){
    const popup = document.getElementById("popup-container")
    const res1 = document.getElementById("res")
    const title = document.getElementById("title")
    res1.innerHTML = res
    title.innerHTML = tit
    popup.style.display = "flex";
}


async function get_configs(){
    let i = false;
    try {document.getElementById("repair").value=window.localStorage.getItem("repair%"); i=true;}catch{console.log(""); i=false;}
    try {document.getElementById("energy").value=window.localStorage.getItem("energy%"); i=true;}catch{console.log(""); i=false;}
    try {document.getElementById("fww").value=window.localStorage.getItem("fww"); i=true;}catch{console.log(""); i=false;}
    try {document.getElementById("fwf").value=window.localStorage.getItem("fwf"); i=true;}catch{console.log(""); i=false;}
    try {document.getElementById("fwg").value=window.localStorage.getItem("fwg"); i=true;}catch{console.log(""); i=false;}

    if (i == true){
        popup("We got your back!", "We loaded your previous configurations.")
    }
}

