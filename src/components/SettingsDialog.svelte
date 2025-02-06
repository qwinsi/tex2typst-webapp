<script>
import { createEventDispatcher } from 'svelte';
import ToggleSwitch from './ToggleSwitch.svelte';
import { version as APP_VERSION } from '../../package.json';

export let initial = {
  showPreview: true,
  displayStyle: true,
  rememberDirection: true,
  texFracToTypstSlash: true,
};

let switchShowPreview = null;
let switchDisplayStyle = null;
let switchRememberDirection = null;
let switchTexFracToTypstSlash = null;

let selfRef = null;

const dispatch = createEventDispatcher();

export function open() {
  selfRef.showModal();
}

function close() {
  const showPreview = switchShowPreview.checked();
  const displayStyle = switchDisplayStyle.checked();
  const rememberDirection = switchRememberDirection.checked();
  const texFracToTypstSlash = switchTexFracToTypstSlash.checked();
  selfRef.close();
  dispatch('newSettings', { showPreview, displayStyle, rememberDirection, texFracToTypstSlash });
}
</script>

<dialog bind:this={selfRef} class="min-h-80 min-w-80 bg-white rounded-lg shadow-lg">
  <div class="flex justify-between items-center p-4">
    <h2>Settings</h2>
    <button class="text-xl" on:click={close}>✕</button>
  </div>
  <div class="flex flex-col pl-4 pr-4">
    <fieldset class="flex-1 flex flex-col border border-gray-300 p-4 mb-2">
      <legend>Previewer</legend>
      <div class="flex-1 flex justify-between mb-4">
        <label>Show Preview</label>
        <ToggleSwitch bind:this={switchShowPreview} initial={initial.showPreview} />
      </div>
      <div class="flex-1 flex justify-between">
        <label>
          Display Style
          <span title="Display style is used to render mathematical expressions in a more readable way. &#10;For example, subscripts and superscripts of \sum or \prod are rendered above and below the base symbol.">&#x24D8;</span>
        </label>
        <ToggleSwitch bind:this={switchDisplayStyle} initial={initial.displayStyle} />
      </div>
    </fieldset>
    <fieldset class="flex-1 flex flex-col border border-gray-300 p-4 mb-2">
      <legend>Translator</legend>
      <div class="flex-1 flex justify-between mb-4">
        <label>Remember Direction</label>
        <ToggleSwitch bind:this={switchRememberDirection} initial={initial.rememberDirection} />
      </div>
      <div class="flex-1 flex justify-between">
        <label>
          <code>\frac</code> to slash
          <span title={" On: LaTeX \frac{a}{b} to Typst a/b&#10;Off: LaTeX \frac{a}{b} to Typst frac(a,b)"}>&#x24D8;</span>
        </label>
        <ToggleSwitch bind:this={switchTexFracToTypstSlash} initial={initial.texFracToTypstSlash} />
      </div>
    </fieldset>
  </div>
  <div class="text-center text-gray-500">
    tex2typst Web App version { APP_VERSION }
  </div>
  <!--
  <div style="max-width: 90%; text-align: left; color:gray; font-size: small; margin-left: 10%;">
    (More customization features are under development...)
  </div>
  -->
</dialog>

<style>
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