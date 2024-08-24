<!-- Code from https://www.w3schools.com/howto/howto_css_switch.asp -->
<script>
export default {
    name: "ToggleSwitch",
    props: {
        initial: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            checked: false
        }
    },
    created() {
        this.checked = this.initial;
    },
    expose: ['checked']
}
</script>

<template>
<label class="switch">
  <input type="checkbox" v-model="checked">
  <span class="slider round"></span>
</label>
</template>

<style scoped>
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch input { 
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .3s;
  transition: .3s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .3s;
  transition: .3s;
}

input:checked + .slider {
  background-color: #4ed164;
}

input:focus + .slider {
  box-shadow: 0 0 1px #4ed164;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>