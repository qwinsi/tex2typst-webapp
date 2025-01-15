<script>
import ToggleSwitch from './ToggleSwitch.vue';
import packageJson from '../../package.json'

export default {
  name: "SettingsDialog",
  props: {
    initial: {
      type: Object,
      default: () => ({ showPreview: true, rememberDirection: true })
    }
  },
  methods: {
    open() {
      this.$el.showModal();
    },
    close() {
      const showPreview = this.$refs.switchShowPreview.checked;
      const rememberDirection = this.$refs.switchRememberDirection.checked;
      this.$el.close();
      this.$emit('newSettings', { showPreview, rememberDirection });
    },
  },
  computed: {
    version() {
      return packageJson.version;
    }
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
  <div class="flex flex-col p-4">
    <div class="flex-1 flex justify-between mb-4">
      <span>Show Preview</span>
      <ToggleSwitch ref="switchShowPreview" :initial="initial.showPreview" />
    </div>
    <div class="flex-1 flex justify-between mb-4">
      <span>Remember Direction</span>
      <ToggleSwitch ref="switchRememberDirection" :initial="initial.rememberDirection" />
    </div>
  </div>
  <br>
  <br>
  <br>
  <br>
  <br>
  <div class="text-center text-gray-500">
    tex2typst Web App version {{ version }}
  </div>
  <!--
  <div style="max-width: 90%; text-align: left; color:gray; font-size: small; margin-left: 10%;">
    (More customization features are under development...)
  </div>
  -->
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