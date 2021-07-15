
<template>
  <div>
    <button
      type="button"
      v-on:click="show = !show"
      class="
        block
        text-gray-800
        hover:text-gray-700
        focus:text-gray-700
        focus:outline-none
        transition
        duration-300
      "
    >
      <svg class="h-6 w-6 fill-current" viewBox="0 0 24 24">
        <path
          class="hidden"
          d="M16.24 14.83a1 1 0 0 1-1.41 1.41L12 13.41l-2.83 2.83a1 1 0 0 1-1.41-1.41L10.59 12 7.76 9.17a1 1 0 0 1 1.41-1.41L12 10.59l2.83-2.83a1 1 0 0 1 1.41 1.41L13.41 12l2.83 2.83z"
        />
        <path
          d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
        />
      </svg>
    </button>
    <transition :name="animation">
      <div
        :class="'bg-' + color + '-400'"
        class="
          dropdown-menu
          text-white
          mt-8
          rounded
          absolute
          z-10
          shadow-lg
          w-60
          max-w-xs
        "
        v-if="show"
      >
        <ul class="list-none overflow-hidden rounded-lg">
          <li v-for="item in items" :key="item">
            <a
              href=""
              class="flex py-2 px-4 transition duration-300"
              :class="'theme-' + color + ' hover:bg-' + color + '-500'"
              >{{ item }}</a
            >
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "drop-down",
  data() {
    return {
      show: false,
    };
  },
  props: {
    color: String,
    animation: String,
    items: Array,
  },
};
</script>

<style>
/* button {
  cursor: pointer;
  &:focus {
    outline: none;
  }
} */

/* Animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

/* Slide-in-up animation*/
.slide-in-up-enter-active,
.slide-in-up-leave-active {
  transition: all 0.5s;
  transform: translateY(0);
}
.slide-in-up-enter,
.slide-in-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* Slide-in-right animation*/
.slide-in-right-enter-active,
.slide-in-right-leave-active {
  transition: all 0.5s;
  transform: translateX(0);
}
.slide-in-right-enter,
.slide-in-right-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

/* Slide-in-left animation*/
.slide-in-left-enter-active,
.slide-in-left-leave-active {
  transition: all 0.5s;
  transform: translateX(0);
}
.slide-in-left-enter,
.slide-in-left-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* Scale animation*/
.scale-enter-active,
.scale-leave-active {
  transition: all 0.5s;
  transform: scale(1);
}
.scale-enter,
.scale-leave-to {
  opacity: 0;
  transform: scale(0);
}

/* Rotate animation*/
.rotate-enter-active,
.rotate-leave-active {
  transition: all 0.5s;
  transform: scale(1) rotate(-360deg);
}
.rotate-enter,
.rotate-leave-to {
  opacity: 0;
  transform: scale(0) rotate(360deg);
}
</style>