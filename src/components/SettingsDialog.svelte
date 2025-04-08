<script>
import { createEventDispatcher } from 'svelte';
import ToggleSwitch from './ToggleSwitch.svelte';
import { version as APP_VERSION } from '../../package.json';
import { DEFAULT_SETTINGS } from '../default-settings';

export let initial = Object.assign({}, DEFAULT_SETTINGS);

let switchShowPreview = null;
let switchDisplayStyle = null;
let switchRememberDirection = null;
let switchPreferShorthands = null;
let switchTexFracToTypstSlash = null;
let switchtexInftyToTypstOo = null;

let selfRef = null;

const dispatch = createEventDispatcher();

export function open() {
  selfRef.showModal();
}

function close() {
  const showPreview = switchShowPreview.checked();
  const displayStyle = switchDisplayStyle.checked();
  const rememberDirection = switchRememberDirection.checked();
  const preferShorthands = switchPreferShorthands.checked();
  const texFracToTypstSlash = switchTexFracToTypstSlash.checked();
  const texInftyToTypstOo = switchtexInftyToTypstOo.checked();
  selfRef.close();
  dispatch('newSettings', { 
    showPreview, displayStyle, rememberDirection,
    preferShorthands,
    texFracToTypstSlash, texInftyToTypstOo
  });
}

function resetToDefault() {
  switchShowPreview.setChecked(DEFAULT_SETTINGS.showPreview);
  switchDisplayStyle.setChecked(DEFAULT_SETTINGS.displayStyle);
  switchRememberDirection.setChecked(DEFAULT_SETTINGS.rememberDirection);
  switchPreferShorthands.setChecked(DEFAULT_SETTINGS.preferShorthands);
  switchTexFracToTypstSlash.setChecked(DEFAULT_SETTINGS.texFracToTypstSlash);
  switchtexInftyToTypstOo.setChecked(DEFAULT_SETTINGS.texInftyToTypstOo);
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
        <span>Show Preview</span>
        <ToggleSwitch bind:this={switchShowPreview} initial={initial.showPreview} />
      </div>
      <div class="flex-1 flex justify-between">
        <span>
          Display Style
          <!-- 
            Browsers redner the '\n' in <span titie="A \n B"> as a space, so we need to use '&#10;' instead.
            But the Svelte compiler will replace '&#10;' with a space in the final output,
            so here we use @html to prevent the compiler from making any modifications.
            This is embarrassing.
          -->
          {@html `<span title="Display style is used to render mathematical expressions in a more readable way. &#10;For example, subscripts and superscripts of \\sum or \\prod are rendered above and below the base symbol.">&#x24D8;</span>`}
        </span>
        <ToggleSwitch bind:this={switchDisplayStyle} initial={initial.displayStyle} />
      </div>
    </fieldset>
    <fieldset class="flex-1 flex flex-col border border-gray-300 p-4 mb-2">
      <legend>Translator</legend>
      <div class="flex-1 flex justify-between mb-4">
        <span>Remember Direction</span>
        <ToggleSwitch bind:this={switchRememberDirection} initial={initial.rememberDirection} />
      </div>
      <div class="flex-1 flex justify-between mb-4">
        <span>
          Prefer Shorthands
          {@html `<span title=" On: LaTeX a \\rightarrow b to Typst a -> b&#10;Off: LaTeX a \\rightarrow b to Typst a arrow.r b&#10;(This option doesn't include the rule of \\infty to oo)">&#x24D8;</span>`}
        </span>
        <ToggleSwitch bind:this={switchPreferShorthands} initial={initial.preferShorthands} />
      </div>
      <div class="flex-1 flex justify-between mb-4">
        <span>
          <code>\frac</code> toslash
          {@html `<span title=" On: LaTeX \\frac{a}{b} to Typst a/b&#10;Off: LaTeX \\frac{a}{b} to Typst frac(a,b)">&#x24D8;</span>`}
        </span>
        <ToggleSwitch bind:this={switchTexFracToTypstSlash} initial={initial.texFracToTypstSlash} />
      </div>
      <div class="flex-1 flex justify-between">
        <span>
          <code>\infty</code> to <code>oo</code>
          {@html `<span title=" On: LaTeX \\infty to Typst oo&#10;Off: LaTeX \\infty to Typst infinity">&#x24D8;</span>`}
        </span>
        <ToggleSwitch bind:this={switchtexInftyToTypstOo} initial={initial.texInftyToTypstOo} />
      </div>
    </fieldset>
  </div>
  <div class="flex justify-end p-2">
    <button class="bg-gray-300 text-black px-2 py-1 rounded mr-6" on:click={resetToDefault}><span>&olarr;</span> Reset to Default</button>
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