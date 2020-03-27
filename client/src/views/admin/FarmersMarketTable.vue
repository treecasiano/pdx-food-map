<template>
  <div>
    <v-card>
      <v-card-title>
        <span class="font-weight-bold primary--text">List of Farmers Markets</span>
        <v-spacer></v-spacer>
        <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
        <div class="d-flex justify-left ma-4">
          <v-btn
            rounded
            small
            color="primary"
            class="ml-5"
            title="Add Market"
            @click="goToCreateForm"
          >
            <v-icon class="mr-1">add</v-icon>Add Market
          </v-btn>
        </div>
      </v-card-title>
      <template>
        <v-data-table
          class="elevation-1 mt-4"
          :headers="headers"
          :items="list"
          :search="search"
          :items-per-page="5"
          dense
        >
          <template v-slot:body="{ items }">
            <tbody>
              <tr
                v-for="item in items"
                :key="item.gid"
                @click="goToEditForm(item)"
                @keyup.enter="goToEditForm(item)"
                class="farmersMarketTableRow text-left"
                tabindex="0"
              >
                <td>
                  <v-btn
                    v-if="item.status !== 'Closed'"
                    icon
                    small
                    color="secondary"
                    @click.stop="centerOnPoint(item)"
                    title="View on Map"
                  >
                    <v-icon>map</v-icon>
                  </v-btn>
                </td>
                <td>{{ item.market }}</td>
                <td>{{ item.location }}</td>
                <td>{{ item.day }}</td>
                <td>{{ item.open_dates }}</td>
                <td>{{ item.open_times }}</td>
                <td>
                  <span v-if="item.website">
                    <a :href="item.website" @click.stop>{{ item.website }}</a>
                  </span>
                </td>
                <td>{{ item.accepts }}</td>
                <td>{{ item.status }}</td>
              </tr>
            </tbody>
          </template>
        </v-data-table>
      </template>
    </v-card>
  </div>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  data: () => ({
    search: "",
    headers: [
      { text: "" },
      {
        text: "Market Name",
        value: "market",
      },
      {
        text: "Location",
        value: "location",
      },
      {
        text: "Day",
        value: "day",
      },
      {
        text: "Open Dates",
        value: "open_dates",
      },
      {
        text: "Open Times",
        value: "open_times",
      },
      {
        text: "Website",
        value: "website",
      },
      {
        text: "Accepts",
        value: "accepts",
      },
      {
        text: "Status",
        value: "status",
      },
    ],
  }),
  methods: {
    centerOnPoint(item) {
      this.setDisplayStatusFarmersMarket(true);
      this.$router.push({
        name: "home",
      });
      this.setCenter([item.latitude, item.longitude]);
      this.setZoom(18);
    },
    goToCreateForm() {
      if (this.$router.currentRoute.path === `/admin/${this.name}/create`) {
        return;
      }
      this.$router.push({
        name: "adminObjectCreate",
        params: { mode: "create", object: "farmersMarket" },
      });
    },
    goToEditForm(item) {
      if (
        this.$router.currentRoute.path ===
        `/admin/${this.name}/${item[this.id]}/edit`
      ) {
        return;
      }
      this.$router.push({
        name: "adminObjectEdit",
        params: { mode: "edit", object: this.name, id: item[this.id] },
      });
    },
    ...mapMutations({
      setCenter: "map/setCenter",
      setDisplayStatusFarmersMarket: "farmersMarket/setDisplayStatus",
      setZoom: "map/setZoom",
    }),
  },
  props: ["itemName", "list", "name", "id"],
};
</script>

<style>
.farmersMarketTableRow {
  cursor: pointer;
}
.farmersMarketTableRow:focus {
  border: 2px solid var(--v-primary-lighten2) !important;
  outline: 2px solid var(--v-primary-lighten2) !important;
  border-bottom: 2px solid var(--v-primary-lighten2) !important;
}
</style>
