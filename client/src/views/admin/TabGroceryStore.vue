<template>
  <v-card flat>
    <admin-layout>
      <template v-slot:list>
        <grocery-store-table id="gid" itemName="name" :list="list" name="groceryStore"></grocery-store-table>
      </template>
      <template v-slot:form>
        <v-container>
          <v-form v-if="(mode === 'edit' || mode === 'create') && record" v-model="valid">
            <v-card>
              <v-card-title v-if="mode === 'edit'">Edit Grocery Store</v-card-title>
              <v-card-title v-if="mode === 'create'">Create Grocery Store</v-card-title>
              <v-container>
                <v-text-field
                  v-model="record.name"
                  label="Grocery Store Name (REQUIRED)"
                  required
                  class="mx-3"
                  :rules="nameRules"
                  clearable
                ></v-text-field>
                <div class="d-flex flex-wrap">
                  <v-text-field
                    v-model="record.latitude"
                    label="Latitude (REQUIRED)"
                    required
                    type="number"
                    :rules="latitudeRules"
                    clearable
                    class="mx-3"
                  ></v-text-field>
                  <v-text-field
                    v-model="record.longitude"
                    label="Longitude (REQUIRED)"
                    required
                    type="number"
                    :rules="longitudeRules"
                    clearable
                    class="mx-3"
                  ></v-text-field>
                </div>
                <v-text-field
                  v-model="record.address"
                  class="mx-3"
                  label="Location (address)"
                  clearable
                ></v-text-field>
                <div class="d-flex flex-row">
                  <v-select
                    v-model="record.type"
                    class="mx-3"
                    :items="['Large Chain Grocery', 'Independent or Ethnic Grocery']"
                    label="Store Type"
                  ></v-select>
                  <v-select
                    v-model="record.status"
                    :items="statusOptions"
                    class="mx-3"
                    label="Status"
                  ></v-select>
                </div>

                <div class="d-flex justify-start my-3">
                  <v-btn
                    class="mr-3"
                    rounded
                    data-cy="groceryStoreForm__cancel"
                    outlined
                    @click="
                      $router.push({
                        name: 'adminObject',
                        params: { object: 'groceryStore' },
                      })
                    "
                  >Cancel</v-btn>

                  <v-btn
                    rounded
                    v-if="mode === 'edit'"
                    data-cy="groceryStoreForm__button--update"
                    color="primary"
                    @click="update"
                    :disabled="!valid"
                  >Update</v-btn>

                  <v-btn
                    rounded
                    v-if="mode === 'create'"
                    data-cy="groceryStoreForm__button--create"
                    color="primary"
                    @click="create"
                    :disabled="!valid"
                  >Submit</v-btn>
                </div>
              </v-container>
            </v-card>
          </v-form>
        </v-container>
      </template>
    </admin-layout>
  </v-card>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";
import AdminLayout from "./AdminLayout";
import GroceryStoreTable from "./GroceryStoreTable";
export default {
  components: {
    AdminLayout,
    GroceryStoreTable,
  },
  computed: {
    ...mapGetters({
      getById: "groceryStore/getById",
    }),
    ...mapState({
      list: state => state.groceryStore.list,
      record: state => state.groceryStore.record,
    }),
  },
  async created() {
    await this.fetchList();
    this.changeRecord();
  },
  data: () => ({
    valid: false,
    latitudeRules: [v => !!v || "Latitude is required"],
    longitudeRules: [v => !!v || "Longitude is required"],
    nameRules: [v => !!v || "Name is required"],
    statusOptions: ["Existing", "Under Construction", "Closed"],
  }),
  methods: {
    changeRecord() {
      const id = this.$route.params.id;
      let record = {};
      if (id) {
        record = this.getById(parseInt(id, 10));
      }
      if (record) {
        record = Object.assign({}, record);
      }
      this.setRecord(record);
    },
    async create() {
      this.record.latitude = Number(this.record.latitude);
      this.record.longitude = Number(this.record.longitude);
      try {
        await this.createRecord();
      } catch (e) {
        // eslint-disable-next-line
        console.error(e);
        return this.$emit("failure");
      }
      this.$emit("success");
      await this.fetchList();
      this.$router.push({
        name: "adminObject",
        params: { object: "groceryStore" },
      });
    },
    async update() {
      this.record.latitude = Number(this.record.latitude);
      this.record.longitude = Number(this.record.longitude);
      try {
        await this.updateRecord();
      } catch (e) {
        // eslint-disable-next-line
        console.error(e);
        return this.$emit("failure");
      }
      this.$emit("success");
      await this.fetchList();
    },
    ...mapActions({
      createRecord: "groceryStore/create",
      fetchList: "groceryStore/list",
      updateRecord: "groceryStore/update",
    }),
    ...mapMutations({
      setRecord: "groceryStore/setRecord",
    }),
  },
  props: {
    mode: {
      type: String,
    },
  },
  watch: {
    $route: "changeRecord",
  },
};
</script>
