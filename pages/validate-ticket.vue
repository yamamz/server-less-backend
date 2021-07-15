<template>
  <div class="flex flex items-center justify-center p-4">
    <div class="flex flex-col items-center">
      <p class="font-bold">Point your camera to the qr code</p>
      <div
        class="
          w-full
          bg-blue-100
          flex
          items-center
          justify-center
          p-2
          rounded
          shadow-lg
        "
      >
        <qrcode-stream
          :key="_uid"
          @decode="onDecode"
          @init="logErrors"
          class="rounded-lg"
          :camera="camera"
        >
          <div v-show="showScanConfirmation" class="scan-confirmation">
            <img src="/checkmark.svg" alt="Checkmark" width="128px" />
          </div>
        </qrcode-stream>
      </div>
      <button
        :disabled="ticketsCapture.length == 0"
        class="rounded bg-indigo-500 text-white text-base px-8 py-2 m-2"
        @click="markSoldTickets"
      >
        Mark as sold tickets
      </button>
      <p class="text-md font-bold text-indigo-600 mt-4">Detected tickets</p>
      <ol class="list-decimal">
        <li
          v-for="(item, index) in ticketCaptureDisplay"
          :key="index"
          class="border list-none rounded-sm px-4 py-3"
        >
          <div class="flex items-center">
            <i
              @click="deleteTicket(index)"
              class="mdi mdi-delete text-gray-400 text-lg mr-8"
            ></i>
            <span> {{ item }}</span>
          </div>
        </li>
      </ol>
    </div>
  </div>
</template>

<script>
import Swal from "sweetalert2";
import { QrcodeStream } from "vue-qrcode-reader";
export default {
  middleware: "auth-admin",
  components: {
    QrcodeStream,
  },
  data() {
    return {
      camera: "auto",
      ticketsCapture: [],
      ticketCaptureDisplay: [],
      showScanConfirmation: false,
    };
  },
  methods: {
    deleteTicket(index) {
      this.ticketsCapture.splice(index, 1);
      this.ticketCaptureDisplay.splice(index, 1);
    },
    async markSoldTickets() {
      try {
        let response = await this.$axios.post(
          "/api/ticket/validate-tickets",
          this.ticketsCapture
        );
        Swal.fire("Success!", "Validate successfully", "success");
        this.ticketsCapture = [];
        this.ticketCaptureDisplay = [];
      } catch (err) {
        Swal.fire("Opps!", "Validate unsuccessful", "error");
      }
    },
    async logErrors(promise) {
      try {
        await promise;
      } catch (e) {
        console.error(e);
      } finally {
        this.showScanConfirmation = this.camera === "off";
      }
    },
    async onDecode(result) {
      this.ticketsCapture.push(result.split(" ")[0]);
      this.ticketCaptureDisplay.push(result.split(" ")[1]);
      this.ticketsCapture = [...new Set(this.ticketsCapture)];
      this.ticketCaptureDisplay = [...new Set(this.ticketCaptureDisplay)];
      this.pause();
      await this.timeout(500);
      this.unpause();
    },
    unpause() {
      this.camera = "auto";
    },

    pause() {
      this.camera = "off";
    },

    timeout(ms) {
      return new Promise((resolve) => {
        window.setTimeout(resolve, ms);
      });
    },
  },
};
</script>

<style scoped>
.scan-confirmation {
  position: absolute;
  width: 100%;
  height: 100%;

  background-color: rgba(255, 255, 255, 0.8);

  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
}
</style>