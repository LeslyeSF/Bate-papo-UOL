let name_user;
function startchat(){
    name_user = document.querySelector(".inputscreen input");

    const promise = axios.post('https://mock-api.driven.com.br/api/v4/uol/participants', {name: name_user.value});
    
    promise.then(() => {
        const screen = document.querySelector(".inputscreen");
        screen.classList.add("minimize");
        stayonline();
    });

    promise.catch(() => {
        const erro = document.querySelector(".inputscreen .erro");
        erro.classList.remove("minimize");
    });
    
}
function stayonline(){
    setInterval(() => {axios.post('https://mock-api.driven.com.br/api/v4/uol/status', {name: name_user.value});}, 5000);
}

function clickinput(input){
    if(!input.classList.contains("textinput")){
        input.classList.add("textinput");
        input.value = "";
    }
}