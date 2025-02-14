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
          <!-- 
            Browsers redner the '\n' in <span titie="A \n B"> as a space, so we need to use '&#10;' instead.
            But the Svelte compiler will replace '&#10;' with a space in the final output,
            so here we use @html to prevent the compiler from making any modifications.
            This is embarrassing.
          -->
          {@html `<span title="Display style is used to render mathematical expressions in a more readable way. &#10;For example, subscripts and superscripts of \\sum or \\prod are rendered above and below the base symbol.">&#x24D8;</span>`}
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
          {@html `<span title=" On: LaTeX \\frac{a}{b} to Typst a/b&#10;Off: LaTeX \\frac{a}{b} to Typst frac(a,b)">&#x24D8;</span>`}
        </label>
        <ToggleSwitch bind:this={switchTexFracToTypstSlash} initial={initial.texFracToTypstSlash} />
      </div>
    </fieldset>
  </div>
  <div class="flex ml-6 mb-2 text-sm">
    <span>Problems?</span>
    &nbsp;&nbsp;
    <a href="https://github.com/qwinsi/tex2typst-webapp/issues/new" target="_blank">Write an issue to us!</a>
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

<style scoped>
a {
  color: #0000EE;
  text-decoration: underline;
}
</style>