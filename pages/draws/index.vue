<template>
  <div class="w-full flex flex-col h-screen items-center pt-8">
    <div class="-my-2 lg:-mx-8 lg:w-1/2">
      <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
        <div
          class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg"
        >
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  class="
                    px-6
                    py-3
                    text-left text-xs
                    font-medium
                    text-gray-500
                    uppercase
                    tracking-wider
                  "
                >
                  License
                </th>
                <th
                  scope="col"
                  class="
                    px-6
                    py-3
                    text-left text-xs
                    font-medium
                    text-gray-500
                    uppercase
                    tracking-wider
                  "
                >
                  Description
                </th>
                <th
                  scope="col"
                  class="
                    px-6
                    py-3
                    text-left text-xs
                    font-medium
                    text-gray-500
                    uppercase
                    tracking-wider
                  "
                >
                  Status
                </th>
                <th
                  scope="col"
                  class="
                    px-6
                    py-3
                    text-left text-xs
                    font-medium
                    text-gray-500
                    uppercase
                    tracking-wider
                  "
                >
                  Set Active
                </th>
                <th
                  scope="col"
                  class="
                    px-6
                    py-3
                    text-left text-xs
                    font-medium
                    text-gray-500
                    uppercase
                    tracking-wider
                  "
                >
                  <div class="flex items-center justify-end">
                    <span> Action</span>
                    <i
                      @click="modalHandler"
                      class="
                        mdi mdi-note-plus
                        text-indigo-400 text-4xl
                        ml-8
                        cursor-pointer
                      "
                    ></i>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="draw in draws" :key="draw.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">
                    {{ draw.licence }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">
                    {{ draw.description }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="
                      px-2
                      inline-flex
                      text-xs
                      leading-5
                      font-semibold
                      rounded-full
                      bg-green-100
                      text-green-800
                    "
                  >
                    {{ draw.active }}
                  </span>
                </td>

                <td
                  class="
                    px-6
                    py-4
                    whitespace-nowrap
                    text-right text-sm
                    font-medium
                  "
                >
                  <button
                    class="text-indigo-600 hover:text-indigo-900"
                    @click="setActive(!draw.active, draw)"
                  >
                    {{ draw.active ? "Diactivate" : "Activate" }}
                  </button>
                </td>

                <td
                  class="
                    px-6
                    py-4
                    whitespace-nowrap
                    text-right text-sm
                    font-medium
                  "
                >
                  <button @click="edit(draw)" class="px-4 text-green-600">
                    Edit
                  </button>
                  <router-link :to="`/draws/${draw._id}`">
                    <button class="text-white bg-indigo-500 rounded px-2">
                      View tickets
                    </button>
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div
      class="
        py-12
        dark:bg-black
        bg-gray-800 bg-opacity-25
        transition
        duration-150
        ease-in-out
        z-10
        absolute
        top-0
        right-0
        bottom-0
        left-0
      "
      id="modal"
    >
      <div
        role="alert"
        class="
          container
          mx-auto
          w-11/12
          md:w-2/3
          max-w-lg
          flex flex-col
          justify-start
        "
      >
        <div
          class="
            relative
            rounded
            shadow-lg
            p-6
            dark:bg-gray-800
            bg-white
            flex flex-col
            items-start
            justify-center
            w-full
            space-y-4
          "
        >
          <div class="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M5 12L10 17L20 7"
                stroke="#22C55E"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <h1
              class="
                dark:text-gray-100
                text-gray-800
                font-bold
                text-lg text-left
                pl-3
              "
            >
              {{ form.id == "" ? "Add" : "Update" }} Draw
            </h1>
          </div>
          <label for="" class="text-xs font-semibold px-1">Description</label>
          <input
            v-model="form.description"
            class="
              w-full
              pl-2
              pr-3
              py-2
              rounded-lg
              border-2
              outline-none
              focus:border-indigo-500
            "
            placeholder="Descrition of draw"
            :class="`${
              form.description == '' && error != ''
                ? 'border-red-200'
                : 'border-gray-200'
            }`"
          />
          <div class="flex space-x-4">
            <div class="flex flex-col items-start space-y-4">
              <label for="" class="text-xs font-semibold px-1"
                >Start Date</label
              >
              <VueTailWindPicker
                :init="false"
                @change="(v) => (form.startPeriodDate = v)"
                class="w-full"
              >
                <input
                  v-model="form.startPeriodDate"
                  class="
                    w-full
                    pl-2
                    pr-3
                    py-2
                    rounded-lg
                    border-2
                    outline-none
                    focus:border-indigo-500
                  "
                  placeholder="Start period"
                />
              </VueTailWindPicker>
            </div>
            <div class="flex flex-col items-start space-y-4">
              <label for="" class="text-xs font-semibold px-1">Draw Date</label>
              <VueTailWindPicker
                :init="false"
                @change="(v) => (form.drawDate = v)"
                class="w-full"
              >
                <input
                  v-model="form.drawDate"
                  class="
                    w-full
                    pl-2
                    pr-3
                    py-2
                    rounded-lg
                    border-2
                    outline-none
                    focus:border-indigo-500
                  "
                  placeholder="Draw date"
                  :class="`${
                    form.drawDate == '' && error != ''
                      ? 'border-red-200'
                      : 'border-gray-200'
                  }`"
                />
              </VueTailWindPicker>
            </div>
          </div>
          <label for="" class="text-xs font-semibold px-1">License</label>
          <input
            v-model="form.licence"
            class="
              w-full
              pl-2
              pr-3
              py-2
              rounded-lg
              outline-none
              border-2
              focus:border-indigo-500
            "
            placeholder="License"
            :class="`${
              form.licence == '' && error != ''
                ? 'border-red-200'
                : 'border-gray-200'
            }`"
          />

          <div class="flex space-x-4">
            <div class="flex flex-col items-start space-y-4">
              <label for="" class="text-xs font-semibold px-1"
                >Ticket price</label
              >
              <input
                type="number"
                v-model="form.ticketPrice"
                class="
                  w-full
                  pl-2
                  pr-3
                  py-2
                  rounded-lg
                  outline-none
                  border-2
                  focus:border-indigo-500
                "
                placeholder="Ticket price"
                :class="`${
                  form.ticketPrice == '' && error != ''
                    ? 'border-red-200'
                    : 'border-gray-200'
                }`"
              />
            </div>
            <div class="flex flex-col items-start space-y-4">
              <label for="" class="text-xs font-semibold px-1"
                >Number of tickets</label
              >
              <input
                v-model="form.numberOfTickets"
                class="
                  w-full
                  pl-2
                  pr-3
                  py-2
                  rounded-lg
                  border-2
                  outline-none
                  focus:border-indigo-500
                "
                placeholder="License"
                :class="`${
                  form.numberOfTickets == '' && error != ''
                    ? 'border-red-200'
                    : 'border-gray-200'
                }`"
              />
            </div>
          </div>

          <div class="flex items-center justify-between pt-6 w-full">
            <button
              class="
                py-3.5
                w-full
                text-white
                focus:outline-none
                hover:opacity-90
                text-sm
                font-semibold
                border
                rounded
                border-indigo-700
                bg-indigo-700
                leading-3
              "
              @click="addDraw"
            >
              {{ form.id == "" ? "Add" : "Update" }}
            </button>
          </div>

          <div
            class="
              flex
              p-2
              bg-red-100
              mt-2
              rounded
              w-full
              items-center
              justify-center
            "
            v-show="error != ''"
          >
            {{ error }}
          </div>
          <div
            class="
              cursor-pointer
              absolute
              top-0
              right-0
              mt-4
              mr-5
              dark:text-gray-100
              text-gray-400
              hover:
              dark:text-gray-100
              text-gray-600
              transition
              duration-150
              ease-in-out
            "
            @click="modalHandler()"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              aria-label="Close"
              class="icon icon-tabler icon-tabler-x"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              stroke-width="2.5"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" />
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from "sweetalert2";
export default {
  middleware: "auth-admin",
  components: { VueTailWindPicker: () => import("vue-tailwind-picker") },
  data() {
    return {
      draws: [],
      error: "",

      form: {
        id: "",
        startPeriodDate: "",
        drawDate: "",
        description: "",
        ticketPrice: "",
        licence: "",
        numberOfTickets: 2000,
      },
    };
  },
  methods: {
    async edit(draw) {
      let modal = document.getElementById("modal");
      this.fadeIn(modal);
      this.form = draw;
    },
    async setActive(val, draw) {
      if (val) {
        let filterActive = this.draws.filter((el) => el.active == true);
        if (filterActive.length > 0) {
          Swal.fire(
            "Opps!",
            "There is another active draw, set it to inactive first..",
            "error"
          );
        } else {
          draw.active = val;
          await this.$axios.put(`/api/draw/${draw._id}`, { active: val });
        }
      } else {
        draw.active = val;
        await this.$axios.put(`/api/draw/${draw._id}`, { active: val });
      }
    },
    async addDraw() {
      if (
        this.form.description == "" ||
        this.form.drawDate == "" ||
        this.form.licence == "" ||
        this.form.startPeriodDate == "" ||
        this.form.numberOfTickets == ""
      ) {
        this.error = "Some fields are required";
      } else {
        if (this.form.id == "") {
          let response = await this.$axios.post("/api/draw/new", this.form);
          this.draws.push(response.data);
        } else {
          let response = await this.$axios.put(
            `/api/draw/${this.form.id}`,
            this.form
          );
        }

        this.modalHandler();
      }
    },
    modalHandler(val) {
      this.error = "";
      this.form = {
        id: "",
        startPeriodDate: "",
        drawDate: "",
        description: "",
        ticketPrice: "",
        licence: "",
        numberOfTickets: 2000,
      };
      let modal = document.getElementById("modal");
      if (val) {
        this.fadeIn(modal);
      } else {
        this.fadeOut(modal);
      }
    },
    fadeOut(el) {
      el.style.opacity = 1;
      (function fade() {
        if ((el.style.opacity -= 0.1) < 0) {
          el.style.display = "none";
        } else {
          requestAnimationFrame(fade);
        }
      })();
    },
    fadeIn(el, display) {
      el.style.opacity = 0;
      el.style.display = display || "flex";
      (function fade() {
        let val = parseFloat(el.style.opacity);
        if (!((val += 0.2) > 1)) {
          el.style.opacity = val;
          requestAnimationFrame(fade);
        }
      })();
    },
  },
  mounted() {
    let modal = document.getElementById("modal");
    modal.style.display = "none";
  },
  async created() {
    let response = await this.$axios.get("/api/draw/getAll");
    this.draws = response.data.draws;
  },
};
</script>

<style scoped>
</style>