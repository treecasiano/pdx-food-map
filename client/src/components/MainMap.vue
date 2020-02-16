<template>
  <div>
    <v-layout>
      <l-map
        ref="map"
        style="height: calc(100vh - 108px); width: 100%"
        :zoom="zoom"
        :center="center"
        :maxZoom="maxZoom"
        :minZoom="minZoom"
        @update:zoom="zoomUpdated"
        @update:center="centerUpdated"
        @update:bounds="boundsUpdated"
        :options="{ zoomControl: false, zoomDelta: 0.25, zoomSnap: 0.25 }"
      >
        <l-control position="topright">
          <v-btn small light @click="resetMapView">
            <v-icon color="primary">home</v-icon>
          </v-btn>
        </l-control>
        <l-control position="topright">
          <MapLayers />
        </l-control>
        <v-geosearch :options="geosearchOptions" ref="geosearch"></v-geosearch>
        <l-control position="topleft">
          <MapControls />
        </l-control>
        <l-control position="bottomleft" class="pdx-searchControls" style="width: 320px;">
          <v-radio-group class="pa-0 ma-0" v-model="radiosDistance" row label="Search radius:">
            <v-radio color="primary" label="0.5 miles" value="radio-half"></v-radio>
            <v-radio color="primary" label="1 mile" value="radio-1"></v-radio>
          </v-radio-group>
        </l-control>

        <l-control-scale position="bottomleft"></l-control-scale>
        <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>

        <div v-if="displayGroceryStores">
          <l-marker
            v-for="(item, index) in groceryStoreMarkers"
            v-bind:item="item"
            v-bind:index="index"
            v-bind:key="index + 'groceryStore'"
            :lat-lng="item"
            data-cy="groceryStorePoint"
            :icon="item.icon"
          >
            <l-popup>
              <div>
                <div>
                  <strong>{{ item.props.name }}</strong>
                </div>
                <div>
                  <em>{{ item.props.address }}</em>
                </div>
                <v-divider class="my-1" color="accent"></v-divider>
                <div>{{ item.props.type }}</div>
              </div>
            </l-popup>
          </l-marker>
        </div>
        <div v-if="displayFarmersMarkets">
          <l-marker
            v-for="(item, index) in farmersMarketMarkers"
            v-bind:item="item"
            v-bind:index="index"
            v-bind:key="index + 'farmersMarket'"
            :lat-lng="item"
            data-cy="farmersMarketPoint"
            :icon="item.icon"
            :ref="`farmersMarketMarker${item.markerId}`"
          >
            <l-popup>
              <div>
                <div>
                  <strong>{{ item.props.market }}</strong>
                </div>
                <div>
                  <em>{{ item.props.location }}</em>
                </div>
                <v-divider class="my-1" color="accent"></v-divider>
                <div v-if="item.props.day">
                  <strong>Day:</strong>
                  {{ item.props.day }}
                </div>
                <div v-if="item.props.open_dates">
                  <strong>Open Dates:</strong>
                  {{ item.props.open_dates }}
                </div>
                <div v-if="item.props.open_times">
                  <strong>Open Times:</strong>
                  {{ item.props.open_times }}
                </div>
                <div v-if="item.props.accepts">
                  <strong>Accepts:</strong>
                  {{ item.props.accepts }}
                </div>
                <div v-if="item.props.website" class="my-1">
                  <a
                    :href="item.props.website"
                    class="secondary--text font-weight-bold"
                  >>>> Visit Website</a>
                </div>
              </div>
            </l-popup>
          </l-marker>
        </div>
        <div v-if="displayCsaDropoffSites">
          <l-marker
            v-for="(item, index) in csaDropoffSiteMarkers"
            v-bind:item="item"
            v-bind:index="index"
            v-bind:key="index + 'csaDropoffSite'"
            :lat-lng="item"
            data-cy="csaDropoffSitePoint"
            :icon="item.icon"
          >
            <l-popup>
              <div>
                <div>
                  <strong>{{ item.props.farm_name }}</strong>
                </div>
                <div v-if="item.props.location">
                  <em>
                    <span>{{ item.props.location }}</span>
                  </em>
                </div>
                <v-divider class="my-1" color="accent"></v-divider>
                <div v-if="item.props.hours_of_operation">
                  <strong>Hours of Operation:</strong>
                  {{ item.props.hours_of_operation }}
                </div>
                <div v-if="item.props.phone">
                  <strong>Phone:</strong>
                  {{ item.props.phone }}
                </div>
                <div v-if="item.props.farmdescri" class="my-2">{{ item.props.farmdescri }}</div>

                <div v-if="item.props.main_produ">
                  <strong>Main Product:</strong>
                  {{ item.props.main_produ }}
                </div>
                <div v-if="item.props.share_type">
                  <strong>Share Type:</strong>
                  {{ item.props.share_type }}
                </div>
                <div v-if="item.props.home_del">
                  <strong>Home Delivery?</strong>
                  {{ item.props.home_del }}
                </div>
                <div v-if="item.props.snap">
                  <strong>Accepts SNAP?</strong>
                  {{ item.props.snap }}
                </div>
                <div v-if="item.props.website" class="mt-1">
                  <a
                    :href="item.props.website"
                    class="secondary--text font-weight-bold"
                  >>>> Visit Website</a>
                </div>
              </div>
            </l-popup>
          </l-marker>
        </div>
        <div v-if="displayFoodPantries">
          <l-marker
            v-for="(item, index) in foodPantryMarkers"
            v-bind:item="item"
            v-bind:index="index"
            v-bind:key="index + 'foodPantry'"
            :lat-lng="item"
            data-cy="foodPantryPoint"
            :icon="item.icon"
          >
            <l-popup>
              <div>
                <div>
                  <strong>{{ item.props.location_name }}</strong>
                </div>
                <div v-if="item.props.street_address_1">
                  <em>
                    <span>{{ item.props.street_address_1 }}</span>
                    <span v-if="item.props.street_address_2">, {{ item.props.street_address_2 }}</span>
                    <span v-if="item.props.city">, {{ item.props.city }}</span>
                    <span v-if="item.props.state">, {{ item.props.state }}</span>
                    <span v-if="item.props.zip" class="ml-1">{{ item.props.zip }}</span>
                  </em>
                </div>
                <v-divider class="my-1" color="accent"></v-divider>
                <div v-if="item.props.hours_of_operation">
                  <strong>Hours of Operation:</strong>
                  {{ item.props.hours_of_operation }}
                </div>
                <div v-if="item.props.phone">
                  <strong>Phone:</strong>
                  {{ item.props.phone }}
                </div>
                <div v-if="item.props.website" class="my-1">
                  <a
                    :href="item.props.website"
                    class="secondary--text font-weight-bold"
                  >>>> Visit Website</a>
                </div>
              </div>
            </l-popup>
          </l-marker>
        </div>
        <div v-if="displayCtranStops">
          <l-circle-marker
            v-for="(item, index) in ctranStopMarkers"
            v-bind:item="item"
            v-bind:index="index"
            v-bind:key="index + 'ctranStop'"
            :lat-lng="item"
            :radius="transitStopMarkerRadius"
            :fillColor="transitStopFillColor"
            color="#f2f2f2"
            :weight="1"
            :opacity="1"
            :fillOpacity="0.9"
            data-cy="ctranStopPoint"
          >
            <l-popup>
              <div>
                <span class="font-weight-bold mr-1">C-TRAN Stop ID:</span>

                <span>{{item.props.stop_id}}</span>
              </div>
              <div>
                <span class="font-weight-bold mr-1">C-TRAN Stop Name:</span>

                <span>{{item.props.stop_name}}</span>
              </div>
            </l-popup>
          </l-circle-marker>
        </div>
        <div v-if="displayTrimetStops">
          <l-circle-marker
            v-for="(item, index) in trimetStopMarkers"
            v-bind:item="item"
            v-bind:index="index"
            v-bind:key="index + 'trimetStop'"
            :lat-lng="item"
            :radius="transitStopMarkerRadius"
            :fillColor="transitStopFillColor"
            color="#f2f2f2"
            :weight="1"
            :opacity="1"
            :fillOpacity="0.9"
            data-cy="trimetStopPoint"
          >
            <l-popup>
              <div>
                <span class="font-weight-bold mr-1">TriMet Stop ID:</span>

                <span>{{item.props.stop_id}}</span>
              </div>
              <div>
                <span class="font-weight-bold mr-1">TriMet Stop Name:</span>

                <span>{{item.props.stop_name}}</span>
              </div>
            </l-popup>
          </l-circle-marker>
        </div>
        <l-geo-json
          v-if="displayPdxTracts"
          :geojson="geojsonPdxTract"
          :options="tractOptions"
          :options-style="styleFunctionTract"
        ></l-geo-json>
        <l-control-zoom position="bottomright"></l-control-zoom>
        <l-control position="topright" class="pdx-spinner">
          <div v-if="loading">
            <v-card class="pdx-leafletControl__card">
              <v-progress-circular indeterminate rotate class="ma-2" color="accent darken-1"></v-progress-circular>Loading Map Layers...
            </v-card>
          </div>
        </l-control>
      </l-map>
    </v-layout>
  </div>
</template>

<script>
// TODO: Constrain zoom out
import { mapMutations, mapState } from "vuex";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import MapControls from "@/components/MapControls.vue";
import MapLayers from "@/components/MapLayers.vue";
import VGeosearch from "@/components/VGeosearch.vue";

const tractDefaultStyle = {
  weight: 0.75,
  color: "#A9A9A9",
  opacity: 1,
  fillColor: "#B1B6B6",
  fillOpacity: 0.25,
};
const tractSelectedStyle = {
  weight: 0.75,
  color: "#A9A9A9",
  opacity: 1,
  fillColor: "#eeeeee",
  fillOpacity: 0.25,
};
const tractHighlightStyle = {
  weight: 2,
  color: "#c0ca33",
  opacity: 0.9,
  fillColor: "#B1B6B6",
  fillOpacity: 0.1,
};
const foodDesertDefaultStyle = {
  weight: 0.75,
  color: "#795548",
  opacity: 1,
  fillColor: "#795548",
  fillOpacity: 0.5,
};
const foodDesertHighlightStyle = {
  weight: 2,
  color: "#c0ca33",
  opacity: 0.9,
  fillOpacity: 0.65,
};

export default {
  name: "MainMap",
  components: { VGeosearch, MapControls, MapLayers },
  computed: {
    csaDropoffSiteMarkers() {
      const geojson = this.$store.state.csaDropoffSite.geoJSON;
      let mapMarkers = [];
      if (geojson.features) {
        mapMarkers = this.createMarkers(geojson);
        return mapMarkers;
      }
      return mapMarkers;
    },
    groceryStoreMarkers() {
      const geojson = this.$store.state.groceryStore.geoJSON;
      let mapMarkers = [];
      const icon =
        this.zoom > 12 ? this.groceryStoreIcon : this.groceryStoreIconSmall;
      if (geojson.features) {
        mapMarkers = this.createMarkers(geojson, icon);
        return mapMarkers;
      }
      return mapMarkers;
    },
    foodPantryMarkers() {
      const geojson = this.$store.state.foodPantry.geoJSON;
      let mapMarkers = [];
      if (geojson.features) {
        mapMarkers = this.createMarkers(geojson);
        return mapMarkers;
      }
      return mapMarkers;
    },
    farmersMarketMarkers() {
      const geojson = this.$store.state.farmersMarket.geoJSON;
      let mapMarkers = [];
      const icon =
        this.zoom > 12 ? this.farmersMarketIcon : this.farmersMarketIconSmall;
      if (geojson.features) {
        mapMarkers = this.createMarkers(geojson, icon);
        return mapMarkers;
      }
      return mapMarkers;
    },
    ctranStopMarkers() {
      const geojson = this.$store.state.ctranStop.geoJSON;
      let mapMarkers = [];
      if (geojson.features) {
        mapMarkers = this.createMarkers(geojson);
        return mapMarkers;
      }
      return mapMarkers;
    },
    trimetStopMarkers() {
      const geojson = this.$store.state.trimetStop.geoJSON;
      let mapMarkers = [];
      if (geojson.features) {
        mapMarkers = this.createMarkers(geojson);
        return mapMarkers;
      }
      return mapMarkers;
    },
    tractOptions() {
      return {
        onEachFeature: this.onEachTractFeatureFunction,
      };
    },
    transitStopMarkerRadius() {
      const radius = this.zoom > 11.75 ? 6 : 3;
      return radius;
    },
    styleFunctionTract() {
      return () => {
        return tractDefaultStyle;
      };
    },
    onEachTractFeatureFunction(feature, layer) {
      // The onEachFeature function has to be a computed property here
      // because of the binding of the tooltip when tooltips are hidden.
      return this.createTractLayer(feature, layer, this.displayStatusTooltip);
    },
    searchDistance() {
      if (this.radiosDistance == "radio-half") {
        return "1/2 mile";
      } else if (this.radiosDistance == "radio-1") {
        return "1 mile";
      }
      return "";
    },
    ...mapState({
      center: state => state.map.center,
      displayStatusTooltip: state => state.map.displayStatusTooltip,
      displayCsaDropoffSites: state => state.csaDropoffSite.displayStatus,
      displayFarmersMarkets: state => state.farmersMarket.displayStatus,
      displayFoodPantries: state => state.foodPantry.displayStatus,
      displayGroceryStores: state => state.groceryStore.displayStatus,
      displayPdxTracts: state => state.pdxTract.displayStatus,
      geojsonPdxTract: state => state.pdxTract.geoJSON,
      displayCtranStops: state => state.ctranStop.displayStatus,
      displayTrimetStops: state => state.trimetStop.displayStatus,
      loadingDataCsaDropoffSite: state => state.csaDropoffSite.loading,
      loadingDataFarmersMarket: state => state.farmersMarket.loading,
      loadingDataFoodPantry: state => state.foodPantry.loading,
      loadingDataGroceryStore: state => state.groceryStore.loading,
      searchResultFarmersMarket: state => state.farmersMarket.searchResult,
      searchResultFoodPantry: state => state.foodPantry.searchResult,
      searchResultGroceryStore: state => state.groceryStore.searchResult,
      zoom: state => state.map.zoom,
    }),
  },
  data() {
    return {
      url:
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      bounds: null,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      defaultCenter: [45.59, -122.6793],
      defaultZoom: 10,
      maxZoom: 18,
      minZoom: 4,
      showMapControls: true,
      radiosDistance: "radio-1",
      // eslint-disable-next-line
      farmersMarketIcon: L.icon({
        iconUrl: "leaflet/PDXFoodMap631.svg",
        iconSize: [50, 50],
        iconAnchor: [25, 50],
        popupAnchor: [-10, -50],
      }),
      // eslint-disable-next-line
      farmersMarketIconSmall: L.icon({
        iconUrl: "leaflet/PDXFoodMap631.svg",
        iconSize: [30, 30],
        iconAnchor: [25, 50],
        popupAnchor: [-10, -50],
      }),
      // eslint-disable-next-line
      groceryStoreIcon: L.icon({
        iconUrl: "leaflet/PDXFoodMap611.svg",
        iconSize: [50, 50],
        iconAnchor: [25, 50],
        popupAnchor: [-10, -50],
      }),
      // eslint-disable-next-line
      groceryStoreIconSmall: L.icon({
        iconUrl: "leaflet/PDXFoodMap611.svg",
        iconSize: [30, 30],
        iconAnchor: [25, 50],
        popupAnchor: [-10, -50],
      }),
      // eslint-disable-next-line
      geosearchIcon: L.icon({
        iconUrl: "leaflet/PDXFoodMap34.svg",
        iconSize: [64, 64],
        iconAnchor: [22, 94],
        shadowAnchor: [4, 62],
        popupAnchor: [-2, -96],
      }),
      geosearchOptions: {
        provider: new OpenStreetMapProvider(),
        style: "button",
        autoComplete: true,
        position: "topleft",
        autoCompleteDelay: 250,
        animateZoom: false,
        marker: {
          // eslint-disable-next-line
          icon: L.icon({
            iconUrl: "leaflet/PDXFoodMap34.svg",
            iconSize: [64, 64],
            iconAnchor: [22, 94],
            shadowAnchor: [4, 62],
            popupAnchor: [-2, -96],
          }),
          draggable: false,
        },
        maxMarkers: 2,
        notFoundMessage: "Sorry, that address could not be found.",
        keepResult: true,
        autoClose: true,
        searchLabel: "Enter an address...",
      },
      transitStopFillColor: "#51332D",
    };
  },
  mounted() {
    this.$nextTick(() => {
      // this.$refs.myMap.mapObject.ANY_LEAFLET_MAP_METHOD();
      this.$refs.map.mapObject.on("geosearch/showlocation", result => {
        const x = result.location.x;
        const y = result.location.y;
        const geom = `${x}, ${y}`;
        // default distance = 1 mile = 1609.34 meters
        let distance = 1609.34;
        if (this.radiosDistance === "radio-half") {
          distance = 804.672;
        }

        const params = { geom, distance };
        // eslint-disable-next-line
        console.log(result.location.label);
        // eslint-disable-next-line
        console.log(geom);
        this.$refs.map.setZoom(15.25);
        this.searchForPoints(params);
        this.setDisplayAllPointLayers(true);
        this.setMapControlMini(false);
        this.setSelectedTab("search");
      });

      this.$refs.map.mapObject.on("zoomend", () => {
        if (this.$refs.map.mapObject.getZoom() < 8) {
          this.setDisplayAllPointLayers(false);
        }
      });
    });
  },
  methods: {
    boundsUpdated(bounds) {
      this.bounds = bounds;
    },
    centerUpdated(center) {
      this.setCenter(center);
    },
    createTractLayer(feature, layer, tooltipDisplay) {
      return (feature, layer) => {
        layer.on("click", e => {
          const southWest = e.target._bounds._southWest;
          const northEast = e.target._bounds._northEast;
          const tractBounds = L.latLngBounds(southWest, northEast);
          const {
            target: {
              feature: { properties },
            },
          } = e;
          this.setTract(properties);
          this.setSelectedTab("map");
          this.$refs.map.fitBounds(tractBounds);
          this.setDisplayAllPointLayers(true);
        });
        if (tooltipDisplay) {
          const tooltipContent = this.createCensusTractContent(
            feature.properties
          );
          layer.bindTooltip(tooltipContent, {
            permanent: false,
            sticky: true,
            className: "pdx-tooltip",
          });
        } else {
          layer.unbindTooltip();
        }
        this.setDefaultTractStyles(layer, feature);
      };
    },
    clearSearchResult() {
      this.$store.dispatch("groceryStore/clearSearchResult");
      this.$store.dispatch("farmersMarket/clearSearchResult");
    },
    createMarkers(geojson, customIcon) {
      const markersArray = geojson["features"].map(feature => {
        // eslint-disable-next-line no-undef
        let markerObject = L.latLng(
          feature["geometry"]["coordinates"][1],
          feature["geometry"]["coordinates"][0]
        );
        let props = feature["properties"];

        if (customIcon) {
          let icon = customIcon;
          Object.assign(markerObject, { icon });
        }

        Object.assign(markerObject, { props, markerId: feature.id });

        return markerObject;
      });
      return markersArray;
    },
    createCensusTractContent(props) {
      const foodDesertMessage = `<div>This census tract is classified as a <span class="pdx-message--foodDesert">food desert.<span></div>`;
      const lowVehicleMessage = `<div>This census tract is classified as having <span class="pdx-message--foodDesert">low vehicle access.<span></div>`;

      let propertyString = `<div class="pdx-tooltip__title">${
        props.county_1
      } County, ${props.state_1}</div>
      <div class="pdx-tooltip__title"><strong>Census Tract:</strong> ${
        props.censustrac
      }</div>
      <hr>
      <div>Median Family Income: <strong><span class="mono-font text-lg">${this.formatCurrency(
        props.medianfami
      )}</span></strong></div>
      <div>Poverty Rate: <strong><span class="mono-font">${
        props.povertyrat
      }%</span></strong><div>
      `;
      if (props.lilatrac_1 == 1) {
        propertyString += foodDesertMessage;
      }

      if (props.hunvflag == 1) {
        propertyString += lowVehicleMessage;
      }

      return propertyString;
    },
    formatCurrency(dollarValue) {
      // syntax numObj.toLocaleString([locales [, options]])
      return dollarValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
      });
    },
    resetMapView() {
      this.setCenter(this.defaultCenter);
      this.setZoom(this.defaultZoom);
    },
    async searchForPoints(params) {
      try {
        Promise.all([
          await this.$store.dispatch("groceryStore/search", params),
          await this.$store.dispatch("farmersMarket/search", params),
          await this.$store.dispatch("foodPantry/search", params),
          await this.$store.dispatch("csaDropoffSite/search", params),
        ]);
      } catch (e) {
        // TODO: Add notifications
        console.error(e);
      }
    },
    setDefaultTractStyles(layer, feature) {
      // TODO: double-check measurment fo lilatrac_1 (1/2mi or 1mi?)
      layer.setStyle(tractDefaultStyle);
      if (feature.properties.lilatrac_1 == 1) {
        layer.setStyle(foodDesertDefaultStyle);
      }
      if (feature.properties.hunvflag == 1) {
        layer.setStyle({
          weight: 1.25,
          color: "#49332b",
        });
      }
      layer.on("mouseover", () => {
        if (feature.properties.lilatrac_1 == 1) {
          layer.setStyle(foodDesertHighlightStyle);
        } else {
          layer.setStyle(tractHighlightStyle);
        }
        layer.on("mouseout", () => {
          if (feature.properties.lilatrac_1 == 1) {
            layer.setStyle(foodDesertDefaultStyle);
          } else {
            layer.setStyle(tractDefaultStyle);
          }
          if (feature.properties.hunvflag == 1) {
            layer.setStyle({
              weight: 1.25,
              color: "#49332b",
            });
          }
        });
      });
    },
    setDisplayAllPointLayers(val) {
      this.setDisplayStatusFarmersMarket(val);
      this.setDisplayStatusGroceryStore(val);
      this.setDisplayStatusCsaDropoffSite(val);
      this.setDisplayStatusCtranStop(val);
      this.setDisplayStatusFoodPantry(val);
      this.setDisplayStatusTrimetStop(val);
    },
    zoomUpdated(zoom) {
      this.setZoom(zoom);
    },
    ...mapMutations({
      setDisplayStatusCsaDropoffSite: "csaDropoffSite/setDisplayStatus",
      setDisplayStatusCtranStop: "trimetStop/setDisplayStatus",
      setDisplayStatusFarmersMarket: "farmersMarket/setDisplayStatus",
      setDisplayStatusFoodPantry: "foodPantry/setDisplayStatus",
      setDisplayStatusGroceryStore: "groceryStore/setDisplayStatus",
      setDisplayStatusPdxTract: "pdxTract/setDisplayStatus",
      setDisplayStatusTrimetStop: "trimetStop/setDisplayStatus",
      setCenter: "map/setCenter",
      setMapControlMini: "map/setMapControlMini",
      setSelectedTab: "map/setSelectedTab",
      setTract: "pdxTract/setTract",
      setZoom: "map/setZoom",
    }),
  },
  props: {
    loading: Boolean,
    default: function() {
      return false;
    },
  },
};
</script>

<style>
.v-input--checkbox {
  margin: 0 !important;
  padding: 0 !important;
}

.v-input--slot {
  margin: 0 !important;
  padding: 0 !important;
}

.pdx-layerControls {
  height: 30px !important;
}

.pdx-layerControls--radioButtons {
  height: 20px !important;
  padding: 0;
}

.pdx-leafletControl__card {
  padding: 15px;
  max-height: 600px;
  opacity: 0.95;
  overflow-y: auto;
  font-size: small;
}

.pdx-leafletControl__card img {
  height: 50px;
  width: 50px;
}

.pdx-legendSymbol--foodDesert {
  background-color: #795548;
  height: 30px;
  margin-right: 10px;
  opacity: 0.6;
  width: 30px;
}

.pdx-legendSymbol--lowVehicle {
  background-color: transparent;
  border: 2px solid #49332b;
  height: 30px;
  margin-right: 10px;
  margin-top: 5px;
  width: 30px;
}

.pdx-tooltip,
.pdx-popup--census {
  border-radius: 0 !important;
  text-align: left;
  color: var(--v-primary-darken2) !important;
  font-family: "Muli" !important;
}

.pdx-tooltip__title,
.pdx-popup__title--census {
  font-weight: bold;
}

.pdx-message--foodDesert {
  font-weight: bold;
}

.pdx-spinner {
  position: fixed !important;
  top: 40% !important;
  left: 50% !important;
  right: 50% !important;
  width: 220px !important;
  margin-left: -110px;
}

.pdx-searchControls {
  background: rgba(255, 255, 255, 0.9) 0%;
  border-radius: 0;
  height: 3rem;
  padding: 10px 0 0 15px;
}

.pdx-searchControls .v-label {
  font-size: 14px !important;
}
/* leaflet style overrides */

.leaflet-control {
  font-family: "Muli" !important;
}

input {
  font-family: "Muli" !important;
}

.leaflet-control-geosearch {
  z-index: 12000 !important;
}

.leaflet-bar-part,
.leaflet-bar-part-single {
  border: 2px solid var(--v-primary-base) !important;
}

.leaflet-control-geosearch a.leaflet-bar-part:before {
  border-top: 2px solid var(--v-accent-base) !important;
}

.leaflet-control-geosearch .leaflet-bar-part {
  border-radius: none;
}

.leaflet-control-geosearch .leaflet-bar-part:hover {
  opacity: 0.9;
}

.leaflet-control-geosearch a.leaflet-bar-part:after {
  border: 2px solid var(--v-accent-base) !important;
}

.leaflet-touch .leaflet-control-layers,
.leaflet-touch .leaflet-bar {
  border: 2px solid var(--v-primary-base) !important;
}

.leaflet-touch .leaflet-bar a {
  background-color: var(--v-primary-base) !important;
  color: var(--v-accent-base) !important;
  font-weight: bold;
  border-bottom-left-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
  border-top-left-radius: 0 !important;
  border-top-right-radius: 0 !important;
}

.leaflet-touch .leaflet-bar a:hover {
  opacity: 0.9;
}

.leaflet-control-geosearch form {
  border: 2px solid var(--v-primary-base) !important;
  max-width: 390px;
}

.leaflet-control-geosearch input {
  max-width: 400px;
}

@media screen and (min-width: 1400px) {
  .leaflet-control-geosearch form {
    min-width: 500px !important;
    max-width: 800px !important;
  }

  .leaflet-control-geosearch input {
    min-width: 500px !important;
    max-width: 800px !important;
  }
}

.leaflet-control-geosearch a.reset {
  background: var(--v-primary-base) !important;
  color: var(--v-accent-base) !important;
  font-weight: bold;
}

.leaflet-control-geosearch a.reset:hover {
  opacity: 0.9;
}

.leaflet-popup-content-wrapper {
  border-radius: 0 !important;
  font-family: "Muli" !important;
  opacity: 0.95 !important;
  color: var(--v-primary-base) !important;
}
</style>
