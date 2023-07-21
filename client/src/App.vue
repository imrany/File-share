<script setup lang="ts">
  import HomeView from "./views/LayoutView.vue"
  import UploadDialog from "./components/ui/Dialog/Upload.vue"
  import CreateDialog from "./components/ui/Dialog/CreateFolder.vue"
</script>

<template>
  <HomeView/>
  <UploadDialog/>
  <CreateDialog/>
</template>
