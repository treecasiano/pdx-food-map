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
          <v-btn light @click="resetMapView">
            <v-icon color="primary">home</v-icon>
          </v-btn>
        </l-control>
        <l-control position="topright">
          <MapLayers />
        </l-control>
        <l-control position="topleft"> </l-control>
        <v-geosearch :options="geosearchOptions" ref="geosearch"></v-geosearch>
        <l-control
          position="topleft"
          class="pdx-searchControls"
          style="width: 320px;"
        >
          <v-radio-group
            class="pa-0 ma-0"
            v-model="radiosDistance"
            row
            label="Search radius:"
          >
            <v-radio
              color="primary"
              label="0.5 miles"
              value="radio-half"
            ></v-radio>
            <v-radio color="primary" label="1 mile" value="radio-1"></v-radio>
          </v-radio-group>
        </l-control>
        <l-control position="topleft">
          <MapControls />
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
                  <em>{{ item.props.type }}</em>
                </div>
                <div>{{ item.props.address }}</div>
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
          >
            <l-popup>
              <div>
                <div>
                  <strong>{{ item.props.market }}</strong>
                </div>
                <div>
                  <em>{{ item.props.location }}</em>
                </div>
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
              </div>
            </l-popup>
          </l-marker>
        </div>
        <l-geo-json
          v-if="displayPdxTracts"
          :geojson="geojsonPdxTract"
          :options="options"
          :options-style="styleFunction"
        ></l-geo-json>
        <l-control-zoom position="bottomright"></l-control-zoom>
        <l-control position="topright" class="pdx-spinner">
          <div v-if="loading">
            <v-card class="pdx-leafletControl__card">
              <v-progress-circular
                indeterminate
                rotate
                class="ma-2"
                color="accent darken-1"
              ></v-progress-circular
              >Loading Map Layers...
            </v-card>
          </div>
        </l-control>
      </l-map>
    </v-layout>
  </div>
</template>

<script>
// TODO: Constrain zoom out
import { mapActions, mapMutations, mapState } from "vuex";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import MapControls from "@/components/MapControls.vue";
import MapLayers from "@/components/MapLayers.vue";
import VGeosearch from "@/components/VGeosearch.vue";

const defaultCenter = [45.59, -122.6793];
const defaultZoom = 10;

const defaultStyle = {
  weight: 0.75,
  color: "#A9A9A9",
  opacity: 1,
  fillColor: "#B1B6B6",
  fillOpacity: 0.25,
};
const highlightStyle = {
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
    groceryStoreMarkers() {
      const geojson = this.$store.state.groceryStore.geoJSON;
      let mapMarkers = [];
      if (geojson.features) {
        mapMarkers = this.createMarkers(geojson, this.groceryStoreIcon);
        return mapMarkers;
      }
      return mapMarkers;
    },
    farmersMarketMarkers() {
      const geojson = this.$store.state.farmersMarket.geoJSON;
      let mapMarkers = [];
      if (geojson.features) {
        mapMarkers = this.createMarkers(geojson, this.farmersMarketIcon);
        return mapMarkers;
      }
      return mapMarkers;
    },
    options() {
      return {
        onEachFeature: this.onEachFeatureFunction,
      };
    },
    styleFunction() {
      return () => {
        return defaultStyle;
      };
    },
    onEachFeatureFunction() {
      if (!this.displayStatusTooltip) {
        return (feature, layer) => {
          const popupContent = this.createCensusTractContent(
            feature.properties
          );
          layer.unbindTooltip();
          this.setDefaultStyles(layer, feature);
          layer.bindPopup(popupContent, {
            permanent: false,
            sticky: true,
            className: "pdx-popup--census",
          });
        };
      }
      return (feature, layer) => {
        const tooltipContent = this.createCensusTractContent(
          feature.properties
        );
        const popupContent = this.createCensusTractContent(feature.properties);
        if (this.displayStatusTooltip) {
          layer.bindTooltip(tooltipContent, {
            permanent: false,
            sticky: true,
            className: "pdx-tooltip",
          });
        }
        layer.bindPopup(popupContent, {
          permanent: false,
          sticky: true,
          className: "pdx-popup--census",
        });
        this.setDefaultStyles(layer, feature);
      };
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
      displayFarmersMarkets: state => state.farmersMarket.displayStatus,
      displayGroceryStores: state => state.groceryStore.displayStatus,
      displayPdxTracts: state => state.pdxTract.displayStatus,
      geojsonPdxTract: state => state.pdxTract.geoJSON,
      geojsonFarmersMarket: state => state.farmersMarket.geoJSON,
      geojsonGroceryStore: state => state.groceryStore.geoJSON,
      loadingDataFarmersMarket: state => state.farmersMarket.loading,
      loadingDataGroceryStore: state => state.groceryStore.loading,
      searchResultFarmersMarket: state => state.farmersMarket.searchResult,
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
      groceryStoreIcon: L.icon({
        iconUrl: "leaflet/PDXFoodMap611.svg",
        iconSize: [50, 50],
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
        this.setDisplayStatusFarmersMarket(true);
        this.setDisplayStatusGroceryStore(true);
        this.setDisplayStatusPdxTract(true);
        this.setSelectedTab("search");
      });

      this.$refs.map.mapObject.on("zoomend", () => {
        if (this.$refs.map.mapObject.getZoom() < 9) {
          this.setDisplayStatusFarmersMarket(false);
          this.setDisplayStatusGroceryStore(false);
        }
      });
    });
  },
  methods: {
    centerUpdated(center) {
      this.setCenter = center;
    },
    boundsUpdated(bounds) {
      this.bounds = bounds;
    },
    clearSearchResult() {
      this.$store.dispatch("groceryStore/clearSearchResult");
      this.$store.dispatch("farmersMarket/clearSearchResult");
      this.showSearchResult = false;
    },
    createMarkers(geojson, alternateIcon) {
      const markersArray = geojson["features"].map(feature => {
        // eslint-disable-next-line no-undef
        let markerObject = L.latLng(
          feature["geometry"]["coordinates"][1],
          feature["geometry"]["coordinates"][0]
        );
        let props = feature["properties"];

        if (alternateIcon) {
          let icon = alternateIcon;
          Object.assign(markerObject, { icon });
        }

        Object.assign(markerObject, { props });

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
      this.$refs.map.setCenter(defaultCenter);
      this.$refs.map.setZoom(defaultZoom);
    },
    async searchForPoints(params) {
      await this.$store.dispatch("groceryStore/search", params);
      await this.$store.dispatch("farmersMarket/search", params);
      this.showSearchResult = true;
    },
    setDefaultStyles(layer, feature) {
      layer.setStyle(defaultStyle);
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
          layer.setStyle(highlightStyle);
        }
        layer.on("mouseout", () => {
          if (feature.properties.lilatrac_1 == 1) {
            layer.setStyle(foodDesertDefaultStyle);
          } else {
            layer.setStyle(defaultStyle);
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
    zoomUpdated(zoom) {
      this.setZoom = zoom;
    },
    ...mapMutations({
      setDisplayStatusFarmersMarket: "farmersMarket/setDisplayStatus",
      setDisplayStatusGroceryStore: "groceryStore/setDisplayStatus",
      setDisplayStatusPdxTract: "pdxTract/setDisplayStatus",
      setCenter: "map/setCenter",
      setSelectedTab: "map/setSelectedTab",
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
