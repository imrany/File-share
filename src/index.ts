import { useToast } from "vue-toast-notification";

// export const origin="http://localhost:8080"
export const origin='https://fireshare-server.onrender.com'

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
        window.addEventListener("online",()=>{
            
        })
        const btn = document.querySelector('#update') as HTMLDivElement
        btn.style.display="block"
        btn.onclick =()=> {
            // "site-static"
            update_cache("site-dynamic")
            // localStorage.setItem("version",)
            btn.style.display="none"
        };
        return e.preventDefault();
    });
}

function update_cache(name:string) {
    caches.delete(name).then((m:any)=>{
        console.log(m)
        window.location.reload()
    }).catch((err:any)=>{
        alert(err.message)
    })
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

function share_app(){
    if (navigator.share) {
        navigator.share({
          title: 'Fileshare',
          text: 'Check out Fileshare',
          url: 'https://file-shareio.web.app/',
        })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    }
}
export {
    allow_notifications,
    install_function,
    update_function,
    share_app,
    loader
}