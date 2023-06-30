const root=document.getElementById("root")
const socket = io("/");

root.innerHTML=`
<div class="container">
    <h1>Share Files your your peers</h1>

    <a href="./pages/sender.html" style="margin-top: 20px;" target="_blank">Send</a>
    <a href="./pages/receiver.html" style="margin-top: 20px;" target="_blank">Receive</a>
</div>
`