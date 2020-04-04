<template>
  <div>
    <v-card>
      <v-card-title>
        <span class="font-weight-bold primary--text">List of Food Pantries</span>
        <v-spacer></v-spacer>
        <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
        <div class="d-flex justify-left ma-4">
          <v-btn
            rounded
            small
            color="primary"
            class="ml-5"
            title="Add Food Pantry"
            @click="goToCreateForm"
          >
            <v-icon class="mr-1">add</v-icon>Add Food Pantry
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
                class="foodPantryTableRow text-left"
                tabindex="0"
              >
                <td>
                  <v-btn
                    icon
                    small
                    color="secondary"
                    @click.stop="centerOnPoint(item)"
                    title="View on Map"
                  >
                    <v-icon>map</v-icon>
                  </v-btn>
                </td>
                <td>{{ item.location_name }}</td>
                <td>
                  <div>{{ item.street_address_1 }}</div>
                  <div v-if="item.street_address_2">
                    {{
                    item.street_address_2
                    }}
                  </div>
                  <div>{{ item.city }}, {{ item.state }} {{ item.zip }}</div>
                </td>
                <td>{{ item.hours_of_operation }}</td>
                <td>
                  <span v-if="item.website">
                    <a :href="item.website" @click.stop>{{ item.website }}</a>
                  </span>
                </td>
                <td style="white-space: nowrap;">{{ item.phone }}</td>
                <td>{{ item.areas_served}}</td>
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
        text: "Name",
        value: "location_name",
      },
      {
        text: "Address",
        value: "street_address_1",
      },
      {
        text: "Hours of Operation",
        value: "hours_of_operation",
      },
      {
        text: "Website",
        value: "website",
      },
      {
        text: "Phone",
        value: "phone",
      },
      {
        text: "Areas Served",
        value: "areas_served",
      },
    ],
  }),
  methods: {
    centerOnPoint(item) {
      this.setDisplayStatusFoodPantry(true);
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
        params: { mode: "create", object: "foodPantry" },
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
      setDisplayStatusFoodPantry: "foodPantry/setDisplayStatus",
      setZoom: "map/setZoom",
    }),
  },
  props: ["itemName", "list", "name", "id"],
};
</script>

<style>
.foodPantryTableRow {
  cursor: pointer;
}
.foodPantryTableRow:focus {
  border: 2px solid var(--v-primary-lighten2) !important;
  outline: 2px solid var(--v-primary-lighten2) !important;
  border-bottom: 2px solid var(--v-primary-lighten2) !important;
}
</style>
