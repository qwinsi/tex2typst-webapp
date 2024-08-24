<script>
import { ref } from 'vue';
import ToggleSwitch from './ToggleSwitch.vue';

export default {
  name: "SettingsDialog",
  props: {
    initial: {
      type: Object,
      default: () => ({ optionShowPreview: true })
    }
  },
  methods: {
    open() {
      this.$el.showModal();
    },
    close() {
      const optionShowPreview = this.$refs.toggleSwitch.checked;
      this.$el.close();
      this.$emit('newSettings', { optionShowPreview });
    },
  },
  expose: ['open', 'close'],
  emits: ['newSettings'],
  components: {
    ToggleSwitch
  }
}
</script>

<template>
<dialog class="min-h-80 min-w-80 bg-white rounded-lg shadow-lg">
  <div class="flex justify-between items-center p-4">
    <h2>Settings</h2>
    <button class="text-xl" v-on:click="close()">✕</button>
  </div>
  <div class="flex justify-between items-center p-4">
    <span>Show Preview</span>
    <ToggleSwitch ref="toggleSwitch" :initial="initial.optionShowPreview" />
  </div>
  <br>
  <br>
  <br>
  <br>
  <br>
  <div style="max-width: 90%; text-align: left; color:gray; font-size: small; margin-left: 10%;">

    (More customization features are under development...)
  </div>
</dialog>
</template>

<style scoped>
/*
dialog {
  animation: fade-out 0.7s ease-out;
}

dialog[open] {
  animation: fade-in 0.5s ease-out;
}

dialog[open]::backdrop {
  animation: backdrop-fade-in 0.5s ease-out forwards;
}


@keyframes fade-in {
  0% {
    opacity: 0;
    transform: scaleY(0);
    display: none;
  }

  100% {
    opacity: 1;
    transform: scaleY(1);
    display: block;
  }
}

@keyframes fade-out {
  0% {
    opacity: 1;
    transform: scaleY(1);
    display: block;
  }

  100% {
    opacity: 0;
    transform: scaleY(0);
    display: none;
  }
}

@keyframes backdrop-fade-in {
  0% {
    background-color: rgb(0 0 0 / 0%);
  }

  100% {
    background-color: rgb(0 0 0 / 25%);
  }
}
*/
</style>