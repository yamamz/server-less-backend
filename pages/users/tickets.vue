<template>
  <div class="flex flex-col items-center pt-20">
    <div
      class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 -my-2 lg:-mx-8 lg:w-1/2"
    >
      <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
        <div
          class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg"
        >
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
  </div>
</template>


<script>
export default {
  middleware: "auth",
  data() {
    return {
      tickets: [],
      columns: ["ticketNumber", "draw date", "free"],
    };
  },
  methods: {
    formatDate(d) {
      let ye = new Intl.DateTimeFormat("en", { year: "numeric" }).format(d);
      let mo = new Intl.DateTimeFormat("en", { month: "short" }).format(d);
      let da = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d);
      return `${da}-${mo}-${ye}`;
    },
  },
  async created() {
    let response = await this.$axios.get(
      "/api/ticket/getAllByUser/" + this.$auth.state.user._id
    );
    this.tickets = response.data.tickets;
  },
};
</script>

<style scoped>
</style>