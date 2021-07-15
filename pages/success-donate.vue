<template>
  <div>
    <div class="py-12 h-screen bg-gray-50">
      <div
        class="
          max-w-md
          mx-auto
          bg-white
          rounded-xl
          shadow-md
          overflow-hidden
          md:max-w-md
        "
      >
        <div class="md:flex">
          <div class="w-full p-3 py-10">
            <div class="flex justify-center">
              <img src="https://i.imgur.com/QOi7Nie.png" width="80" />
            </div>
            <div class="flex justify-center mt-3">
              <span class="text-xl font-medium">Donate success</span>
            </div>
            <p class="px-16 text-center text-gray-400">
              Thank you for donating
            </p>
            <router-link
              to="/"
              class="flex items-center justify-center px-8 py-4"
            >
              <button
                class="
                  h-12
                  bg-blue-700
                  w-full
                  text-white text-md
                  rounded
                  hover:shadow
                  hover:bg-blue-800
                  py-2
                  px-2
                "
              >
                Go to home
              </button>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  auth: false,
};
</script>