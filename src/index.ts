import { useToast } from "vue-toast-notification";

const toast=useToast()
const loader={
    on(){
        const loader=document.querySelector('.preload') as HTMLDivElement;
        loader.style.display='block';
    },
    off(){
        const loader=document.querySelector('.preload') as HTMLDivElement;
        loader.style.display='none';
    }
}

const successCallback=(position:any)=>{
    const {latitude, longitude}= position.coords;
    console.log(latitude,longitude)
}
const errorCallback=(error:any)=>{
    console.log(error.message);
}
navigator.geolocation.getCurrentPosition(successCallback, errorCallback);


//checking and asking permission
if(Notification.permission === 'granted'){
    //showNotification();
 }else if(Notification.permission !== 'denied'){
     Notification.requestPermission().then(permission =>{
         if(permission === "granted"){
             //showNotification();
         }
     });
 };

function install_function(){
    window.addEventListener('beforeinstallprompt',(e:any) => {
        const btn = document.querySelector('#install') as HTMLButtonElement
        btn.style.display="block"
        btn.onclick =()=> {
            e.prompt()
            btn.style.display="none"
        };
        return e.preventDefault();
    });
}

function update_function(){
    window.addEventListener('appinstalled',(e:any) => {
        const btn = document.querySelector('#update') as HTMLDivElement
        btn.style.display="block"
        btn.onclick =()=> {
            e.prompt()
            btn.style.display="none"
        };
        return e.preventDefault();
    });
}

const allow_notifications=()=>{
    if(Notification.permission === 'granted'){
        //showNotification();
        window.location.pathname="/notifications"
    }else if(Notification.permission !== 'denied'){
        Notification.requestPermission().then(permission =>{
            if(permission === "granted"){
                //showNotification();
                window.location.pathname="/notifications"
            }
        });
    }else if(Notification.permission === 'denied'){
        toast.info("Turn on your notifications!!",{
            position:"top-right",
            duration:5000
        })
    };
}
export {
    allow_notifications,
    install_function,
    update_function,
    loader
}