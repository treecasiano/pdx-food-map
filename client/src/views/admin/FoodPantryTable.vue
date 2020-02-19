<template>
  <div>
    <v-card>
      <v-card-title>
        List of Food Pantries
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="search"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
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
                <td>{{ item.location_name }}</td>
                <td>
                  {{ item.street_address_1 }}
                  <span v-if="item.street_address_2">{{
                    item.street_address_2
                  }}</span>
                  <div>
                    <span>{{ item.city }}</span
                    >, {{ item.state }}
                  </div>
                </td>
                <td>{{ item.hours_of_operation }}</td>
                <td>{{ item.website }}</td>
                <td>{{ item.phone }}</td>
              </tr>
            </tbody>
          </template>
        </v-data-table>
      </template>
      <div ref="bottomOfTable"></div>
    </v-card>
  </div>
</template>

<script>
export default {
  data: () => ({
    search: "",
    headers: [
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
    ],
  }),
  methods: {
    goToCreateForm() {
      this.$refs.bottomOfTable.scrollIntoView();
      if (this.$router.currentRoute.path === `/admin/${this.name}/create`) {
        return;
      }
      this.$router.push({
        name: "adminObjectCreate",
        params: { mode: "create", object: "foodPantry" },
      });
    },
    goToEditForm(item) {
      this.$refs.bottomOfTable.scrollIntoView();
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
