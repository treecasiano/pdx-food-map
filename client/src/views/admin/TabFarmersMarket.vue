<template>
  <v-card flat>
    <admin-layout>
      <template v-slot:list>
        <farmers-market-table
          id="gid"
          itemName="market"
          :list="list"
          name="farmersMarket"
        ></farmers-market-table>
      </template>
      <template v-slot:form>
        <v-container>
          <v-form
            v-if="(mode === 'edit' || mode === 'create') && record"
            v-model="valid"
          >
            <v-card>
              <v-card-title v-if="mode === 'edit'"
                >Edit Farmers Market</v-card-title
              >
              <v-card-title v-if="mode === 'create'"
                >Create Farmers Market</v-card-title
              >
              <v-container>
                <v-text-field
                  v-model="record.market"
                  label="Farmers Market Name (REQUIRED)"
                  required
                  class="mr-1"
                  :rules="nameRules"
                ></v-text-field>
                <v-text-field
                  v-model="record.latitude"
                  label="Latitude (REQUIRED)"
                  required
                  type="number"
                ></v-text-field>
                <v-text-field
                  v-model="record.longitude"
                  label="Longitude (REQUIRED)"
                  required
                  type="number"
                ></v-text-field>
                <v-text-field
                  v-model="record.location"
                  class="mr-1"
                  label="Location (address)"
                ></v-text-field>
                <v-text-field
                  v-model="record.day"
                  class="mr-1"
                  label="Day"
                ></v-text-field>
                <v-text-field
                  v-model="record.open_dates"
                  class="mr-1"
                  label="Open Dates"
                ></v-text-field>
                <v-text-field
                  v-model="record.open_times"
                  class="mr-1"
                  label="Open Times"
                ></v-text-field>
                <v-textarea
                  v-model="record.website"
                  auto-grow
                  clearable
                  dense
                  rows="2"
                  label="Website"
                ></v-textarea>
                <v-textarea
                  v-model="record.accepts"
                  auto-grow
                  clearable
                  counter="250"
                  dense
                  rows="2"
                  label="Forms of Payment Accepted"
                ></v-textarea>
                <v-select
                  v-if="record.status"
                  v-model="record.status"
                  :items="statusOptions"
                  class="primary--text"
                  label="Status"
                ></v-select>

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
                    >Cancel</v-btn
                  >

                  <v-btn
                    rounded
                    v-if="mode === 'edit'"
                    data-cy="farmersMarketForm__button--update"
                    color="primary"
                    @click="update"
                    :disabled="!valid"
                    >Update</v-btn
                  >

                  <v-btn
                    rounded
                    v-if="mode === 'create'"
                    data-cy="farmersMarketForm__button--create"
                    color="primary"
                    @click="create"
                    :disabled="!valid"
                    >Submit</v-btn
                  >
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
        params: { object: "farmersMarket" },
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
      createRecord: "farmersMarket/create",
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
