import { receiver } from "./static/js/receiver.js";
import { sender } from "./static/js/sender.js";

export function switches(routes){
    switch (`/pages${location.pathname}.html`) {
        case routes["/"]:
            console.log(`home`)
            break;
        case routes["/sender"]:
            setTimeout(() => {
                sender.handleForm(document.querySelector("form"))
                console.log("form ready")
            }, 100);
            break;
        case routes["/receiver"]:
            receiver()
            break;
    }
}