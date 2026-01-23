<script>
import ToggleSwitch from './ToggleSwitch.svelte';
import { version as APP_VERSION } from '../../package.json';
import { version as TEX2TYPST_VERSION } from '../../node_modules/tex2typst/package.json';
import { DEFAULT_SETTINGS } from '../settings.js';

let {
  states,
  newSettingsHandler
} = $props();

// let states = $state(initial);

let selfRef = null;


export function open() {
  selfRef.showModal();
}

function close() {
  selfRef.close();
  newSettingsHandler(states);
}

function resetToDefault() {
  for(const key in states) {
    states[key] = DEFAULT_SETTINGS[key];
  }
}
</script>

<dialog bind:this={selfRef} class="min-h-80 min-w-80 bg-white rounded-lg shadow-lg">
  <div class="flex justify-between items-center p-4">
    <h2>Settings</h2>
    <button class="text-xl" onclick={close}>✕</button>
  </div>
  <div class="flex flex-col pl-4 pr-4">
    <fieldset class="flex-1 flex flex-col border border-gray-300 p-4 mb-2">
      <legend>Previewer</legend>
      <div class="flex-1 flex justify-between mb-4">
        <span>Show LaTeX Preview</span>
        <ToggleSwitch bind:checked={states.showLatexPreview} />
      </div>
      <div class="flex-1 flex justify-between mb-4">
        <span>Show Typst Preview
          {@html `<span title="It may take a while for the first time to preview Typst&#10;because of loading Typst previewer (about 15MB) from the Internet.">&#x24D8;</span>`}
        </span>
        <ToggleSwitch bind:checked={states.showTypstPreview} />
      </div>
      <div class="flex-1 flex justify-between">
        <span>
          Display Style
          <!--
            Browsers render the '\n' in <span titie="A \n B"> as a space, so we need to use '&#10;' instead.
            But the Svelte compiler will replace '&#10;' with a space in the final output,
            so here we use @html to prevent the compiler from making any modifications.
            This is embarrassing.
          -->
          {@html `<span title="Display style is used to render mathematical expressions in a more readable way. &#10;For example, subscripts and superscripts of \\sum or \\prod are rendered above and below the base symbol.">&#x24D8;</span>`}
        </span>
        <ToggleSwitch bind:checked={states.displayStyle} />
      </div>
    </fieldset>
    <fieldset class="flex-1 flex flex-col border border-gray-300 p-4 mb-2">
      <legend>Translator</legend>
      <div class="flex-1 flex justify-between mb-4">
        <span>Remember Direction</span>
        <ToggleSwitch bind:checked={states.rememberDirection} />
      </div>
      <div class="flex-1 flex justify-between mb-4">
        <span>
          Prefer Shorthands
          {@html `<span title=" On: LaTeX a \\rightarrow b to Typst a -> b&#10;Off: LaTeX a \\rightarrow b to Typst a arrow.r b&#10;(This option doesn't include the rule of \\infty to oo)">&#x24D8;</span>`}
        </span>
        <ToggleSwitch bind:checked={states.preferShorthands} />
      </div>
      <div class="flex-1 flex justify-between mb-4">
        <span>
          <code>\frac</code> to slash
          {@html `<span title=" On: LaTeX \\frac{a}{b} to Typst a/b&#10;Off: LaTeX \\frac{a}{b} to Typst frac(a,b)">&#x24D8;</span>`}
        </span>
        <ToggleSwitch bind:checked={states.texFracToTypstSlash} />
      </div>
      <div class="flex-1 flex justify-between">
        <span>
          <code>\infty</code> to <code>oo</code>
          {@html `<span title=" On: LaTeX \\infty to Typst oo&#10;Off: LaTeX \\infty to Typst infinity">&#x24D8;</span>`}
        </span>
        <ToggleSwitch bind:checked={states.texInftyToTypstOo} />
      </div>
    </fieldset>
  </div>
  <div class="flex justify-end p-2">
    <button class="bg-gray-300 text-black px-2 py-1 rounded mr-6" onclick={resetToDefault}><span>&olarr;</span> Reset to Default</button>
  </div>
  <div class="flex-1 flex justify-between ml-6 mr-6 text-gray-500">
    <span>tex2typst Web App version</span> <span>{ APP_VERSION }</span>
  </div>
  <div class="flex-1 flex justify-between ml-6 mr-6 text-gray-500">
    <span>tex2typst.js version</span> <span>{ TEX2TYPST_VERSION }</span>
  </div>
  <div class="flex ml-6 mb-2 p-2 text-sm">
    <span>Problems?</span>
    &nbsp;&nbsp;
    <a href="https://github.com/qwinsi/tex2typst-webapp/issues/new" target="_blank">Write an issue to us!</a>
  </div>
  <!--
  <div style="max-width: 90%; text-align: left; color:gray; font-size: small; margin-left: 10%;">
    (More customization features are under development...)
  </div>
  -->
</dialog>

<style>
dialog {
  margin: auto; /* <dialog> is centered by default. But Tailwind's CSS reset (margin: 0) breaks this default feature. */
}

a {
  color: #0000EE;
  text-decoration: underline;
}
</style>