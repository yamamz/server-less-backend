<template>
  <div class="w-full flex flex-col h-screen items-center pt-10">
    <div
      class="
        text-2xl
        font-bold
        md:text-3xl
        text-indigo-500
        flex
        justify-between
        xl:w-2/3
        px-8
      "
    >
      <div class="flex flex-col md:flex-row gap-2 mb-4">
        <button
          @click="printOnlineSoldTickets(false)"
          class="rounded bg-red-500 text-white text-base px-8 py-2 ml-2"
        >
          <div class="flex items-center justify-center">
            <div
              v-show="busyDownloadingOnline && !isFreeTicketDownload"
              class="
                loader
                ease-linear
                rounded-full
                border-4 border-t-4 border-gray-200
                h-6
                w-6
                mr-2
              "
            ></div>
            <div>
              {{
                busyDownloadingOnline ? "dowloading" : "download online Tickets"
              }}
            </div>
          </div>
        </button>

        <button
          @click="printOnlineSoldTickets(true)"
          class="rounded bg-green-500 text-white text-base px-8 py-2 ml-2"
        >
          <div class="flex items-center justify-center">
            <div
              v-show="busyDownloadingOnline && isFreeTicketDownload"
              class="
                loader
                ease-linear
                rounded-full
                border-4 border-t-4 border-gray-200
                h-6
                w-6
                mr-2
              "
            ></div>
            <div>
              {{
                busyDownloadingOnline ? "dowloading" : "download free Tickets"
              }}
            </div>
          </div>
        </button>

        <button
          @click="printTicketsWithDuplicate"
          class="rounded bg-indigo-500 text-white text-base px-8 py-2 ml-2"
        >
          <div class="flex items-center justify-center">
            <div
              v-show="busyDownloadingOffline"
              class="
                loader
                ease-linear
                rounded-full
                border-4 border-t-4 border-gray-200
                h-6
                w-6
                mr-2
              "
            ></div>
            <div>
              {{
                busyDownloadingOffline
                  ? "dowloading"
                  : "download offline Tickets"
              }}
            </div>
          </div>
        </button>

        <button
          @click="showModal = true"
          class="rounded bg-red-500 text-white text-base px-8 py-2 ml-2"
        >
          Add offline tickets
        </button>
      </div>
    </div>
    <div
      class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-2 -my-2 lg:-mx-2 xl:w-2/3"
    >
      <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
        <div
          class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg"
        >
          <div class="flex flex-col p-4">
            <p class="tracking-wider">
              Online Sold tickets:
              {{ tickets.filter((el) => el.isSaleOnline && !el.isFree).length }}
            </p>
            <p class="tracking-wider">
              Offline Sold tickets:
              {{
                tickets.filter((el) => !el.isSaleOnline && el.soldOut).length
              }}
            </p>
          </div>
          <v-client-table
            filterable="true"
            :columns="columns"
            :data="tickets"
            class="p-4"
          >
            <span slot="draw date" slot-scope="props">
              {{ formatDate(new Date(props.row.draw.drawDate)) }}
            </span>
            <div slot="free" slot-scope="props">
              <span
                class="
                  inline-flex
                  text-xs
                  leading-5
                  font-semibold
                  text-green-600
                "
              >
                {{ props.row.isFree ? "True" : "False" }}
              </span>
            </div>
          </v-client-table>
        </div>
      </div>
    </div>

    <transition
      name="custom"
      enter-active-class="animate__animated animate__bounceIn"
      leave-active-class="animate__animated animate__bounceOut"
    >
      <!-- Modal -->
      <div
        v-if="showModal"
        class="
          w-11/12
          items-center
          lg:w-full
          max-w-xl
          z-20
          mx-auto
          bg-white
          flex flex-col
          self-center
          shadow-2xl
          rounded-md
          dark:bg-black
          bg-gray-800 bg-opacity-25
          z-10
          absolute
          top-72
          right-0
          bottom-0
          left-0
          h-96
          justify-center
        "
      >
        <!-- Modal header -->
        <div class="px-6 border-gray-200 text-lg font-bold text-indigo-400">
          Generate offline ticket
        </div>
        <!-- ./Modal header -->

        <!-- Modal body -->
        <div class="p-6">
          <div class="">
            <label for="" class="text-xs font-semibold px-1 text-gray-500"
              >Number of tickets</label
            >
            <input
              type="number"
              v-model="ticketPcs"
              class="
                w-full
                px-2
                py-2
                rounded-lg
                border-2 border-gray-200
                outline-none
                focus:border-indigo-500
              "
            />
          </div>
        </div>
        <!-- ./Modal body -->

        <!-- Modal footer -->
        <div class="border-gray-200 p-6 flex justify-end gap-2">
          <button
            @click="showModal = false"
            class="
              bg-red-400
              hover:bg-red-500
              focus:outline-none
              transition
              px-4
              py-2
              rounded-md
              text-white
              transition
              duration-500
              ease-in-out
            "
          >
            Cancel
          </button>
          <button
            @click="generateOfflineTickets"
            class="
              bg-green-400
              hover:bg-green-500
              focus:outline-none
              transition
              px-4
              py-2
              rounded-md
              text-white
              transition
              duration-500
              ease-in-out
            "
          >
            Add
          </button>
        </div>
        <!-- ./Modal footer -->
      </div>
      <!-- ./Modal -->
    </transition>

    <transition
      name="custom"
      enter-active-class="animate__animated animate__fadeIn"
      leave-active-class="animate__animated animate__fadeOut"
    >
      <!-- Overlay -->
      <div
        v-if="showModal"
        class="
          bg-gray-700 bg-opacity-50
          fixed
          bottom-0
          left-0
          w-full
          h-full
          transition
          duration-500
          ease-in-out
          transfom
          z-10
        "
      ></div>
      <!-- ./Overlay -->
    </transition>
  </div>
</template>


<script>
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
export default {
  middleware: "auth-admin",
  data() {
    return {
      busyDownloadingOffline: false,
      busyDownloadingOnline: false,
      isFreeTicketDownload: false,
      tickets: [],
      showModal: false,
      ticketPcs: 0,
      columns: [
        "ticketNumber",
        "fullname",
        "email",
        "phone",
        "address",
        "draw date",
        "free",
      ],
    };
  },
  methods: {
    async generateOfflineTickets() {
      try {
        if (this.ticketPcs > 0) {
          let response = await this.$axios.post(
            "/api/ticket/generateOffTicket",
            {
              userId: this.$auth.state.user._id,
              drawId: this.$route.params.id,
              ticketPcs: this.ticketPcs,
            }
          );

          this.showModal = false;
          response.data.tickets.forEach((element) => {
            element.phone = element.user.contact;
            element.email = element.user.email;
            element.fullname = `${element.user.firstName} ${element.user.lastName}`;
            element.address = element.user.address;
          });
          this.tickets = response.data.tickets;
        }
      } catch (err) {}
    },
    formatDate(d) {
      let ye = new Intl.DateTimeFormat("en", { year: "numeric" }).format(d);
      let mo = new Intl.DateTimeFormat("en", { month: "short" }).format(d);
      let da = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d);
      return `${da}-${mo}-${ye}`;
    },
    async printTicketsWithDuplicate() {
      this.busyDownloadingOffline = true;
      let ticketsContents = [];
      let filterOnlineTickets = this.tickets.filter(
        (el) => el.isSaleOnline == false
      );
      for (let i = 0; i < filterOnlineTickets.length; i++) {
        ticketsContents.push(
          ...[
            {
              columns: [
                {
                  width: 110,
                  alignment: "left",
                  margin: [0, 0, 0, 0],
                  type: "none",
                  ol: [
                    {
                      qr: `${filterOnlineTickets[i].id} ${filterOnlineTickets[i].ticketNumber} ${filterOnlineTickets[i].draw.licence} ${filterOnlineTickets[i].user.email}`,
                      fit: "110",
                    },
                    {
                      margin: [0, 8, 0, 0],
                      fontSize: 7,

                      text: `No. ${filterOnlineTickets[i].ticketNumber}`,
                      bold: true,
                    },
                  ],
                },

                {
                  alignment: "left",
                  width: 150,
                  margin: [0, 0, 0, 0],
                  type: "none",
                  ol: [
                    {
                      type: "none",
                      ol: [
                        {
                          margin: [0, 0, 0, 0],
                          fontSize: 8,
                          text: "ST. THOMAS AQUINAS PARISH",
                        },
                        {
                          fontSize: 7,
                          text: "PO Box 157",
                        },
                        {
                          fontSize: 7,
                          text: "St. Lawrence, NL A0E 2V0",

                          margin: [0, 0, 0, 6],
                        },
                        {
                          fontSize: 8,

                          bold: true,
                          text: `${filterOnlineTickets[i].draw.description}`.toUpperCase(),
                        },

                        {
                          fontSize: 8,

                          text: `License No: ${filterOnlineTickets[i].draw.licence}`,
                        },
                        {
                          margin: [0, 8, 0, 0],
                          fontSize: 8,
                          text: `1st Prize: $2,000\n2nd Prize: $1,000\n3rd Prize: $500\nConsolation Prizes (3- $200 each)`,
                        },
                        {
                          margin: [0, 8, 0, 0],
                          fontSize: 8,
                          text: `Draw Date: ${this.formatDate(
                            new Date(filterOnlineTickets[i].draw.drawDate)
                          )}`,
                        },
                      ],
                    },
                  ],
                },

                {
                  alignment: "left",

                  type: "none",
                  ol: [
                    {
                      type: "none",
                      ol: [
                        {
                          qr: `${filterOnlineTickets[i].id} ${filterOnlineTickets[i].ticketNumber} ${filterOnlineTickets[i].draw.licence} ${filterOnlineTickets[i].user.email}`,
                          fit: "110",
                        },
                        {
                          margin: [0, 8, 0, 0],
                          fontSize: 7,

                          text: `No. ${filterOnlineTickets[i].ticketNumber}`,
                          bold: true,
                        },
                      ],
                    },
                  ],
                },

                {
                  alignment: "left",
                  width: 200,

                  type: "none",
                  ol: [
                    {
                      type: "none",
                      ol: [
                        {
                          margin: [0, 0, 0, 0],
                          fontSize: 8,
                          text: "ST. THOMAS AQUINAS PARISH",
                        },
                        {
                          fontSize: 7,
                          text: "PO Box 157",
                        },
                        {
                          fontSize: 7,
                          text: "St. Lawrence, NL A0E 2V0",

                          margin: [0, 0, 0, 6],
                        },
                        {
                          fontSize: 8,

                          bold: true,
                          text: `${filterOnlineTickets[i].draw.description}`.toUpperCase(),
                        },

                        {
                          fontSize: 8,

                          text: `License No: ${filterOnlineTickets[i].draw.licence}`,
                        },
                        {
                          margin: [0, 8, 0, 0],
                          fontSize: 8,
                          text: `fullname: _____________________________\naddress: ______________________________\nphone: _______________________________\nemail: ________________________________`,
                        },
                        {
                          margin: [0, 8, 0, 0],
                          fontSize: 8,
                          text: `Draw Date: ${this.formatDate(
                            new Date(filterOnlineTickets[i].draw.drawDate)
                          )}`,
                        },
                      ],
                    },
                  ],
                },
              ],
            },

            {
              margin: [0, 0, 0, 4],
              fontSize: 8,
              text: "- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -",
            },
          ]
        );
      }

      var docDefinition = {
        content: [ticketsContents],
      };

      let response = await this.$axios.post(
        "/api/ticket/generatePdf",
        {
          docDefinition: docDefinition,
        },
        { responseType: "blob" }
      );
      this.busyDownloadingOffline = false;

      let objectUrl = await URL.createObjectURL(response.data);
      var link = document.createElement("a");
      link.href = objectUrl;
      link.download = "offline-tickets.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    async printOnlineSoldTickets(isFree) {
      this.isFreeTicketDownload = isFree;
      this.busyDownloadingOnline = true;
      let ticketsContents = [];
      let filterOnlineTickets = [];
      if (!isFree) {
        filterOnlineTickets = this.tickets.filter(
          (el) => el.isSaleOnline == true && !el.isFree
        );
      } else {
        filterOnlineTickets = this.tickets.filter(
          (el) => el.isSaleOnline == true && el.isFree
        );
      }

      for (let i = 1; i < filterOnlineTickets.length; i = i + 2) {
        try {
          ticketsContents.push(
            ...[
              {
                columns: [
                  {
                    width: 110,
                    alignment: "left",
                    margin: [0, 0, 0, 0],
                    type: "none",
                    ol: [
                      {
                        qr: `${filterOnlineTickets[i - 1].id} ${
                          filterOnlineTickets[i - 1].ticketNumber
                        } ${filterOnlineTickets[i - 1].draw.licence} ${
                          filterOnlineTickets[i - 1].user.email
                        }`,
                        fit: "110",
                      },
                      {
                        margin: [0, 8, 0, 0],
                        fontSize: 7,

                        text: `No. ${filterOnlineTickets[i - 1].ticketNumber}`,
                        bold: true,
                      },
                    ],
                  },

                  {
                    alignment: "left",
                    width: 160,
                    margin: [0, 0, 0, 0],
                    type: "none",
                    ol: [
                      {
                        type: "none",
                        ol: [
                          {
                            margin: [0, 0, 0, 0],
                            fontSize: 8,
                            text: "ST. THOMAS AQUINAS PARISH",
                          },
                          {
                            fontSize: 7,
                            text: "PO Box 157",
                          },
                          {
                            fontSize: 7,
                            text: "St. Lawrence, NL A0E 2V0",

                            margin: [0, 0, 0, 6],
                          },
                          {
                            fontSize: 8,

                            bold: true,
                            text: `${
                              filterOnlineTickets[i - 1].draw.description
                            }`.toUpperCase(),
                          },

                          {
                            fontSize: 8,

                            text: `License No: ${
                              filterOnlineTickets[i - 1].draw.licence
                            }`,
                          },
                          {
                            margin: [0, 8, 0, 0],
                            fontSize: 8,
                            text: `1st Prize: $2,000\n2nd Prize: $1,000\n3rd Prize: $500\nConsolation Prizes (3- $200 each)`,
                          },
                          {
                            margin: [0, 8, 0, 0],
                            fontSize: 8,
                            text: `Draw Date: ${this.formatDate(
                              new Date(filterOnlineTickets[i - 1].draw.drawDate)
                            )}`,
                          },
                        ],
                      },
                    ],
                  },

                  {
                    alignment: "left",

                    type: "none",
                    ol: [
                      {
                        type: "none",
                        ol: [
                          {
                            qr: `${filterOnlineTickets[i].id} ${filterOnlineTickets[i].ticketNumber} ${filterOnlineTickets[i].draw.licence} ${filterOnlineTickets[i].user.email}`,
                            fit: "110",
                          },
                          {
                            margin: [0, 8, 0, 0],
                            fontSize: 7,

                            text: `No. ${filterOnlineTickets[i].ticketNumber}`,
                            bold: true,
                          },
                        ],
                      },
                    ],
                  },

                  {
                    alignment: "left",
                    width: 200,

                    type: "none",
                    ol: [
                      {
                        type: "none",
                        ol: [
                          {
                            margin: [0, 0, 0, 0],
                            fontSize: 8,
                            text: "ST. THOMAS AQUINAS PARISH",
                          },
                          {
                            fontSize: 7,
                            text: "PO Box 157",
                          },
                          {
                            fontSize: 7,
                            text: "St. Lawrence, NL A0E 2V0",

                            margin: [0, 0, 0, 6],
                          },
                          {
                            fontSize: 8,

                            bold: true,
                            text: `${filterOnlineTickets[i].draw.description}`.toUpperCase(),
                          },

                          {
                            fontSize: 8,

                            text: `License No: ${filterOnlineTickets[i].draw.licence}`,
                          },
                          {
                            margin: [0, 8, 0, 0],
                            fontSize: 8,
                            text: `1st Prize: $2,000\n2nd Prize: $1,000\n3rd Prize: $500\nConsolation Prizes (3- $200 each)`,
                          },
                          {
                            margin: [0, 8, 0, 0],
                            fontSize: 8,
                            text: `Draw Date: ${this.formatDate(
                              new Date(filterOnlineTickets[i].draw.drawDate)
                            )}`,
                          },
                        ],
                      },
                    ],
                  },
                ],
              },

              {
                margin: [0, 0, 0, 4],
                fontSize: 8,
                text: "- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -",
              },
            ]
          );
        } catch (err) {}
      }
      if (filterOnlineTickets.length % 2 == 1) {
        ticketsContents.push(
          ...[
            {
              columns: [
                {
                  width: 110,
                  alignment: "left",
                  margin: [0, 0, 0, 0],
                  type: "none",
                  ol: [
                    {
                      qr: `${
                        filterOnlineTickets[filterOnlineTickets.length - 1].id
                      } ${
                        filterOnlineTickets[filterOnlineTickets.length - 1]
                          .ticketNumber
                      } ${
                        filterOnlineTickets[filterOnlineTickets.length - 1].draw
                          .licence
                      } ${
                        filterOnlineTickets[filterOnlineTickets.length - 1].user
                          .email
                      }`,
                      fit: "110",
                    },
                    {
                      margin: [0, 8, 0, 0],
                      fontSize: 7,

                      text: `No. ${
                        filterOnlineTickets[filterOnlineTickets.length - 1]
                          .ticketNumber
                      }`,
                      bold: true,
                    },
                  ],
                },

                {
                  alignment: "left",
                  width: 160,
                  margin: [0, 0, 0, 0],
                  type: "none",
                  ol: [
                    {
                      type: "none",
                      ol: [
                        {
                          margin: [0, 0, 0, 0],
                          fontSize: 8,
                          text: "ST. THOMAS AQUINAS PARISH",
                        },
                        {
                          fontSize: 7,
                          text: "PO Box 157",
                        },
                        {
                          fontSize: 7,
                          text: "St. Lawrence, NL A0E 2V0",

                          margin: [0, 0, 0, 6],
                        },
                        {
                          fontSize: 8,

                          bold: true,
                          text: `${
                            filterOnlineTickets[filterOnlineTickets.length - 1]
                              .draw.description
                          }`.toUpperCase(),
                        },

                        {
                          fontSize: 8,

                          text: `License No: ${
                            filterOnlineTickets[filterOnlineTickets.length - 1]
                              .draw.licence
                          }`,
                        },
                        {
                          margin: [0, 8, 0, 0],
                          fontSize: 8,
                          text: `1st Prize: $2,000\n2nd Prize: $1,000\n3rd Prize: $500\nConsolation Prizes (3- $200 each)`,
                        },
                        {
                          margin: [0, 8, 0, 0],
                          fontSize: 8,
                          text: `Draw Date: ${this.formatDate(
                            new Date(
                              filterOnlineTickets[
                                filterOnlineTickets.length - 1
                              ].draw.drawDate
                            )
                          )}`,
                        },
                      ],
                    },
                  ],
                },
              ],
            },

            {
              margin: [0, 0, 0, 4],
              fontSize: 8,
              text: "- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -",
            },
          ]
        );
      }

      var docDefinition = {
        content: [ticketsContents],
      };
      let response = await this.$axios.post(
        "/api/ticket/generatePdf",
        {
          docDefinition: docDefinition,
        },
        { responseType: "blob" }
      );
      this.busyDownloadingOnline = false;
      let objectUrl = await URL.createObjectURL(response.data);
      var link = document.createElement("a");
      link.href = objectUrl;
      if (isFree) {
        link.download = "free-tickets.pdf";
      } else {
        link.download = "online-tickets.pdf";
      }

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
  },
  async created() {
    let response = await this.$axios.get(
      "/api/ticket/getAllByDraw/" + this.$route.params.id
    );
    response.data.tickets.forEach((element) => {
      element.phone = element.user?.contact ?? "";
      element.email = element.user?.email ?? "";
      element.fullname = `${element.user.firstName} ${element.user.lastName}`;
      element.address = element.user.address;
    });
    this.tickets = response.data.tickets;
  },
};
</script>

<style scoped>
.loader {
  border-top-color: #3498db;
  -webkit-animation: spinner 1.5s linear infinite;
  animation: spinner 1.5s linear infinite;
}

@-webkit-keyframes spinner {
  0% {
    -webkit-transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}

@keyframes spinner {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>