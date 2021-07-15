<template>
  <div
    class="
      min-w-screen min-h-screen
      bg-gray-50
      flex
      items-center
      justify-center
      md:px-5
      md:py-2
      px-4
    "
  >
    <div class="bg-indigo-100 rounded-lg shadow-lg p-2 md:p-4 w-full md:w-1/2">
      <div>
        <div class="flex justify-center items-center mb-4">
          <p
            class="
              text-2xl
              lg:text-4xl
              font-bold
              text-indigo-500
              tracking-widest
            "
          >
            Donate &nbsp;
          </p>

          <div>
            <p
              class="
                text-3xl
                lg:text-7xl
                font-bold
                text-indigo-500
                tracking-widest
              "
            >
              &nbsp; Now
            </p>
          </div>
        </div>
        <div class="">
          <label for="" class="text-xs font-semibold px-1 text-gray-500"
            >Name</label
          >
          <input
            class="
              w-full
              pl-10
              py-2
              rounded-lg
              border-2 border-gray-200
              outline-none
              focus:border-indigo-500
            "
            v-model="form.fullname"
            placeholder="John Smith"
          />
        </div>
        <div class="">
          <label for="" class="text-xs font-semibold px-1 text-gray-500"
            >Address</label
          >
          <input
            class="
              w-full
              pl-10
              py-2
              rounded-lg
              border-2 border-gray-200
              outline-none
              focus:border-indigo-500
            "
            v-model="form.address"
            placeholder="Enter address"
          />
        </div>
        <div class="">
          <label for="" class="text-xs font-semibold px-1 text-gray-500"
            >Email</label
          >
          <input
            class="
              w-full
              pl-10
              py-2
              rounded-lg
              border-2 border-gray-200
              outline-none
              focus:border-indigo-500
            "
            placeholder="johnsmith@example.com"
            v-model="form.email"
          />
        </div>
        <div class="">
          <label for="" class="text-xs font-semibold px-1 text-gray-500"
            >Phone</label
          >
          <input
            class="
              w-full
              pl-10
              py-2
              rounded-lg
              border-2 border-gray-200
              outline-none
              focus:border-indigo-500
            "
            placeholder="mobile no."
            v-model="form.phone"
          />
        </div>

        <div class="">
          <label for="" class="text-xs font-semibold px-1 text-gray-500"
            >Amount</label
          >
          <input
            type="number"
            v-model="form.amount"
            class="
              w-full
              pl-10
              py-2
              rounded-lg
              border-2 border-gray-200
              outline-none
              focus:border-indigo-500
            "
          />
        </div>
        <div>
          <div id="card-element" class="mt-2"></div>
          <button id="submit" @click="payWithCard" class="button">
            <div class="spinner hidden" id="spinner"></div>
            <span id="button-text">Donate now ${{ form.amount }}</span>
          </button>
          <p id="card-error" role="alert"></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { StripeElementCard } from "@vue-stripe/vue-stripe";
import key from "~/config/keys";

import Swal from "sweetalert2";
export default {
  middleware: "auth",
  components: {
    StripeElementCard,
  },
  data() {
    return {
      drawActive: false,
      token: null,
      setupIntentId: null,
      card: null,
      clientSecret: null,
      ticketPcs: 1,
      isCheckOut: false,
      successPayment: false,
      loading: false,
      stripe: null,

      draw: {
        description: "",
        ticketPrice: 5,

        drawDate: new Date(),
      },
      form: {
        fullname: `${this.$auth.state.user.firstName} ${this.$auth.state.user.lastName}`,
        phone: this.$auth.state.user.contact,
        email: this.$auth.state.user.email,
        address: this.$auth.state.user.address,
        amount: 5,
      },
    };
  },
  computed: {
    price() {
      if (this.ticketPcs > 0) {
        return this.ticketPcs * this.draw.ticketPrice;
      } else {
        this.ticketPcs = 1;
        return 1 * this.draw.ticketPrice;
      }
    },
  },
  async mounted() {
    let stripePublicKey = await this.$axios.get(
      "/api/payment/getStripePublicKey"
    );
    this.stripe = Stripe(stripePublicKey.data.key);
    var elements = this.stripe.elements();

    document.querySelector("button").disabled = true;

    var style = {
      base: {
        color: "#32325d",
        fontFamily: "Arial, sans-serif",
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#32325d",
        },
      },
      invalid: {
        fontFamily: "Arial, sans-serif",
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    };
    var card = elements.create("card", { style: style });
    card.mount("#card-element");
    card.on("change", function (event) {
      // Disable the Pay button if there are no card details in the Element
      document.querySelector("button").disabled = event.empty;
      document.querySelector("#card-error").textContent = event.error
        ? event.error.message
        : "";
    });
    this.card = card;
  },
  methods: {
    makeid(length) {
      var result = "";
      var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      var charactersLength = characters.length;
      for (var i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }
      return result;
    },
    formatDate(d) {
      let ye = new Intl.DateTimeFormat("en", { year: "numeric" }).format(d);
      let mo = new Intl.DateTimeFormat("en", { month: "short" }).format(d);
      let da = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d);
      return `${da}-${mo}-${ye}`;
    },
    buyAgain() {
      this.isCheckOut = false;
      this.successPayment = false;
    },
    isLoading(isLoading) {
      if (isLoading) {
        // Disable the button and show a spinner
        this.loading = true;
        document.querySelector("button").disabled = true;
        document.querySelector("#spinner").classList.remove("hidden");
        document.querySelector("#button-text").classList.add("hidden");
      } else {
        this.loading = false;
        document.querySelector("button").disabled = false;
        document.querySelector("#spinner").classList.add("hidden");
        document.querySelector("#button-text").classList.remove("hidden");
      }
    },
    async payWithCard() {
      this.loading = true;
      this.isLoading(true);

      let result = await this.stripe.createToken(this.card);
      if (result.error) {
        // Inform the customer that there was an error.
        var errorElement = document.getElementById("card-error");
        errorElement.textContent = result.error.message;
        this.loading = false;
        this.isLoading(false);
      } else {
        try {
          if (
            this.form.fullname == "" ||
            this.form.address == "" ||
            this.form.phone == "" ||
            this.form.email == "" ||
            this.form.amount == ""
          ) {
            this.loading = false;
            this.isLoading(false);
            Swal.fire("Opps!", "All fields are required", "error");
          } else {
            await this.$axios.post("/api/payment/donatePayment", {
              amount: this.form.amount,
              token: result.token.id,
              fullname: this.form.fullname,
              email: this.form.email,
              address: this.form.address,
              phone: this.form.phone,
            });
            this.loading = false;
            this.isLoading(false);
            this.$router.push({ path: "/success-donate" });
          }
        } catch (err) {
          Swal.fire("Opps!", "Error occured", "error");
          this.loading = false;
          this.isLoading(false);
        }
      }
    },
  },
};
</script>

<style scoped>
/* Variables */
* {
  box-sizing: border-box;
}
body {
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  display: flex;
  justify-content: center;
  align-content: center;
  height: 100vh;
  width: 100vw;
}
/* form {
  width: 40vw;
  min-width: 350px;
  align-self: center;
  box-shadow: 0px 0px 0px 0.5px rgba(50, 50, 93, 0.1),
    0px 2px 5px 0px rgba(50, 50, 93, 0.1), 0px 1px 1.5px 0px rgba(0, 0, 0, 0.07);
  border-radius: 7px;
  padding: 40px;
} */
input {
  border-radius: 6px;
  margin-bottom: 6px;
  padding: 12px;
  border: 1px solid rgba(50, 50, 93, 0.1);
  height: 44px;
  font-size: 16px;
  width: 100%;
  background: white;
}
.result-message {
  line-height: 22px;
  font-size: 16px;
}
.result-message a {
  color: rgb(89, 111, 214);
  font-weight: 600;
  text-decoration: none;
}
.hidden {
  display: none;
}
#card-error {
  color: rgb(105, 115, 134);
  text-align: left;
  font-size: 13px;
  line-height: 17px;
  margin-top: 12px;
}
#card-element {
  border-radius: 4px 4px 0 0;
  padding: 12px;
  border: 1px solid rgba(50, 50, 93, 0.1);
  height: 44px;
  width: 100%;
  background: white;
}
#payment-request-button {
  margin-bottom: 32px;
}
/* Buttons and links */
.button {
  background: #5469d4;
  color: #ffffff;
  font-family: Arial, sans-serif;
  border-radius: 0 0 4px 4px;
  border: 0;
  padding: 12px 16px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: block;
  transition: all 0.2s ease;
  box-shadow: 0px 4px 5.5px 0px rgba(0, 0, 0, 0.07);
  width: 100%;
}
button:hover {
  filter: contrast(115%);
}
button:disabled {
  opacity: 0.5;
  cursor: default;
}
/* spinner/processing state, errors */
.spinner,
.spinner:before,
.spinner:after {
  border-radius: 50%;
}
.spinner {
  color: #ffffff;
  font-size: 22px;
  text-indent: -99999px;
  margin: 0px auto;
  position: relative;
  width: 20px;
  height: 20px;
  box-shadow: inset 0 0 0 2px;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
}
.spinner:before,
.spinner:after {
  position: absolute;
  content: "";
}
.spinner:before {
  width: 10.4px;
  height: 20.4px;
  background: #5469d4;
  border-radius: 20.4px 0 0 20.4px;
  top: -0.2px;
  left: -0.2px;
  -webkit-transform-origin: 10.4px 10.2px;
  transform-origin: 10.4px 10.2px;
  -webkit-animation: loading 2s infinite ease 1.5s;
  animation: loading 2s infinite ease 1.5s;
}
.spinner:after {
  width: 10.4px;
  height: 10.2px;
  background: #5469d4;
  border-radius: 0 10.2px 10.2px 0;
  top: -0.1px;
  left: 10.2px;
  -webkit-transform-origin: 0px 10.2px;
  transform-origin: 0px 10.2px;
  -webkit-animation: loading 2s infinite ease;
  animation: loading 2s infinite ease;
}
@-webkit-keyframes loading {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes loading {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@media only screen and (max-width: 900px) {
  form {
    width: 80vw;
  }
}

.vl {
  border-left: 6px solid green;
  left: 50%;
  margin-left: -3px;
  top: 0;
}
</style>