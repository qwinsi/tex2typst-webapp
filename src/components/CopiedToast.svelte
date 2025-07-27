<!-- Code from https://stackoverflow.com/questions/71608124/ -->
<script>
let { msg = "Copied", style } = $props();;
let visible = $state(false);


const LIFETIME = 1300; // milliseconds

// javascript - Svelte - access child component's method - Stack Overflow
// https://stackoverflow.com/questions/61333755/svelte-access-child-components-method
export function trigger() {
    visible = true;
    setTimeout(() => {
        visible = false;
    }, LIFETIME);
}

</script>

<div style={style} class={visible? 'snackbar show': 'snackbar hide'}>{ msg }</div>

<style>
.snackbar {
    color: #fff;
    background-color: #333;
    min-width: 50px;
    border-radius: 2px;
    padding: 10px;
    text-align: center;
    font-size: 0.75em;
    border-radius: 6px;
}

/* This will be activated when the snackbar's class is 'show' which will be added through JS */
.snackbar.show {
    visibility: visible;
    opacity: 1;
    animation: fadein 0.5s, fadeout 0.5s 0.8s;
}

.snackbar.hide {
    visibility: hidden;
}

/* Animations for fading in and out */
@keyframes fadein {
    from {opacity: 0;}
    to {opacity: 1;}
}

@keyframes fadeout {
    from {opacity: 1;}
    to {opacity: 0;}
}
</style>