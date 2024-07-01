<script setup>
import { ref, computed } from 'vue'
import { texToTypst } from 'tex-to-typst'

const DEFAULT_TEX = '\\frac{1}{4} \\sum_{i=1}^4 \\mathbf{P}_i^\\top \\sqrt{v} \\mathbf{\\Sigma}^{-1} \\sqrt{v} \\mathbf{P}_i \\mathbf{j} = \\mathbf{D}^\\top v \\phi'
const inputTex = ref(DEFAULT_TEX)
// const outputTypst = ref(texToTypst(DEFAULT_TEX))
const outputTypst = computed(() => texToTypst(inputTex.value))

function onChange(e) {
  inputTex.value = e.target.value
  console.log(texToTypst(inputTex.value))
  // outputTypst.value = texToTypst(inputTex.value)
}

</script>

<template>
  <div class="bg-app text-app-blue min-h-screen flex flex-col">
    <header>
    <h1 class="text-left text-4xl p-4">tex2typst</h1>
    </header>
    <div class="text-app-blue p-4 text-center">
        Tips: Press <code>Esc</code> key or click any blank area to convert your input.
    </div>

    <main class="flex flex-1 p-8">
      <div class="flex-1 flex flex-col border border-gray-700 rounded-lg">
        <div class="flex justify-between p-4 border-b border-gray-700">
          <span class="text-app-light-blue">Input language</span>
          <span class="text-app-light-blue">LaTeX</span>
        </div>
        <textarea class="flex-1 p-4" v-on:change="onChange">{{ inputTex }}</textarea>
      </div>

      <div class="flex-1 flex flex-col border border-gray-700 rounded-lg ml-8">
        <div class="flex justify-between p-4 border-b border-gray-700">
          <span class="text-app-light-blue">Output language</span>
          <span class="text-app-light-blue">Typst</span>
        </div>
        <div> {{ outputTypst }} </div>
      </div>
    </main>

    <footer class="bg-gray-800 p-4 text-center">
      <p class="text-white">Powered by <a href="https://github.com/curvenote/tex-to-typst" target="_blank">tex-to-typst</a></p>
      <p class="text-white">This is an open-source project. For more information, visit <a
          href="https://github.com/qwinsi/tex2typst-webapp" target="_blank">https://github.com/qwinsi/tex2typst-webapp</a>
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

.text-app-light-blue {
  color: #80B0D0;
}

</style>
