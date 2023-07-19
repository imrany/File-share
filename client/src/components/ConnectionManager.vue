<script>
import { socket } from "@/socket";

export default {
  name: "ConnectionManager",

  methods: {
    connect() {
      socket.connect();
    },
    disconnect() {
      socket.disconnect();
    }
  }
}
</script>

<template>
    <div class="">
        <button @click="connect()">Connect</button>
        <button @click="disconnect()">Disconnect</button>
    </div>
</template>
