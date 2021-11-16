let name_user;
let addressee = "Todos", type = "message", to = "Público", id = null;


function startchat(){
    name_user = document.querySelector(".inputscreen input").value;
    
    if(name_user.length > 2){
        const promise = axios.post('https://mock-api.driven.com.br/api/v4/uol/participants', {name: name_user});
        promise.then(() => {
            const screen = document.querySelector(".inputscreen");
            screen.classList.add("minimize");
    
            setInterval(stayonline, 5000);
            message_users();
            setInterval(message_users, 3000);
        });
    
        promise.catch((answer) => {
            const erro = document.querySelector(".inputscreen .erro");
            erro.innerHTML="Já existe um usuário online com esse nome";
            erro.classList.remove("minimize");
        });
    } else{
        const erro = document.querySelector(".inputscreen .erro");
        erro.innerHTML="O nome deve ter no mínimo 3 caracteres";
        erro.classList.remove("minimize");
    }

    
    
}
function stayonline(){
    const promise = axios.post('https://mock-api.driven.com.br/api/v4/uol/status', {name: name_user});
       // promise.then((answer) => {console.log(answer.data);});
        promise.catch((erro) => {
            console.log(erro.data);
            window.location.reload(true);
        });
}
function message_users(){
    const messagepromisse = axios.get('https://mock-api.driven.com.br/api/v4/uol/messages');
    messagepromisse.then((answer) => {
        const message = document.querySelector(".chatscreen");
        if(message.querySelector(".message") === null){
            input_messages(answer, message, 0);
        } else{
            let lastmessage_hour = document.querySelector(".message:last-child .hour").innerHTML;
            let number_message;
            for(let i = 0; i<answer.data.length; i++){
                if(lastmessage_hour === `(${answer.data[i].time})`){
                    number_message = i +1;
                }
            }
            input_messages(answer,message,number_message);
        }
        
        const lastmessage = document.querySelector(".message:last-child");
        lastmessage.scrollIntoView();
    });

    messagepromisse.catch((erro) => {
        console.log(erro.response);
        window.location.reload(true);
    });
}
function input_messages(answer, message,start){
    for(let i = start; i < answer.data.length; i++){
        if(answer.data[i].type === 'status'){
            message.innerHTML +=`
            <div class="message in-out" data-identifier="message">
                    <div class="hour">(${answer.data[i].time})</div>
                    <div class="text"><span>${answer.data[i].from}</span> ${answer.data[i].text}</div>
            </div>
            `;
        } else if(answer.data[i].type === 'private_message'){
            if(answer.data[i].to === name_user || answer.data[i].from == name_user){
                message.innerHTML +=`
                <div class="message private" data-identifier="message">
                        <div class="hour">(${answer.data[i].time})</div>
                        <div class="text"><span>${answer.data[i].from}</span> reservadamente para <span>${answer.data[i].to}</span>: ${answer.data[i].text}</div>
                </div>
                `;
            }
        } else{
            message.innerHTML +=`
            <div class="message" data-identifier="message">
                    <div class="hour">(${answer.data[i].time})</div>
                    <div class="text"><span>${answer.data[i].from}</span> para <span>${answer.data[i].to}</span>: ${answer.data[i].text}</div>
            </div>
            `;
        }
        
    }
}
function send_message(){

    const input = document.querySelector("footer div input");
    if(input.classList.contains("textinput")){
        const messagepromisse = axios.post('https://mock-api.driven.com.br/api/v4/uol/messages',{from: name_user, to: addressee, text:input.value, type: type });
        //messagepromisse.then((answer) => {console.log(answer.data);});
        messagepromisse.catch((erro) => {
            console.log(erro.response);
            window.location.reload(true);
        });
        input.value = "";
    }    
}
function users_area(){
    const screen_visibility = document.querySelector(".userscreen");
    screen_visibility.classList.toggle("minimize");
    participants_update();
    setInterval(participants_update, 10000);   
}
function participants_update(){
    const promise = axios.get('https://mock-api.driven.com.br/api/v4/uol/participants');
    promise.then((answer) => {
        let participants = document.querySelector(".participants");
        let name_selected = "Todos";
        if(document.querySelectorAll(".participants li").length > 1){
            name_selected = participants.querySelector(".selected p").innerHTML;
            participants.innerHTML = `
                <li onclick="selected(this, 'participants')" data-identifier="participant">
                    <ion-icon name="people" class="users"></ion-icon>
                    <p>Todos</p>
                    <ion-icon name="checkmark-outline" class="check"></ion-icon>
                </li>
            `;

        }
        for(let i = 0; i < answer.data.length; i++){
            if(answer.data[i].name !== name_user){
                participants.innerHTML += `
                <li onclick="selected(this, 'participants')" data-identifier="participant">
                    <ion-icon name="person-circle"></ion-icon>
                    <p>${answer.data[i].name}</p>
                    <ion-icon name="checkmark-outline" class="check"></ion-icon>
                </li>
                `;
            }
        }
        let verifycheck = document.querySelectorAll(".participants li");
        for(let i = 0; i<verifycheck.length; i++){
            if(name_selected === verifycheck[i].querySelector("p").innerHTML){
                verifycheck[i].classList.add("selected");
                addressee = name_selected;
            }
        }
        if(document.querySelector(".participants .selected") === null){
            document.querySelector(".participants li").classList.add("selected");
            addressee = "Todos";
            
        }

        document.querySelector(".participants .selected").scrollIntoView();
        const message_info = document.querySelector("footer p");
        message_info.innerHTML = `Enviando para ${addressee} (${to})`;
    });
    promise.catch((erro) => {console.log(erro.response)});

    //Caso particular
    if(addressee === "Todos"){
        selected(document.querySelector(".to li"), "to");
    }

}
function selected(selected, classname){
    const otherselected = document.querySelector("."+classname+" .selected");
    otherselected.classList.remove("selected");
    selected.classList.add("selected");

    addressee = document.querySelector(".participants .selected p").innerHTML;
    to = document.querySelector(".to .selected p").innerHTML;

    const message_info = document.querySelector("footer p");
    message_info.innerHTML = `Enviando para ${addressee} (${to})`;

    if(to === "Público"){
        type = "message";
    } else{
        type = "private_message";
    }
    
}
function clickinput(input){
    if(!input.classList.contains("textinput")){
        input.classList.add("textinput");
        input.value = "";
    }
}

document.addEventListener("keypress", (buttom) =>{
    if(buttom.key == "Enter"){
        if(!(document.querySelector(".inputscreen").classList.contains("minimize"))){
            document.querySelector(".inputscreen button").click();
        } else{
            document.querySelector("footer ion-icon").click();
        }
    }
});