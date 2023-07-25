<script lang="ts" setup>
import { socket } from "@/socket";

function connect() {
  socket.connect();
  console.log(socket)
}
function disconnect() {
  socket.disconnect();
}
</script>

<template>
    <div class="">
        <button @click="connect()">Connect</button>
        <button @click="disconnect()">Disconnect</button>
    </div>
</template>
