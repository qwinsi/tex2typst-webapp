<script setup>
import { ref, computed, onMounted } from 'vue'
import katex from 'katex'
import { convertTex2Typst, customTexMacros } from './converter'
import { copyTextToClipboard } from './clipboard'


const DEFAULT_TEX = '\\prod_{p} \\frac{1}{1-p^{-s}}= \\sum _{n=1}^{\\infty} \\frac{1}{n^s}'

const inputTex = ref(DEFAULT_TEX)
const outputTypst = computed(() => {
  try {
    return convertTex2Typst(inputTex.value)
  } catch (e) {
    return '[ERROR: Invalid LaTeX code]'
  }
})

const renderedFormulaHtml = computed(() => {
  if (inputTex.value === '') {
    return '<div>Math formula will be rendered here.</div>'
  } else {
    return katex.renderToString(inputTex.value, { macros: customTexMacros, displayMode: true, throwOnError: false })
  }
})

function sendToClipboard() {
  copyTextToClipboard(outputTypst.value)
}

const inputArea = ref(null);

onMounted(function() {
  if (inputArea.value) {
    inputArea.value.select();
  }
});

</script>

<template>
  <div class="bg-app text-app-blue min-h-screen flex flex-col">
    <header>
      <h1 class="text-left text-4xl p-4">tex2typst</h1>
    </header>
    <div class="text-app-blue p-4 text-center">
      Covert LaTeX math formula code to <a href="https://typst.app/" target="_blank">Typst</a> code!
      <br />
      This tool runs locally in your browser. Nothing is uploaded.
    </div>

    <main class="flex flex-1 p-8">
      <div class="flex-1 flex flex-col border border-gray-700 rounded-lg">
        <div class="flex justify-between p-4 border-b border-gray-700">
          <span class="text-app-blue">LaTeX code</span>
          <button class="text-app-light-black" v-on:click="inputTex=''">Clear</button>
        </div>
        <textarea ref="inputArea" class="flex-1 p-4 text-app-light-black" v-model="inputTex"></textarea>
      </div>

      <div class="flex-1 flex flex-col border border-gray-700 rounded-lg ml-8">
        <div class="flex justify-between p-4 border-b border-gray-700">
          <span class="text-app-blue">Typst code</span>
          <button class="text-app-light-black" v-on:click="sendToClipboard">Copy</button>
        </div>
        <div class="flex-1 p-4 text-app-light-black" id="typst"> {{ outputTypst }} </div>
      </div>
    </main>


    <div class="p-4 text-center text-app-light-black">
      <div v-html="renderedFormulaHtml"></div>
    </div>

    <footer class="bg-gray-800 p-4 text-center">
      <p class="text-white">Powered by <a href="https://github.com/qwinsi/tex2typst"
          target="_blank">tex2typst</a></p>
      <p class="text-white">This is an open-source project. For more information, visit <a
          href="https://github.com/qwinsi/tex2typst-webapp"
          target="_blank">https://github.com/qwinsi/tex2typst-webapp</a>
      </p>
    </footer>

  </div>
</template>

<style scoped>
.bg-app {
  background-color: #eeeeee;
}

.text-app-blue {
  color: #0D70B0;
}

.text-app-light-black {
  color: #333333;
}


/* https://stackoverflow.com/questions/36260013/react-display-line-breaks-from-saved-textarea */
#typst {
  white-space: pre-line;
}
</style>
