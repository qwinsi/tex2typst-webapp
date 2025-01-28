<script>
import ToggleSwitch from './ToggleSwitch.vue';
import { version as APP_VERSION } from '../../package.json';

export default {
  name: "SettingsDialog",
  props: {
    initial: {
      type: Object,
      default: () => ({ 
        showPreview: true,
        displayStyle: true,
        rememberDirection: true,
        texFracToTypstSlash: true,
      })
    }
  },
  methods: {
    open() {
      this.$el.showModal();
    },
    close() {
      const showPreview = this.$refs.switchShowPreview.checked;
      const displayStyle = this.$refs.switchDisplayStyle.checked;
      const rememberDirection = this.$refs.switchRememberDirection.checked;
      const texFracToTypstSlash = this.$refs.switchTexFracToTypstSlash.checked;
      this.$el.close();
      this.$emit('newSettings', { showPreview, displayStyle, rememberDirection, texFracToTypstSlash });
    },
  },
  data() {
    return {
      appVersion: APP_VERSION
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
  <div class="flex flex-col pl-4 pr-4">
    <fieldset class="flex-1 flex flex-col border border-gray-300 p-4 mb-2">
      <legend>Previewer</legend>
      <div class="flex-1 flex justify-between mb-4">
        <label>Show Preview</label>
        <ToggleSwitch ref="switchShowPreview" :initial="initial.showPreview" />
      </div>
      <div class="flex-1 flex justify-between">
        <label>
          Display Style
          <span title="Display style is used to render mathematical expressions in a more readable way. &#10;For example, subscripts and superscripts of \sum or \prod are rendered above and below the base symbol.">&#x24D8;</span>
        </label>
        <ToggleSwitch ref="switchDisplayStyle" :initial="initial.displayStyle" />
      </div>
    </fieldset>
    <fieldset class="flex-1 flex flex-col border border-gray-300 p-4 mb-2">
      <legend>Translator</legend>
      <div class="flex-1 flex justify-between mb-4">
        <label>Remember Direction</label>
        <ToggleSwitch ref="switchRememberDirection" :initial="initial.rememberDirection" />
      </div>
      <div class="flex-1 flex justify-between">
        <label>
          <code>\frac</code> to slash
          <span title=" On: LaTeX \frac{a}{b} to Typst a/b&#10;Off: LaTeX \frac{a}{b} to Typst frac(a,b)">&#x24D8;</span>
        </label>
        <ToggleSwitch ref="switchTexFracToTypstSlash" :initial="initial.texFracToTypstSlash" />
      </div>
    </fieldset>
  </div>
  <div class="text-center text-gray-500">
    tex2typst Web App version {{ appVersion }}
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