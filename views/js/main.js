const root=document.getElementById("root")
const socket = io("/");

root.innerHTML=`
<div class="container">
    <h1>Share Files your peers</h1>

    <a href="./pages/sender.html" style="margin-top: 20px;">Send</a>
    <a href="./pages/receiver.html" style="margin-top: 20px;">Receive</a>
</div>
`