<template>
  <v-card flat>
    <admin-layout>
      <template v-slot:list>
        <food-pantry-table id="gid" itemName="location_name" :list="list" name="foodPantry"></food-pantry-table>
      </template>
      <template v-slot:form>
        <v-container>
          <v-form v-if="(mode === 'edit' || mode === 'create') && record" v-model="valid">
            <v-card>
              <v-card-title v-if="mode === 'edit'">Edit Food Pantry</v-card-title>
              <v-card-title v-if="mode === 'create'">Create Food Pantry</v-card-title>
              <v-container>
                <v-text-field
                  v-model="record.location_name"
                  label="Food Pantry Name (REQUIRED)"
                  required
                  class="mx-3"
                  :rules="nameRules"
                  clearable
                ></v-text-field>
                <v-text-field
                  v-model="record.street_address_1"
                  class="mx-3"
                  label="Street Address 1"
                  clearable
                ></v-text-field>
                <v-text-field
                  v-model="record.street_address_2"
                  class="mx-3"
                  label="Street Address 2"
                  clearable
                ></v-text-field>
                <div class="d-flex flex-wrap">
                  <v-text-field v-model="record.city" class="mx-3" label="City" clearable></v-text-field>
                  <v-select v-model="record.state" class="mx-3" :items="['OR', 'WA']" label="State"></v-select>
                  <v-text-field v-model="record.zip" class="mx-3" label="ZIP Code" clearable></v-text-field>
                </div>
                <v-text-field v-model="record.website" class="mx-3" label="Website" clearable></v-text-field>
                <v-text-field v-model="record.phone" class="mx-3" label="Phone" clearable></v-text-field>
                <v-textarea
                  v-model="record.hours_of_operation"
                  auto-grow
                  clearable
                  counter="250"
                  dense
                  label="Hours of Operation"
                  class="mx-3"
                ></v-textarea>
                <v-textarea
                  v-model="record.areas_served"
                  auto-grow
                  clearable
                  counter="250"
                  dense
                  label="Areas Served"
                  class="mx-3"
                ></v-textarea>
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
                    data-cy="foodPantryForm__cancel"
                    outlined
                    @click="
                      $router.push({
                        name: 'adminObject',
                        params: { object: 'foodPantry' },
                      })
                    "
                  >Cancel</v-btn>

                  <v-btn
                    rounded
                    v-if="mode === 'edit'"
                    data-cy="foodPantryForm__button--update"
                    color="primary"
                    @click="update"
                    :disabled="!valid"
                  >Update</v-btn>

                  <v-btn
                    rounded
                    v-if="mode === 'create'"
                    data-cy="foodPantryForm__button--create"
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
import FoodPantryTable from "./FoodPantryTable";
export default {
  components: {
    AdminLayout,
    FoodPantryTable,
  },
  computed: {
    ...mapGetters({
      getById: "foodPantry/getById",
    }),
    ...mapState({
      list: state => state.foodPantry.list,
      record: state => state.foodPantry.record,
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
      await this.fetchGeoJSON();
      this.$router.push({
        name: "adminObjectEdit",
        params: { object: "foodPantry", id: this.record.gid, mode: "edit" },
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
      createRecord: "foodPantry/create",
      fetchGeoJSON: "foodPantry/geoJSON",
      fetchList: "foodPantry/list",
      updateRecord: "foodPantry/update",
    }),
    ...mapMutations({
      setRecord: "foodPantry/setRecord",
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
