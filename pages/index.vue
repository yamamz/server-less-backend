<template>
  <div class="w-full flex flex-col h-screen">
    <div class="flex bg-white flex-grow">
      <div
        class="
          flex
          items-center
          text-center
          lg:text-left
          px-8
          md:px-12
          lg:w-1/2
        "
      >
        <div>
          <h2
            class="text-3xl font-semibold text-gray-800 md:text-4xl mb-8 mt-4"
          >
            50/50 Draw <span class="text-indigo-600">Fundraising</span>
          </h2>
          <p class="mt-2 text-sm text-gray-500 md:text-lg mb-4">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiis
            commodi cum cupiditate ducimus, fugit harum id necessitatibus odio
            quam quasi, quibusdam rem tempora voluptates. Cumque debitis
            dignissimos id quam vel!
          </p>
          <div class="flex justify-center lg:justify-start mt-12">
            <button
              class="
                px-4
                py-2
                md:py-3
                bg-indigo-600
                text-gray-200 text-lg
                font-semibold
                rounded
                hover:bg-indigo-800
              "
              @click="gotoCheckOut"
            >
              Buy a ticket
            </button>
            <button
              class="
                mx-4
                px-4
                py-2
                md:py-3
                bg-red-300
                text-white text-lg
                font-semibold
                rounded
                hover:bg-red-400
              "
              @click="gotoDonate"
            >
              Donate
            </button>
          </div>
          <div class="flex items-center w-full mb-2 mt-8">
            <label for="toogleA" class="flex items-center cursor-pointer">
              <!-- toggle -->
              <div class="relative">
                <!-- input -->
                <input
                  v-model="agree"
                  id="toogleA"
                  type="checkbox"
                  class="sr-only"
                />
                <!-- line -->
                <div
                  class="w-10 h-4 bg-gray-400 rounded-full shadow-inner"
                ></div>
                <!-- dot -->
                <div
                  class="
                    dot
                    absolute
                    w-6
                    h-6
                    bg-white
                    rounded-full
                    shadow
                    -left-1
                    -top-1
                    transition
                  "
                ></div>
              </div>
              <!-- label -->
              <div class="ml-3 text-gray-700 font-medium">
                I agree the terms and conditions
              </div>
            </label>
          </div>
        </div>
      </div>
      <div
        class="hidden lg:block lg:w-2/3"
        style="clip-path: polygon(10% 0, 100% 0%, 100% 100%, 0 100%)"
      >
        <div
          class="h-full w-full object-cover"
          style="background: url('/50-50.png')"
        >
          <!-- <div class="h-full bg-black opacity-25"></div> -->
        </div>
      </div>
    </div>
    <div class="p-4 flex flex-col items-center bg-red-100 mt-4">
      <p class="font-bold">Terms and Conditions</p>
      <ol class="list-decimal">
        <li class="text-xs traking-wider">
          Issuance of this ticket is subject to rules and regulations and
          conditions referred to on the Lottery Licensing Regulations in
          Newfoundland and Labrador, Canada.
        </li>
        <li class="text-xs pt-2 traking-wider">
          This ticket is void if the information on its face differs from the
          St. Thomas Aquinas Parish central computer system information for the
          control number on this ticket.
        </li>
        <li class="text-xs pt-2 traking-wider">
          A prize must be claimed within 12 months of the draw date.
        </li>
        <li class="text-xs pt-2 traking-wider">
          A winning ticket must be validated by the St. Thomas Aquinas Parish,
          Newfoundland and Labrador, Canada.
        </li>
        <li class="text-xs pt-2 traking-wider">
          For prize-claiming information, call the parish office at 709-873-2675
          or visit the parish website at sta-sj.ca.
        </li>
        <li class="text-xs pt-2 traking-wider">
          The winning ticket and name of the prize winners will be published on
          the parish bulletin and parish web pages.
        </li>
        <li class="text-xs pt-2 traking-wider">
          You must be 19+ to purchase, play or redeem the raffle prize winnings.
        </li>
      </ol>
    </div>
  </div>
</template>

<script>
import Swal from "sweetalert2";
import dropDown from "./../components/Drop-down.vue";
export default {
  auth: "guest",
  components: {
    dropDown,
  },
  data() {
    return {
      isModerator: false,
      agree: localStorage.getItem("agree"),
      isAllowCountry: false,
    };
  },
  methods: {
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
        console.log(response);
        console.log(this.$auth.user);
        this.$router.push({ path: "/login" });
      } catch (err) {
        console.log(err);
      }
    },
    login() {
      this.$router.push({ path: "/login" });
    },
    async gotoCheckOut() {
      if (this.agree) {
        localStorage.setItem("agree", true);

        if (this.isAllowCountry) {
          this.$router.push({ path: "/checkout" });
        } else {
          Swal.fire(
            "Opps!",
            "Your location is not allowed to purchase a tickets",
            "error"
          );
        }
      } else {
        Swal.fire(
          "Opps!",
          "You must aggree the terms and conditions first to proceed",
          "error"
        );
      }
    },
    gotoDonate() {
      this.$router.push({ name: "donate" });
    },
  },
  async created() {
    let user = this.$auth.state.user;

    if (user) {
      if (user.role == "admin") {
        this.isModerator = true;
      }
    }
    if (process.env.NODE_ENV === "production") {
      let response = await this.$axios.get(
        "https://ipinfo.io/?token=49b05fd090b62c"
      );
      if (response.data.country == "CA") {
        this.isAllowCountry = true;
      }
    } else {
      this.isAllowCountry = true;
    }
  },
};
</script>

<style>
/* Sample `apply` at-rules with Tailwind CSS
.container {
@apply min-h-screen flex justify-center items-center text-center mx-auto;
}
*/
input:checked ~ .dot {
  transform: translateX(100%);
  background-color: #48bb78;
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
