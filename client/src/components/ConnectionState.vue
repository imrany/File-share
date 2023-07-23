<script lang="ts" setup>
import { state } from "@/socket";

const connected=state.connected;
</script>

<template>
  <p>State: {{ connected }}</p>
</template>
