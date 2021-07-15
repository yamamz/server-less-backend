<template>
  <div>
    <nav class="bg-gray-50">
      <div class="md:flex items-center justify-between py-2 px-8 md:px-12">
        <div class="flex justify-between items-center">
          <div
            class="text-lg font-bold text-red-400 md:text-2xl hidden lg:block"
          >
            <p>Meditation Garden fundraising</p>
          </div>
          <!-- <div class="md:hidden">
            <button
              type="button"
              class="
                block
                text-gray-800
                hover:text-gray-700
                focus:text-gray-700
                focus:outline-none
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
          </div> -->
        </div>
        <!-- <dropDown
          animation="scale"
          class="md:hidden justify-end flex"
          color="red"
          :items="['admin', 'user', 'test']"
        ></dropDown> -->
        <div class="flex flex-row md:flex-row justify-center md:block -mx-2">
          <router-link to="/">
            <button
              class="
                text-gray-900
                rounded
                hover:bg-red-400
                hover:text-gray-100
                hover:font-medium
                py-2
                px-2
                md:mx-2
                font-bold
                tracking-wider
                text-xs
                md:text-sm
              "
            >
              home
            </button>
          </router-link>
          <button
            v-if="this.$store.state.auth.loggedIn"
            @click="gotoUserTickets"
            class="
              text-gray-900
              rounded
              hover:bg-red-400
              hover:text-gray-100
              hover:font-medium
              py-2
              px-2
              md:mx-2
              font-bold
              tracking-wider
              text-xs
              md:text-sm
            "
          >
            My tickets
          </button>
          <button
            v-if="isModerator"
            @click="gotoDraw"
            class="
              text-gray-900
              rounded
              hover:bg-red-400
              hover:text-gray-100
              hover:font-medium
              py-2
              px-2
              md:mx-2
              font-bold
              tracking-wider
              text-xs
              md:text-sm
            "
          >
            Draw
          </button>

          <button
            v-if="isModerator"
            @click="gotoValidate"
            class="
              text-gray-900
              rounded
              hover:bg-red-400
              hover:text-gray-100
              hover:font-medium
              py-2
              px-2
              md:mx-2
              font-bold
              tracking-wider
              text-xs
              md:text-sm
            "
          >
            Validate
          </button>

          <button
            v-if="this.$store.state.auth.loggedIn"
            class="
              text-gray-900
              rounded
              hover:bg-red-400
              hover:text-gray-100
              hover:font-medium
              py-2
              px-2
              md:mx-2
              font-bold
              tracking-wider
              text-xs
              md:text-sm
            "
            @click="logout"
          >
            Logout
          </button>
          <button
            v-if="!this.$store.state.auth.loggedIn"
            class="
              text-gray-900
              rounded
              hover:bg-red-400
              hover:text-gray-100
              hover:font-medium
              py-2
              px-2
              md:mx-2
              font-bold
              tracking-wider
              text-xs
              md:text-sm
            "
            @click="login"
          >
            Login
          </button>
        </div>
      </div>
    </nav>
    <Nuxt />
  </div>
</template>

<style>
html {
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
<script>
import dropDown from "./../components/Drop-down.vue";
export default {
  components: {
    dropDown,
  },
  data() {
    return {
      isLogin: this.$store.state.auth.loggedIn,
    };
  },
  computed: {
    isModerator() {
      let user = this.$store.state.auth.user;
      if (user) {
        if (user.role == "admin") {
          return true;
        }
      }
      return false;
    },
  },
  methods: {
    gotoHome() {
      this.$router.push({ path: "/" });
    },
    gotoValidate() {
      this.$router.push({ path: "/validate-ticket" });
    },
    gotoUserTickets() {
      this.$router.push({ path: "/users/tickets" });
    },
    gotoDraw() {
      this.$router.push({ path: "/draws" });
    },
    async logout() {
      try {
        let response = await this.$auth.logout();

        this.$router.push({ path: "/login" });
      } catch (err) {
        console.log(err);
      }
    },
    login() {
      this.$router.push({ path: "/login" });
    },
  },
  created() {},
};
</script>
