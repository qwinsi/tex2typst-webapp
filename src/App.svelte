<script>
import { onMount } from 'svelte';
import katex from 'katex'
import { convertTex2Typst, convertTypst2Tex, customTexMacros } from './converter'
import { copyTextToClipboard } from '@qwinsi/utilities-js/clipboard'
import CopiedToast from './components/CopiedToast.svelte'
import SettingsDialog from './components/SettingsDialog.svelte'
import { getRandomFormula } from './random'
import { SettingsManager, DEFAULT_SETTINGS } from './settings';
import { version as APP_VERSION } from '../package.json';
import butterup from 'butteruptoasts';
import SwapIcon from './assets/SwapIcon.svelte';
// have to do this because butteruptoasts places CSS in wrong place
import '../node_modules/butteruptoasts/src/butterup.css';

const settingsManager = new SettingsManager('tex2typst-webapp-settings', DEFAULT_SETTINGS);
let settings = $state(settingsManager.loadSettings());

let inputStr = $state('');

function get_output(inputStr, settings) {
  try {
    const tex = inputStr;
    if(settings.directionToTypst) {
      const typst = convertTex2Typst(tex, {
        preferShorthands: settings.preferShorthands,
        fracToSlash: settings.texFracToTypstSlash,
        inftyToOo: settings.texInftyToTypstOo,
      });
      const macros_to_define = [];
      if(tex.includes('\\LaTeX')) {
        macros_to_define.push('#LaTeX');
      }
      if(tex.includes('\\TeX')) {
        macros_to_define.push('#TeX');
      }
      if(tex.includes('\\cancelto')) {
        macros_to_define.push('cancelto');
      }
      let messages = [];
      if(macros_to_define.length > 0) {
        const map = new Map([
          ['#LaTeX', 'the-latex-and-tex-macro'],
          ['#TeX', 'the-latex-and-tex-macro'],
          ['cancelto', 'the-cancelto-macro'],
        ]);
        for(const macro of macros_to_define) {
          const a_link = `<a href="impl-in-typst.html#${map.get(macro)}" target="_blank">${macro}</a>`;
          const msg = `&#x24D8; Define ${a_link} yourself as it's not supported in Typst.`;
          messages.push(msg);
        }
      }

      // show suggestion when the user try to write vertical bar for evaluation like "F(x) \bigg\rvert_a^b x"
      if(/\\bigg\s*(\\rvert|\\vert|\|)\s*_/.test(tex)) {
        const a_link = `<a href="impl-in-typst.html#a-vertical-bar-for-evaluation" target="_blank">vertical bar for evaluation</a>`;
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
        target: convertTypst2Tex(tex, {
          blockMathMode: settings.displayStyle,
        }),
        message: '',
      }
    }
  } catch (e) {
    console.error(e);
    let message =  `&#x24D8; [ERROR] `;
    if(e.name && e.name !== "Error") {
      message += `${e.name}: `;
    }
    if(e.message) {
      message += e.message;
    }
    return {
      target: '',
      message: message,
    }
  }
}

const output = $derived(get_output(inputStr, settings));

let inputArea = null;
let copiedToast = null;

function sendToClipboard() {
  if(inputStr === '') {
    return;
  }
  copyTextToClipboard(output.target).then(() => {
    copiedToast.trigger();
  });
}

let settingsDialog = null;

function handleSettingsClick() {
  settingsDialog.open();
}


function get_rendered_html(inputStr, output, settings) {
  const latex = settings.directionToTypst ? inputStr : output.target;
  if (latex === '') {
    return null;
  } else {
    const options = {
      macros: customTexMacros,
      displayMode: settings.displayStyle,
      output: 'html', // default is 'htmlAndMathml', which adds redundant invisible MathML stuff
      throwOnError: false,
      errorColor: '#bc6f17',
    }
    return katex.renderToString(latex, options)
  }
}

const renderedFormulaHtml = $derived(get_rendered_html(inputStr, output, settings));



function handleNewSettings(data) {
  settings = Object.assign({directionToTypst: settings.directionToTypst}, data);
}

function handleFlipDirection() {
  const outputStr = output.target;
  settings.directionToTypst = !settings.directionToTypst;
  inputStr = outputStr;
}


onMount(() => {
  inputArea.focus();

  // Enable ":active" pseudo-class on mobile safari. https://stackoverflow.com/q/3885018/
  if(/iPad|iPhone|iPod/.test(window.navigator.userAgent)) {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(btn => {
      btn.addEventListener('touchstart', function() {}, { passive: false });
    });
  }

  window.addEventListener('beforeunload', function () {
      settingsManager.saveSettings(settings);
  });

  butterup.options.toastLife = 999 * 24 * 3600 * 1000; // 999 days, basically never expire

  const channel = new BroadcastChannel('SW_MESSAGES');
  channel.addEventListener('message', event => {
    if(event.data.title === 'APP_UPDATE') {
        const new_version = event.data.version;
        if(new_version !== APP_VERSION) {
          const msg = `New version ${new_version} is available.
To use new version, close your browser then open again.
(Simply refreshing this tab won't take effect.)
          `;
          butterup.toast({
            title: 'Update Available',
            message: msg,
            location: 'top-right',
            type: 'info',
            icon: true,
            dismissable: true,
          });
        }
    }
  });
});

</script>

<nav class="flex justify-between">
  <h1 class="flex items-center ml-4 title">
    tex2typst
  </h1>
  <div class="flex">
    <a class="flex items-center mr-2 nav-btn" href="cheat-sheet.html" target="_blank">
      <img class="inline w-9 h-9" src="./icons/notebook-icon.svg" alt="Cheat sheet icon" />
      <span class="text-lg ml-2 mr-4 hide-on-mobile">Cheat Sheet</span>
    </a>
    <a class="flex items-center mr-2 nav-btn" href="https://github.com/qwinsi/tex2typst-webapp" target="_blank">
      <img class="inline w-9 h-9" src="./icons/github-mark-white.svg" alt="Github logo"/>
      <span class="text-lg ml-2 mr-4 hide-on-mobile">Open-source</span>
    </a>
    <button class="flex items-center mr-2 nav-btn" onclick={handleSettingsClick}>
      <img class="inline w-9 h-9" src="./icons/settings-icon.svg" alt="Settings icon" />
      <span class="text-lg ml-2 mr-4 hide-on-mobile">Settings</span>
    </button>
  </div>
</nav>

<div class="text-center app-text p-4 m-2">
  Convert math code of LaTeX to Typst and vice versa. All runs in your browser.
</div>

<main class="flex-1 flex flex-col justify-between ml-6 mr-6">
  <div class="flex justify-between p-2 border-b border-gray-700">
    <div class="flex-1 flex justify-between">
      <span class="app-text p-2">{ settings.directionToTypst? "LaTeX": "Typst" }</span>
      <div>
        <button class="mr-2 op-btn" onclick={() => {inputStr = getRandomFormula(settings.directionToTypst);}}>
          <span class="hide-on-mobile">Random</span>
          <span class="hide-on-desktop">R</span>
        </button>
        <button class="op-btn" onclick={() => {inputStr = '';}}>
          <span class="hide-on-mobile">Clear</span>
          <span class="hide-on-desktop">C</span>
        </button>
      </div>
    </div>

    <button class="pl-1 pr-1 ml-3 mr-3 op-btn" onclick={handleFlipDirection}>
      <SwapIcon />
    </button>

    <div class="flex-1 flex justify-between relative">
      <span class="app-text p-2">{ settings.directionToTypst? "Typst": "LaTeX" }</span>
        <button class="op-btn"
                onclick={sendToClipboard}>Copy</button>
        <CopiedToast style="position: absolute; top: -55px; right: -4px;" bind:this={copiedToast} msg="Copied!" />
    </div>
  </div>

  <!-- flex-row for desktop, flex-col for mobile -->
  <div class="flex-1 flex md:flex-row flex-col">
    <!-- input area -->
    <div class="flex-1 flex flex-col input-output-area">
      <textarea class="flex-1 code-block app-text p-4" bind:value={inputStr}
        spellcheck="false" bind:this={inputArea}></textarea>
    </div>

    <!-- output area -->
    <div class="flex-1 flex flex-col input-output-area">
      <div class="flex-1 flex flex-col" id="typst">
        <div class="flex-1 code-block p-4"> { output.target } </div>
        {#if output.message}
        <div class="h-20 app-text warning p-4"
          >{@html output.message}</div>
        {/if}
      </div>
    </div>
  </div>

</main>

<!-- items-center (i.e. style="align-items:center") is for vertical centering -->
<div class="flex items-center pb-4 min-h-28">
{#if settings.showPreview}
  {#if renderedFormulaHtml !== null}
    <div class="flex-1  text-center">{@html renderedFormulaHtml}</div>
  {:else}
    <div class="flex-1 text-center app-text">
      <span style="opacity: 0.6;">LaTeX math code will be rendered here.</span>
    </div>
  {/if}
{/if}
</div>

<footer class="p-4">
Dedicated to Typst enthusiasts with creative hearts
</footer>
<SettingsDialog bind:this={settingsDialog} newSettingsHandler={handleNewSettings} initial={settings} />

<style>
@import "tailwindcss";

:root {
  --color-app-text: #333333;
  --color-app-theme: #1F2937;
  --color-app-bg: #eeeeee;
}

:global(#app) {
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  background-color: var(--color-app-bg);
}

.title {
  height: --spacing(16); /* h-16 */

  /* text-4xl */
  font-size: var(--text-4xl);
  line-height: var(--text-4xl--line-height);

  color: white;

  user-select: none;
}

.nav-btn {
  padding: --spacing(2); /* p-2 */

  font-weight: var(--font-weight-medium);

  color: white;

  &:hover {
    background-color: var(--color-gray-900);
  }
}

.op-btn {
  padding: --spacing(2); /* p-2 */

  border-radius: var(--radius-lg); /* rounded-lg */

  color: #0D70B0;

  &:hover {
    background-color: var(--color-gray-300);
  }

  &:active {
    background-color: var(--color-gray-400);
  }
}


main {
  border: 1px solid var(--color-gray-700);
  border-radius: var(--radius-lg); /* rounded-lg */
}


nav, footer {
  background-color: var(--color-app-theme);
}

footer {
  text-align: center;

  font-style: italic;
  color: white;
}

.warning {
  border-top: 1px solid var(--color-yellow-700);
  border-radius: var(--radius-sm);

  background-color: #fdf8e4;

  /* text-sm */
  font-size: var(--text-sm);
  line-height: var(--text-sm--line-height);
}

.app-text {
  color: var(--color-app-text);
}

.input-output-area {
  min-height: 200px;

  border: 1px solid var(--color-gray-700);
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

/* html - How do I disable the resizable property of a textarea? - Stack Overflow
   https://stackoverflow.com/questions/5235142/how-do-i-disable-the-resizable-property-of-a-textarea
*/
textarea {
  resize: none;
}

.code-block {
  color: var(--color-app-text);

  font-family: Consolas, "Ubuntu Mono", Menlo, monospace;
  /* https://stackoverflow.com/questions/36260013/react-display-line-breaks-from-saved-textarea */
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
