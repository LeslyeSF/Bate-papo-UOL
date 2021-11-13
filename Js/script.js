let name_user;
let addressee = "Todos", type = "message";


function startchat(){
    name_user = document.querySelector(".inputscreen input");

    const promise = axios.post('https://mock-api.driven.com.br/api/v4/uol/participants', {name: name_user.value});
    
    promise.then(() => {
        const screen = document.querySelector(".inputscreen");
        screen.classList.add("minimize");

        stayonline();

        const messagepromisse = axios.get('https://mock-api.driven.com.br/api/v4/uol/messages');
        messagepromisse.then(message_users);
    });

    promise.catch((answer) => {
        const erro = document.querySelector(".inputscreen .erro");
        erro.classList.remove("minimize");
        alert(answer);
    });

    
    
}
function stayonline(){
    setInterval(() => {
        axios.post('https://mock-api.driven.com.br/api/v4/uol/status', {name: name_user.value});
    }, 4500);
}
function message_users(answer){
    const message = document.querySelector(".chatscreen");

    for(let i = 0; i < answer.data.length; i++){
        if(answer.data[i].type === 'status'){
            message.innerHTML +=`
            <div class="message in-out">
                    <div class="hour">(${answer.data[i].time})</div>
                    <div class="text"><span>${answer.data[i].from}</span> ${answer.data[i].text}</div>
            </div>
            `;
        } else if(answer.data[i].type === 'private_message'){
            message.innerHTML +=`
            <div class="message private">
                    <div class="hour">(${answer.data[i].time})</div>
                    <div class="text"><span>${answer.data[i].from}</span> reservadamente para <span>${answer.data[i].to}</span>: ${answer.data[i].text}</div>
            </div>
            `;
        } else{
            message.innerHTML +=`
            <div class="message">
                    <div class="hour">(${answer.data[i].time})</div>
                    <div class="text"><span>${answer.data[i].from}</span> para <span>${answer.data[i].to}</span>: ${answer.data[i].text}</div>
            </div>
            `;
        }
            
        
    }

}

function clickinput(input){
    if(!input.classList.contains("textinput")){
        input.classList.add("textinput");
        input.value = "";
    }
}