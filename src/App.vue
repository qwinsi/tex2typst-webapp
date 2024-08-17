<script setup>
import { ref, computed, onMounted } from 'vue'
import katex from 'katex'
import { convertTex2Typst, customTexMacros } from './converter'
import { copyTextToClipboard } from './clipboard'
import CopiedToast, { LIFETIME } from './CopiedToast.vue'


const DEFAULT_TEX = '\\prod_{p} \\frac{1}{1-p^{-s}}= \\sum _{n=1}^{\\infty} \\frac{1}{n^s}'
const inputTex = ref(DEFAULT_TEX)
const output = computed(() => {
  try {
    const tex = inputTex.value;
    const macros_to_define = [];
    if(tex.includes('\\mathscr')) {
      macros_to_define.push('scr');
    } 
    if(tex.includes('\\LaTeX')) {
      macros_to_define.push('#LaTeX');
    }
    if(tex.includes('\\TeX')) {
      macros_to_define.push('#TeX');
    }
    let msg = '';
    if(macros_to_define.length > 0) {
      const map = new Map([
        ['scr', 'mathscr'],
        ['#LaTeX', 'latex-and-tex'],
        ['#TeX', 'latex-and-tex'],
      ]);
      if(macros_to_define.length === 1) {
        const macro = macros_to_define[0];
        const a_link = `<a href="impl-in-typst.html#${map.get(macro)}" target="_blank">${macro}</a>`;
        msg = `&#x24D8; Define ${a_link} yourself as it's not supported in Typst. Click the link to see the definition code.`
      } else {
        const a_links = macros_to_define.map(macro => {
          return `<a href="impl-in-typst.html#${map.get(macro)}" target="_blank">${macro}</a>`;
        });
        msg = `&#x24D8; Define ${a_links.join(', ')} yourself as they're not supported in Typst. Click the link for the definition code.`
      }
    }
    return {
      typst: convertTex2Typst(tex),
      message: msg,
    }
  } catch (e) {
    return {
      typst: '',
      message: '&#x24D8; [ERROR: Invalid LaTeX code]',
    }
  }
})

const renderedFormulaHtml = computed(() => {
  if (inputTex.value === '') {
    return '<div><span style="opacity: 0.6;">Math formula will be rendered here.</span></div>'
  } else {
    const options = {
      macros: customTexMacros,
      displayMode: true,
      throwOnError: false,
      errorColor: '#bc6f17'
    }
    return katex.renderToString(inputTex.value, options)
  }
})

const copiedToastShowing = ref(false);
function triggerToast() {
  copiedToastShowing.value = true;

  setTimeout(() => { copiedToastShowing.value = false }, LIFETIME);
}

async function sendToClipboard() {
  if(inputTex.value === '') {
    return;
  }
  const ok = await copyTextToClipboard(output.value.typst);
  if(ok) {
    triggerToast();
  } else {
    alert('Failed to copy to clipboard. Please report this issue.');
  }
}

const inputArea = ref(null);
const renderArea = ref(null);

onMounted(function() {
  if (inputArea.value) {
    inputArea.value.select();
  }

  if (renderArea.value) {
    // To prevent the renderArea collapsing when the input is empty,
    // we set the min-height as the initial height for DEFAULT_TEX
    const height = renderArea.value.clientHeight;
    renderArea.value.style.minHeight = height + 'px';
  }

  // Enable ":active" pseudo-class on mobile safari. https://stackoverflow.com/q/3885018/
  if(/iPad|iPhone|iPod/.test(window.navigator.userAgent)) {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(btn => {
      btn.addEventListener('touchstart', function() {}, { passive: false });
    });
  }
});

</script>

<template>
  <div class="bg-app text-app-blue min-h-screen flex flex-col">
    <nav class="theme-app flex justify-between text-white">
      <h1 class="flex items-center h-16 ml-4">
        <span class="text-4xl">tex2typst</span>
      </h1>
      <a class="flex items-center font-medium p-2 hover:bg-gray-900" href="https://github.com/qwinsi/tex2typst-webapp" target="_blank">
        <img class="inline h-9" src="./assets/github-mark-white.svg" alt="Github log logo" />
        <span class="text-lg ml-2 mr-4">Open-source</span>
      </a>
    </nav>
    <div class="text-center text-app-blue p-4">
      Convert LaTeX math formula code to <a href="https://typst.app/" target="_blank">Typst</a> code!
      <br />
      This tool runs locally in your browser. Nothing is uploaded.
    </div>

    <!-- flex-row for desktop, flex-col for mobile -->
    <main class="flex-1 flex md:flex-row flex-col p-4">
      <div class="flex-1 flex flex-col border border-gray-700 min-h-[200px] rounded-lg m-2">
        <div class="flex justify-between p-2 border-b border-gray-700">
          <span class="text-app-blue p-2">LaTeX code</span>
          <div>
            <button class="text-app-light-black p-2 rounded-lg hover:bg-gray-300 active:bg-gray-400"
                    v-on:click="inputTex=''">Clear</button>
          </div>
        </div>
        <textarea ref="inputArea" class="flex-1 text-app-light-black p-4" v-model="inputTex" spellcheck="false"></textarea>
      </div>

      <div class="flex-1 flex flex-col border border-gray-700 min-h-[200px] rounded-lg m-2">
        <div class="flex justify-between p-2 border-b border-gray-700">
          <span class="text-app-blue p-2">Typst code</span>
          <div class="relative">
            <button class="text-app-light-black p-2 rounded-lg hover:bg-gray-300 active:bg-gray-400"
                    v-on:click="sendToClipboard">Copy</button>
            <CopiedToast id="copiedToast" :showing="copiedToastShowing" />
          </div>
        </div>
        <div class="flex-1 flex flex-col" id="typst">
          <div class="flex-1 text-app-light-black p-4"> {{ output.typst }} </div>
          <div class="h-20 text-sm text-app-light-black theme-warning border-t rounded border-yellow-700 p-4" v-if="output.message" v-html="output.message"></div>
        </div>
      </div>
    </main>


    <!-- items-center (i.e. style="align-items:center") is for vertical centering -->
    <div ref="renderArea" class="flex items-center text-center text-app-light-black p-4">
      <div class="flex-1" v-html="renderedFormulaHtml"></div>
    </div>

    <footer class="theme-app text-center p-4">
      <p class="text-white">Powered by <a href="https://github.com/qwinsi/tex2typst"
          target="_blank">tex2typst</a></p>
    </footer>
  </div>
</template>

<style>
.bg-app {
  background-color: #eeeeee;
}

.theme-app {
  background-color: #1F2937;
}

.theme-warning {
  background-color: #fdf8e4;
}

.text-app-blue {
  color: #0D70B0;
}

.text-app-light-black {
  color: #333333;
}

#typst a {
  font-weight: bold;
  text-decoration: underline !important;
}

#typst a:link, #typst a:visited { 
  color: #0000EE !important;
}

#typst a:link:active, #typst a:visited:active {
  color: #FF0000 !important;
}


/* https://stackoverflow.com/questions/36260013/react-display-line-breaks-from-saved-textarea */
#typst {
  white-space: pre-line;
}

#copiedToast {
  position: absolute;
  top: -55px;
  right: -4px;
}
</style>
