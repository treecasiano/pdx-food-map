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
              <v-card-title
                v-if="mode === 'edit'"
                class="secondary--text font-weight-bold"
              >Edit Grocery Store</v-card-title>
              <v-card-title
                v-if="mode === 'create'"
                class="accent--text text--darken-2 font-weight-bold"
              >Create Grocery Store</v-card-title>
              <v-container>
                <div ref="topOfForm"></div>
                <v-text-field
                  v-model="record.name"
                  label="Grocery Store Name (REQUIRED)"
                  required
                  class="mx-3"
                  :rules="nameRules"
                  clearable
                ></v-text-field>
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
                    class="secondary"
                  >Update</v-btn>

                  <v-btn
                    rounded
                    v-if="mode === 'create'"
                    data-cy="groceryStoreForm__button--create"
                    color="primary"
                    @click="create"
                    :disabled="!valid"
                    class="accent darken-2"
                  >Submit</v-btn>
                  <v-spacer></v-spacer>
                  <v-btn
                    rounded
                    outlined
                    color="secondary"
                    v-if="mode === 'edit'"
                    data-cy="groceryStoreForm__button--centerOnPoint"
                    @click="centerOnPoint(record)"
                  >
                    <v-icon class="mr-1">map</v-icon>View on Map
                  </v-btn>
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
    latitudeRules: [
      v => !!v || "Latitude is required",
      v => v >= 44.6 || "Latitude is outside the Metro area",
      v => v <= 46.75 || "Latitude is outside the Metro area",
    ],
    longitudeRules: [
      v => !!v || "Longitude is required",
      v => v >= -124.0 || "Longitude is outside the Metro area",
      v => v <= -122.0 || "Longitude is outside the Metro area",
    ],
    nameRules: [v => !!v || "Name is required"],
    statusOptions: ["Existing", "Under Construction", "Closed"],
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
      this.$nextTick(() => {
        if (this.$refs.topOfForm) {
          this.$refs.topOfForm.scrollIntoView();
        }
      });
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
      await this.fetchGeoJSON();
      this.$router.push({
        name: "adminObjectEdit",
        params: { object: "groceryStore", id: this.record.gid, mode: "edit" },
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
      await this.fetchGeoJSON();
    },
    ...mapActions({
      createRecord: "groceryStore/create",
      fetchGeoJSON: "groceryStore/geoJSON",
      fetchList: "groceryStore/list",
      updateRecord: "groceryStore/update",
    }),
    ...mapMutations({
      setCenter: "map/setCenter",
      setDisplayStatusGroceryStore: "groceryStore/setDisplayStatus",
      setRecord: "groceryStore/setRecord",
      setZoom: "map/setZoom",
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
