function navigateTo(event){
    window.history.pushState({}, "", event.target.href);
    handleLocation();
};

document.addEventListener("DOMContentLoaded",()=>{
    document.body.addEventListener("click",(e)=>{
        if(e.target.matches("[data-link]")){
            e.preventDefault()
            navigateTo(e)
        }
    })
})

const routes = {
    404: "/pages/404.html",
    "/": "/pages/index.html",
    "/sender": "/pages/sender.html",
    "/receiver": "/pages/receiver.html",
};

const handleLocation = async () => {
    const path = window.location.pathname;
    const route = routes[path] || routes[404];
    const html = await fetch(route).then((data) => data.text());
    document.getElementById("root").innerHTML = html;
};

window.onpopstate = handleLocation;
window.route = navigateTo;

handleLocation();
