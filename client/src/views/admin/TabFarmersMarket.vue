<template>
  <v-card flat>
    <admin-layout>
      <template v-slot:list>
        <farmers-market-table id="gid" itemName="market" :list="list" name="farmersMarket"></farmers-market-table>
      </template>
      <template v-slot:form>
        <v-container>
          <v-form v-if="(mode === 'edit' || mode === 'create') && record" v-model="valid">
            <v-card>
              <v-card-title
                v-if="mode === 'edit'"
                class="secondary--text font-weight-bold"
              >Edit Farmers Market</v-card-title>
              <v-card-title
                v-if="mode === 'create'"
                class="accent--text text--darken-2 font-weight-bold"
              >Create Farmers Market</v-card-title>
              <v-container>
                <div ref="topOfForm"></div>
                <v-text-field
                  v-model="record.market"
                  label="Farmers Market Name (REQUIRED)"
                  required
                  class="mx-3"
                  :rules="nameRules"
                  clearable
                  dense
                ></v-text-field>

                <v-text-field
                  v-model="record.location"
                  class="mx-3"
                  label="Location (address)"
                  clearable
                  dense
                ></v-text-field>

                <div class="d-flex flex-wrap">
                  <v-text-field v-model="record.day" class="mx-3" label="Day" clearable dense></v-text-field>
                  <v-text-field
                    v-model="record.open_dates"
                    class="mx-3"
                    label="Open Dates"
                    clearable
                    dense
                  ></v-text-field>
                  <v-text-field
                    v-model="record.open_times"
                    class="mx-3"
                    label="Open Times"
                    clearable
                    dense
                  ></v-text-field>
                </div>
                <v-textarea
                  v-model="record.website"
                  auto-grow
                  clearable
                  dense
                  rows="2"
                  label="Website"
                  class="mx-3"
                ></v-textarea>
                <v-textarea
                  v-model="record.accepts"
                  auto-grow
                  clearable
                  counter="250"
                  dense
                  rows="2"
                  label="Forms of Payment Accepted"
                  class="mx-3"
                ></v-textarea>
                <v-select
                  v-if="record.status"
                  v-model="record.status"
                  :items="statusOptions"
                  class="mx-3"
                  label="Status"
                  dense
                ></v-select>
                <div class="d-flex flex-wrap">
                  <v-text-field
                    v-model="record.latitude"
                    label="Latitude (REQUIRED)"
                    required
                    type="number"
                    :rules="latitudeRules"
                    clearable
                    class="mx-3"
                    dense
                  ></v-text-field>
                  <v-text-field
                    v-model="record.longitude"
                    label="Longitude (REQUIRED)"
                    required
                    type="number"
                    :rules="longitudeRules"
                    clearable
                    class="mx-3"
                    dense
                  ></v-text-field>
                </div>

                <div class="d-flex justify-start my-3">
                  <v-btn
                    class="mr-3"
                    rounded
                    data-cy="farmersMarketForm__cancel"
                    outlined
                    @click="
                      $router.push({
                        name: 'adminObject',
                        params: { object: 'farmersMarket' },
                      })
                    "
                  >Cancel</v-btn>

                  <v-btn
                    rounded
                    v-if="mode === 'edit'"
                    data-cy="farmersMarketForm__button--update"
                    color="primary"
                    @click="update"
                    :disabled="!valid"
                    class="secondary"
                  >Update</v-btn>

                  <v-btn
                    rounded
                    v-if="mode === 'create'"
                    data-cy="farmersMarketForm__button--create"
                    color="primary"
                    @click="create"
                    :disabled="!valid"
                    class="accent darken-2"
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
import FarmersMarketTable from "./FarmersMarketTable";
export default {
  components: {
    AdminLayout,
    FarmersMarketTable,
  },
  computed: {
    ...mapGetters({
      getById: "farmersMarket/getById",
    }),
    ...mapState({
      list: state => state.farmersMarket.list,
      record: state => state.farmersMarket.record,
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
    statusOptions: ["Active", "Closed"],
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
        params: { object: "farmersMarket", id: this.record.gid, mode: "edit" },
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
      createRecord: "farmersMarket/create",
      fetchGeoJSON: "farmersMarket/geoJSON",
      fetchList: "farmersMarket/list",
      updateRecord: "farmersMarket/update",
    }),
    ...mapMutations({
      setRecord: "farmersMarket/setRecord",
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
