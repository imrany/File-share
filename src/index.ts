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

window.addEventListener('beforeinstallprompt',(e:any) => {
    const btn = document.querySelector('#install') as HTMLButtonElement
    btn.style.display="block"
    btn.onclick =()=> {
        e.prompt()
        btn.style.display="none"
    };
    return e.preventDefault();
});

export {
    loader
}