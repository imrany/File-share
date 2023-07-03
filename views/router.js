const route = (event) => {
    event = event || window.event;
    event.preventDefault();
    window.history.pushState({}, "", event.target.href);
    handleLocation();
};

window.addEventListener("DOMContentLoaded",(e)=>{
    window.document.body.
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
window.route = route;

handleLocation();
