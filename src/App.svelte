<script>
import { onMount } from 'svelte';
import katex from 'katex'
import { convertTex2Typst, convertTypst2Tex, customTexMacros } from './converter'
import { copyTextToClipboard } from '@qwinsi/utilities-js/clipboard'
import CopiedToast from './components/CopiedToast.svelte'
import SettingsDialog from './components/SettingsDialog.svelte'
import { getRandomFormula } from './random'

let directionToTypst = true;

let settings = {
  showPreview: true,
  displayStyle: true,
  rememberDirection: true,
};


let inputStr = '';

function get_output(inputStr, settings) {
  try {
    const tex = inputStr;
    if(directionToTypst) {
      const typst = convertTex2Typst(tex, { fracToSlash: settings.texFracToTypstSlash });
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
      let messages = [];
      if(macros_to_define.length > 0) {
        const map = new Map([
          ['scr', 'mathscr'],
          ['#LaTeX', 'latex-and-tex'],
          ['#TeX', 'latex-and-tex'],
        ]);
        for(const macro of macros_to_define) {
          const a_link = `<a href="impl-in-typst.html#${map.get(macro)}" target="_blank">${macro}</a>`;
          const msg = `&#x24D8; Define ${a_link} yourself as it's not supported in Typst.`;
          messages.push(msg);
        }
      }

      // show suggestion when the user try to write vertical bar for evaluation like "F(x) \bigg\rvert_a^b x"
      if(/\\bigg\s*(\\rvert|\\vert|\|)\s*_/.test(tex)) {
        const a_link = `<a href="impl-in-typst.html#vertical-bar-for-evaluation" target="_blank">vertical bar for evaluation</a>`;
        messages.push(`&#x24D8; Did you mean ${a_link}?`);
      }
      let final_msg = '';
      if(messages.length > 0) {
        messages.push('Click the link for the details.');
        final_msg = messages.join('<br />');
      }
      return {
        target: typst,
        message: final_msg,
      }
    } else {
      // convert Typst to LaTeX
      return {
        target: convertTypst2Tex(tex),
        message: '',
      }
    }
  } catch (e) {
    console.error(e);
    return {
      target: '',
      message: `&#x24D8; [ERROR: Invalid ${directionToTypst? 'LaTeX': 'Typst'} code]`,
    }
  }
}

$: output = get_output(inputStr, settings);

let inputArea = null;
let copiedToast = null;

async function sendToClipboard() {
  if(inputStr === '') {
    return;
  }
  const ok = await copyTextToClipboard(output.target);
  if(ok) {
    copiedToast.trigger();
  } else {
    alert('Failed to copy to clipboard. Please report this issue.');
  }
}

let settingsDialog = null;

function handleSettingsClick() {
  settingsDialog.open();
}


function get_rendered_html(directionToTypst, inputStr, output, settings) {
  const latex = directionToTypst ? inputStr : output.target;
  if (latex === '') {
    return '<div><span style="opacity: 0.6;">LaTeX math formula will be rendered here.</span></div>'
  } else {
    const options = {
      macros: customTexMacros,
      displayMode: settings.displayStyle,
      throwOnError: false,
      errorColor: '#bc6f17'
    }
    return katex.renderToString(latex, options)
  }
}

$: renderedFormulaHtml = get_rendered_html(directionToTypst, inputStr, output, settings);



function handleNewSettings(data) {
  settings = data.detail;
  localStorage.setItem('settings', JSON.stringify(data.detail));
}

function handleFlipDirection() {
  const outputStr = output.target;
  directionToTypst = !directionToTypst;
  inputStr = outputStr;
}


onMount(() => {
  const settingsStr = localStorage.getItem('settings');
  if(settingsStr) {
    settings = Object.assign(settings, JSON.parse(settingsStr));
  }
  if(settings.rememberDirection && localStorage.getItem('lastDirection')) {
    directionToTypst = localStorage.getItem('lastDirection') !== 'false';
  }

  inputArea.focus();

  // Enable ":active" pseudo-class on mobile safari. https://stackoverflow.com/q/3885018/
  if(/iPad|iPhone|iPod/.test(window.navigator.userAgent)) {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(btn => {
      btn.addEventListener('touchstart', function() {}, { passive: false });
    });
  }

  window.addEventListener('beforeunload', function() {
    localStorage.setItem('lastDirection', directionToTypst.toString());
  });

});

</script>

  <div class="bg-app text-app-blue min-h-screen flex flex-col">
    <nav class="theme-app flex justify-between text-white">
      <h1 class="flex items-center h-16 ml-4 select-none">
        <span class="text-4xl">tex2typst</span>
      </h1>
      <div class="flex">
        <a class="flex items-center font-medium p-2 mr-2 hover:bg-gray-900" href="cheat-sheet.html" target="_blank">
          <img class="inline w-9 h-9" src="./icons/notebook-icon.svg" alt="Cheat sheet icon" />
          <span class="text-lg ml-2 mr-4 hide-on-mobile">Cheat Sheet</span>
        </a>
        <a class="flex items-center font-medium p-2 mr-2 hover:bg-gray-900" href="https://github.com/qwinsi/tex2typst-webapp" target="_blank">
          <img class="inline w-9 h-9" src="./icons/github-mark-white.svg" alt="Github logo"/>
          <span class="text-lg ml-2 mr-4 hide-on-mobile">Open-source</span>
        </a>
        <button class="flex items-center font-medium p-2 mr-2 hover:bg-gray-900" on:click={handleSettingsClick}>
          <img class="inline w-9 h-9" src="./icons/settings-icon.svg" alt="Settings icon" />
          <span class="text-lg ml-2 mr-4 hide-on-mobile">Settings</span>
        </button>
      </div>
    </nav>
    <div class="text-center text-app-light-black p-4 m-2">
      Convert LaTeX math formula code to Typst and vice versa. All running in your browser.
    </div>

    <main class="flex-1 flex flex-col justify-between ml-6 mr-6 border border-gray-700 rounded-lg">
      <div class="flex justify-between p-2 border-b border-gray-700">
        <div class="flex-1 flex justify-between">
          <span class="text-app-light-black p-2">{ directionToTypst? "LaTeX": "Typst" }</span>
          <div>
            <button class="text-app-blue p-2 mr-2 rounded-lg hover:bg-gray-300 active:bg-gray-400"
              on:click={() => {inputStr = getRandomFormula(directionToTypst);}}>
              <span class="hide-on-mobile">Random</span>
              <span class="hide-on-desktop">R</span>
            </button>
            <button class="text-app-blue p-2 rounded-lg hover:bg-gray-300 active:bg-gray-400"
              on:click={() => {inputStr = '';}}>
              <span class="hide-on-mobile">Clear</span>
              <span class="hide-on-desktop">C</span>
            </button>
          </div>
        </div>

        <button class="pl-1 pr-1 rounded-lg ml-3 mr-3 hover:bg-gray-300 active:bg-gray-400" on:click={handleFlipDirection}>
          <svg class="inline" data-inline-src="assets/swap-icon.svg" alt="Swap icon" />
        </button>

        <div class="flex-1 flex-1 flex justify-between relative">
          <span class="text-app-light-black p-2">{ directionToTypst? "Typst": "LaTeX" }</span>
            <button class="text-app-blue p-2 rounded-lg hover:bg-gray-300 active:bg-gray-400"
                    on:click={sendToClipboard}>Copy</button>
            <CopiedToast style="position: absolute; top: -55px; right: -4px;" bind:this={copiedToast} msg="Copied!" />
        </div>
      </div>

      <!-- flex-row for desktop, flex-col for mobile -->
      <div class="flex-1 flex md:flex-row flex-col">
        <!-- input area -->
        <div class="flex-1 flex flex-col border border-gray-700 min-h-[200px]">
          <textarea class="flex-1 text-app-light-black p-4" bind:value={inputStr}
            spellcheck="false" bind:this={inputArea}></textarea>
        </div>

        <!-- output area -->
        <div class="flex-1 flex flex-col border border-gray-700 min-h-[200px]">
          <div class="flex-1 flex flex-col" id="typst">
            <div class="flex-1 text-app-light-black p-4"> { output.target } </div>
            {#if output.message}
            <div class="h-20 text-sm text-app-light-black theme-warning border-t rounded border-yellow-700 p-4"
              >{@html output.message}</div>
            {/if}
          </div>
        </div>
      </div>

    </main>

    <!-- items-center (i.e. style="align-items:center") is for vertical centering -->
    <div class="flex items-center text-center text-app-light-black pb-4 min-h-28">
      {#if settings.showPreview}
      <div class="flex-1">{@html renderedFormulaHtml}</div>
      {/if}
    </div>

    <footer class="theme-app text-center p-4">
      <p class="text-white">Powered by <a href="https://github.com/qwinsi/tex2typst"
          target="_blank">tex2typst.js</a></p>
    </footer>
  </div>
  <SettingsDialog bind:this={settingsDialog} on:newSettings={handleNewSettings} initial={settings} />

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


:global(#typst) :global(a) {
  font-weight: bold;
  text-decoration: underline !important;
}

:global(#typst) :global(a):link,
:global(#typst) :global(a):visited {
  color: #0000EE !important;
}

:global(#typst) :global(a):link:active,
:global(#typst) :global(a):visited:active {
  color: #FF0000 !important;
}

/* https://stackoverflow.com/questions/36260013/react-display-line-breaks-from-saved-textarea */
#typst {
  white-space: pre-line;
}


@media (max-width: 500px) {
  .hide-on-mobile {
    display: none;
  }
}

@media (min-width: 501px) {
  .hide-on-desktop {
    display: none;
  }
}
</style>
