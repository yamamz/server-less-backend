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
      px-2
    "
  >
    <p
      v-if="!drawActive"
      class="
        font-bold
        tracking-wider
        lg:text-5xl
        text-gray-600
        bg-red-200
        p-8
        rounded
      "
    >
      {{
        soldOutTickets ? "All tickets are soldout" : "No raffle draw is active"
      }}
    </p>
    <div
      v-show="drawActive"
      class="bg-indigo-100 rounded-lg shadow-lg md:p-8 p-2"
    >
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
            Purchase a &nbsp;
          </p>

          <img src="/tickets.svg" class="w-24 h-24" alt="" srcset="" />
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
        <div>
          <p
            class="
              tracking-widest
              flex
              text-xs
              md:text-base
              justify-center
              items-center
              mb-4
            "
          >
            In every $20 transaction 1 ticket is free, the free tickets are
            drawn for consolation prices
          </p>
        </div>

        <div class="rounded-lg border bg-red-50 p-4 flex">
          <div class="flex flex-col items-center justify-center w-2/3">
            <p class="py-2 tracking-widest text-lg">{{ draw.description }}</p>
            <p
              class="
                font-bold
                text-2xl
                lg:text-3xl
                py-2
                tracking-widest
                text-indigo-500
              "
            >
              50/50 Fund Raising
            </p>
            <p class="py-2 tracking-widest">
              {{ formatDate(new Date(draw.drawDate)) }} | Tickets ${{
                draw.ticketPrice
              }}
              Each entry
            </p>
          </div>
          <div class="vl hidden md:block"></div>
          <div class="flex flex-col ml-2 justify-center md:w-1/3">
            <p class="text-xs pb-2 font-bold tracking-widest">NAME:</p>
            <p class="text-xs tracking-widest">
              {{ this.$auth.state.user.firstName }}
              {{ this.$auth.state.user.lastName }}
            </p>
            <hr class="pb-2" />
            <p class="text-xs pb-2 font-bold tracking-widest">ADDRESS:</p>
            <p class="text-xs tracking-widest">
              {{ this.$auth.state.user.address }}
            </p>
            <hr class="pb-2" />
            <p class="text-xs pb-2 font-bold tracking-widest">PHONE:</p>
            <p class="text-xs tracking-widest">
              {{ this.$auth.state.user.contact }}
            </p>
            <hr class="pb-2" />
            <p class="text-xs pb-2 font-bold tracking-widest">EMAIL:</p>
            <p class="text-xs tracking-widest">
              {{ this.$auth.state.user.email }}
            </p>
            <hr class="pb-2" />
          </div>
        </div>
        <div class="py-4">
          <label for="" class="text-xs font-semibold px-1 text-gray-500"
            >No. of tickets</label
          >
          <input
            :disabled="loading"
            type="number"
            v-model="ticketPcs"
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
            <span id="button-text">Pay now for ${{ price }}</span>
          </button>
          <p id="card-error" role="alert"></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from "sweetalert2";
import { StripeElementCard } from "@vue-stripe/vue-stripe";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import key from "~/config/keys";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export default {
  middleware: "auth",
  components: {
    StripeElementCard,
  },
  data() {
    return {
      drawActive: false,
      soldOutTickets: false,
      token: null,
      setupIntentId: null,
      card: null,
      clientSecret: null,
      ticketPcs: 1,
      isCheckOut: false,
      successPayment: false,
      loading: false,
      ticketBase64: "",
      stripe: null,
      draw: {
        description: "",
        ticketPrice: 5,

        drawDate: new Date(),
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
          let response = await this.$axios.post("/api/payment/chargePayment", {
            amount: this.price,
            token: result.token.id,
            ticketPcs: this.ticketPcs,
            userId: this.$auth.state.user._id,
            drawId: this.draw.id,
            ticketPrice: this.draw.ticketPrice,
            fullname: `${this.$auth.state.user.firstName} ${this.$auth.state.user.lastName}`,
            email: this.$auth.state.user.email,
          });
          this.loading = false;
          this.isLoading(false);
          try {
            this.$router.push({ path: "/success-payment" });

            let pdfGenerator = await this.printTickets(response.data.tickets);
            pdfGenerator.download();
            pdfGenerator.getBase64(async (data) => {
              await this.$axios.post("/api/payment/sendEmailReciept", {
                email: this.$auth.state.user.email,
                ticketEntries: response.data.tickets
                  .map((el) => el.ticketNumber)
                  .join(),
                ticketBase64: data,
              });
            });
          } catch (err) {
            Swal.fire("Opps!", "Error occured", "error");
          }
        } catch (err) {
          this.loading = false;
          this.isLoading(false);
          Swal.fire("Opps!", "Error occured", "error");
        }
      }
    },

    async printTickets(tickets) {
      let ticketsContents = [];
      for (let i = 0; i < tickets.length; i++) {
        ticketsContents.push(
          ...[
            {
              margin: [0, 4, 0, 0],
              fontSize: 9,
              text: "ST. THOMAS AQUINAS PARISH",
              alignment: "center",
            },
            {
              fontSize: 8,
              text: "PO Box 157",
              alignment: "center",
            },
            {
              fontSize: 8,
              text: "St. Lawrence, NL A0E 2V0",
              alignment: "center",
              margin: [0, 0, 0, 6],
            },
            {
              fontSize: 9,
              alignment: "center",
              bold: true,
              text: `${this.draw.description}`.toUpperCase(),
            },

            {
              fontSize: 9,
              alignment: "center",
              text: `License Number: ${this.draw.licence}`,
            },

            {
              fontSize: 9,

              text: `PRIZES:`,
              bold: true,
            },
            {
              columns: [
                {
                  margin: [0, 12, 0, 0],
                  fontSize: 9,
                  text: `1st Prize: $2,000\n2nd Prize: $1,000\n3rd Prize: $500\nConsolation Prizes (3- $200 each)`,
                },
                {
                  alignment: "right",
                  qr: `${tickets[i].id} ${tickets[i].ticketNumber} ${this.draw.licence} ${this.$auth.state.user.email}`,
                  fit: "100",
                },
              ],
            },

            {
              margin: [0, 6, 0, 0],

              columns: [
                {
                  fontSize: 9,
                  text: `Draw Date: ${this.formatDate(
                    new Date(this.draw.drawDate)
                  )}`,
                },
                {
                  fontSize: 9,
                  alignment: "right",
                  text: `TICKET NO. ${tickets[i].ticketNumber}`,
                },
              ],
            },
            {
              margin: [0, 6, 0, 0],
              fontSize: 8,
              text: "- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -",
            },
          ]
        );
      }

      var docDefinition = {
        content: [
          ticketsContents,
          // basic usage
          // { qr: "text in QR" },
          // // colored QR
          // { qr: "text in QR", foreground: "red", background: "yellow" },
          // // resized QR
          // { qr: "text in QR", fit: "500" },
        ],
      };
      let pdfDocGenerator = await pdfMake.createPdf(docDefinition);
      return pdfDocGenerator;
    },

    async cancelCheckout() {
      try {
        let response = await this.$axios.post("/api/payment/checkoutCancel", {
          setupIntentId: this.setupIntentId,
        });
        this.isCheckOut = false;

        console.log(response);
      } catch (err) {
        console.log(err);
      }
    },
    async checkoutCart() {
      this.isCheckOut = true;
      this.loading = true;
      let response = await this.$axios.post("/api/payment/ckeckoutPayment", {
        ticketPcs: this.ticketPcs,
      });
      this.loading = false;
      this.setupIntentId = response.data.setupIntent.id;

      document.querySelector("button").disabled = true;

      var elements = this.stripe.elements();
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
      // Stripe injects an iframe into the DOM
      card.mount("#card-element");
      card.on("change", function (event) {
        // Disable the Pay button if there are no card details in the Element
        document.querySelector("button").disabled = event.empty;
        document.querySelector("#card-error").textContent = event.error
          ? event.error.message
          : "";
      });
      this.card = card;
      this.clientSecret = response.data.setupIntent.client_secret;
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
  async created() {
    let response = await this.$axios.get("/api/draw/getAll");
    let filterActive = response.data.draws.filter((el) => el.active == true);
    if (filterActive.length > 0) {
      this.draw = filterActive[0];
      if (
        this.draw.tickets.filter((el) => el.isSaleOnline).length >=
        this.draw.numberOfTickets
      ) {
        this.soldOutTickets = true;
        this.drawActive = false;
      } else {
        this.soldOutTickets = false;
        this.drawActive = true;
      }
    }
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