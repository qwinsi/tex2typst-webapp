<!-- Code from https://stackoverflow.com/questions/71608124/ -->
<script>
export default {
  name: "CopiedToast",
  props: {
    // This prop will be used to determine whether the snackbar should be shown or not
    showing: {
      type: Boolean,
      default: false
    }
  },
}
export const LIFETIME = 1300; // milliseconds
</script>

<template>
    <div :class="showing? 'snackbar show': 'snackbar hide'">Copied!</div>
</template>

<style scoped>
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