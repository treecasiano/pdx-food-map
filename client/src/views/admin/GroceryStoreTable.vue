<template>
  <div>
    <v-card>
      <v-card-title>
        <span class="font-weight-bold primary--text">List of Grocery Stores</span>
        <v-spacer></v-spacer>
        <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
        <div class="d-flex justify-left ma-4">
          <v-btn
            rounded
            small
            color="primary"
            class="ml-5"
            title="Add Grocery Store"
            @click="goToCreateForm"
          >
            <v-icon class="mr-1">add</v-icon>Add Grocery Store
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
                class="groceryStoreTableRow text-left"
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
                <td>{{ item.name }}</td>
                <td>{{ item.address }}</td>
                <td>{{ item.type }}</td>
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
        text: "Store Name",
        value: "name",
      },
      {
        text: "Location",
        value: "address",
      },
      {
        text: "Type",
        value: "type",
      },
      {
        text: "Status",
        value: "status",
      },
    ],
  }),
  methods: {
    centerOnPoint(item) {
      this.setDisplayStatusGroceryStore(true);
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
        params: { mode: "create", object: "groceryStore" },
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
      setDisplayStatusGroceryStore: "groceryStore/setDisplayStatus",
      setZoom: "map/setZoom",
    }),
  },
  props: ["itemName", "list", "name", "id"],
};
</script>

<style>
.groceryStoreTableRow {
  cursor: pointer;
}
.groceryStoreTableRow:focus {
  border: 2px solid var(--v-primary-lighten2) !important;
  outline: 2px solid var(--v-primary-lighten2) !important;
  border-bottom: 2px solid var(--v-primary-lighten2) !important;
}
</style>
