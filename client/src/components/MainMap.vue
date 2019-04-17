<template>
  <div>
    <v-layout>
      <l-map
        ref="map"
        style="height: 88vh; width: 100%"
        :zoom="zoom"
        :center="center"
        :maxZoom="maxZoom"
        @update:zoom="zoomUpdated"
        @update:center="centerUpdated"
        @update:bounds="boundsUpdated"
        :options="{zoomControl: false}"
      >
        <l-control-scale position="bottomleft"></l-control-scale>
        <l-tile-layer
          :url="url"
          :attribution="attribution"
        ></l-tile-layer>

        <v-geosearch
          :options="geosearchOptions"
          ref="geosearch"
        ></v-geosearch>
        <div v-if="showGroceryStores">
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
                  <strong>{{item.props.name}}</strong>
                </div>
                <div>
                  <em>{{item.props.type}}</em>
                </div>
                <div>
                  {{item.props.address}}
                </div>
              </div>
            </l-popup>
          </l-marker>
        </div>
        <div v-if="showFarmersMarkets">
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
                  <strong>{{item.props.market}}</strong>
                </div>
                <div>
                  <em>{{item.props.location}}</em>
                </div>
                <div>
                  <strong>Day:</strong> {{item.props.day}}
                </div>
                <div>
                  <strong>Open Dates:</strong> {{item.props.open_dates}}
                </div>
                <div>
                  <strong>Open Times:</strong> {{item.props.open_times}}
                </div>
                <div>
                  <strong>Accepts:</strong> {{item.props.accepts}}
                </div>
              </div>
            </l-popup>
          </l-marker>
        </div>

        <l-geo-json
          v-if="showCensusTracts"
          :geojson="pdxTractGeoJSON"
          :options="options"
          :options-style="styleFunction"
        >
        </l-geo-json>
        <l-control-zoom position="bottomright"></l-control-zoom>
        <l-control position="topright">
          <div v-if="loading">
            <v-card class="pdx-leafletControl__card">
              <v-progress-circular
                indeterminate
                rotate
                color="accent"
              ></v-progress-circular>
              Loading Map Layers...
            </v-card>
          </div>
        </l-control>
        <l-control position="topleft">
          <v-btn
            dark
            icon
            color="primary"
            @click="resetMapView"
          >
            <v-icon color="accent">home</v-icon>
          </v-btn>
        </l-control>
      </l-map>
    </v-layout>
    <div class="pdx-floatingCardContainer--left">
      <v-layout
        row
        align-start
      >
        <v-flex
          style="margin-right:-35px;"
          v-if="showMapControls"
        >
          <v-card class="pdx-leafletControl__card elevation-20">
            <div>MAP LAYERS</div>
            <v-divider class="py-2"></v-divider>
            <v-checkbox
              v-model="showCensusTracts"
              :label="`Census Tracts`"
              data-cy="checkbox--censusTracts"
            ></v-checkbox>
            <v-checkbox
              v-if="showCensusTracts"
              v-model="enableTooltip"
              :label="`Census Tract Tooltips`"
              data-cy="checkbox--tooltips"
            ></v-checkbox>
            <v-checkbox
              v-model="showGroceryStores"
              :label="`Grocery Stores`"
              data-cy="checkbox--groceryStores"
            ></v-checkbox>
            <v-checkbox
              v-model="showFarmersMarkets"
              :label="`Farmers Markets`"
              data-cy="checkbox--farmersMarkets"
            ></v-checkbox>
            <div>MAP LEGEND</div>
            <v-divider class="py-2"></v-divider>
            <v-layout
              align-start
              justify-start
              column
              fill-height
            >
              <v-flex>
                <v-layout
                  align-center
                  class="text-xs-left"
                >
                  <img
                    src="leaflet/PDXFoodMap611.svg"
                    alt="grocery store symbol"
                  >
                  <div>Grocery Stores</div>
                </v-layout>
              </v-flex>
              <v-flex>
                <v-layout align-center>
                  <img
                    src="leaflet/PDXFoodMap631.svg"
                    alt="farmers market symbol"
                  >
                  <div>Farmers Markets</div>

                </v-layout>
              </v-flex>
              <v-flex>
                <v-layout align-center>
                  <div class="pdx-legendSymbol--foodDesert"></div>
                  <div>Food Deserts*</div>

                </v-layout>
              </v-flex>

            </v-layout>
            <v-flex
              mt-2
              class="text-xs-left"
            >
              * A food desert is a census tract where more than 20% of households are low-income AND at least 33% live more than 1 mile (urban areas) or more than 10 miles (rural areas) from the nearest supermarket, supercenter, or large grocery store.
            </v-flex>
          </v-card>
        </v-flex>
        <v-btn
          style="margin-top: -5px; margin-left: 22px;"
          text
          icon
          small
          color="primary"
          @click="showMapControls = !showMapControls"
          title="Toggle map controls"
        >
          <v-icon
            v-if="showMapControls"
            color="accent"
            dark
          >chevron_left</v-icon>
          <v-icon
            v-if="!showMapControls"
            color="accent"
            dark
          >chevron_right</v-icon>
        </v-btn>
      </v-layout>
    </div>
    <div
      v-if="showSearchResults"
      class="pdx-floatingCardContainer--right"
    >
      <v-card class="pdx-leafletControl__card elevation-20">
        <v-list
          dense
          two-line
          subheader
        >
          <v-toolbar
            light
            color="accent lighten-2"
          >SEARCH RESULTS</v-toolbar>
          <v-subheader inset>Grocery stores within 1 mile: {{groceryStoreSearchResults.length}}</v-subheader>
          <v-list-tile
            v-for="item in groceryStoreSearchResults"
            :key="item.index"
          >
            <v-list-tile-avatar>
              <v-icon color="accent">shopping_cart</v-icon>
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title>{{ item.name }}</v-list-tile-title>
              <v-list-tile-sub-title>{{ item.distance | metersToMiles }} miles</v-list-tile-sub-title>
              <v-list-tile-sub-title>{{ item.address }}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-divider inset></v-divider>

          <v-subheader inset>Farmers markets within 1 mile: {{farmersMarketSearchResults.length}}</v-subheader>
          <v-list-tile
            v-for="item in farmersMarketSearchResults"
            :key="item.index"
          >
            <v-list-tile-avatar>
              <v-icon color="secondary">store</v-icon>
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title>{{ item.market }}</v-list-tile-title>
              <v-list-tile-title>{{ item.distance | metersToMiles }} miles</v-list-tile-title>
              <v-list-tile-sub-title>{{ item.location }}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
        <v-btn
          small
          color="primary"
          @click="clearSearchResults"
        >
          <v-icon color="
          accent">close</v-icon> &nbsp; Clear Results &nbsp;
        </v-btn>
      </v-card>
    </div>
    <div
      v-if="showSearchInstructions"
      class="pdx-floatingCardContainer--center"
    >
      <v-card class="pdx-leafletControl__card--instructions">
        <v-layout
          column
          align-end
        >
          <v-icon
            small
            color="primary"
            @click="showSearchInstructions=false"
          >close</v-icon>
          <v-flex>
            Search addresses in the PDX Metro area to discover sources of fresh produce nearby.
          </v-flex>
        </v-layout>
      </v-card>
    </div>
  </div>
</template>

<script>
import { OpenStreetMapProvider } from "leaflet-geosearch";
import VGeosearch from "@/components/VGeosearch.vue";

const defaultStyle = {
  weight: .75,
  color: '#A9A9A9',
  opacity: 1,
  fillColor: '#B1B6B6',
  fillOpacity: .25
};
const highlightStyle = {
  weight: 2,
  color: '#c0ca33',
  opacity: 0.9,
  fillColor: '#B1B6B6',
  fillOpacity: 0.1
};
const foodDesertDefaultStyle = {
  weight: .75,
  color: '#795548',
  opacity: 1,
  fillColor: '#795548',
  fillOpacity: .5
};
const foodDesertHighlightStyle = {
  weight: 2,
  color: '#c0ca33',
  opacity: 0.9,
  fillOpacity: .65
};

export default {
  name: 'MainMap',
  components: { VGeosearch },
  computed: {
    pdxTractGeoJSON() {
      return this.$store.state.pdxTract.pdxTractGeoJSON;
    },
    groceryStoreMarkers() {
      const geojson = this.$store.state.groceryStore.groceryStoreGeoJSON;
      let mapMarkers = [];
      if (geojson.features) {
        mapMarkers = this.createMarkers(geojson, this.groceryStoreIcon);
        return mapMarkers;
      }
      return mapMarkers;
    },
    groceryStoreSearchResults() {
      return this.$store.state.groceryStore.groceryStoreSearchResults;
    },
    farmersMarketMarkers() {
      const geojson = this.$store.state.farmersMarket.farmersMarketGeoJSON;
      let mapMarkers = [];
      if (geojson.features) {
        mapMarkers = this.createMarkers(geojson, this.farmersMarketIcon);
        return mapMarkers;
      }
      return mapMarkers;
    },
    farmersMarketSearchResults() {
      return this.$store.state.farmersMarket.farmersMarketSearchResults;
    },
    options() {
      return {
        onEachFeature: this.onEachFeatureFunction
      };
    },
    styleFunction() {
      return () => {
        return defaultStyle;
      };
    },
    onEachFeatureFunction() {
      if (!this.enableTooltip) {
        return (feature, layer) => {
          const popupContent = this.createCensusTractContent(feature.properties);
          layer.unbindTooltip();
          this.setDefaultStyles(layer, feature);
          layer.bindPopup(popupContent, { permanent: false, sticky: true, className: 'pdx-popup--census' });
        };
      }
      return (feature, layer) => {
        const tooltipContent = this.createCensusTractContent(feature.properties);
        const popupContent = this.createCensusTractContent(feature.properties);
        if (this.enableTooltip) {
          layer.bindTooltip(tooltipContent, { permanent: false, sticky: true, className: 'pdx-tooltip' });
        }
        layer.bindPopup(popupContent, { permanent: false, sticky: true, className: 'pdx-popup--census' });
        this.setDefaultStyles(layer, feature);
      };
    }
  },
  data() {
    return {
      url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      zoom: 8.5,
      center: [45.59, -122.6793],
      bounds: null,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 18,
      enableTooltip: true,
      showCensusTracts: true,
      showFarmersMarkets: false,
      showGroceryStores: false,
      showMapControls: true,
      showSearchInstructions: false,
      showSearchResults: false,
      // eslint-disable-next-line
      farmersMarketIcon: L.icon({
        iconUrl: 'leaflet/PDXFoodMap631.svg',
        iconSize: [50, 50],
        iconAnchor: [22, 94],
        shadowAnchor: [4, 62],
        popupAnchor: [-2, -96]
      }),
      // eslint-disable-next-line
      groceryStoreIcon: L.icon({
        iconUrl: 'leaflet/PDXFoodMap611.svg',
        iconSize: [50, 50],
        iconAnchor: [22, 94],
        shadowAnchor: [4, 62],
        popupAnchor: [-2, -96]
      }),
      // eslint-disable-next-line
      geosearchIcon: L.icon({
        iconUrl: 'leaflet/PDXFoodMap63.svg',
        iconSize: [64, 64],
        iconAnchor: [22, 94],
        shadowAnchor: [4, 62],
        popupAnchor: [-2, -96]
      }),
      geosearchOptions: {
        provider: new OpenStreetMapProvider(),
        style: 'button',
        autoComplete: true,
        position: 'topright',
        autoCompleteDelay: 250,
        animateZoom: false,
        marker: {
          // eslint-disable-next-line
          icon: L.icon({
            iconUrl: 'leaflet/PDXFoodMap34.svg',
            iconSize: [64, 64],
            iconAnchor: [22, 94],
            shadowAnchor: [4, 62],
            popupAnchor: [-2, -96]
          }),
          draggable: false,
        },
        maxMarkers: 2,
        keepResult: true,
        autoClose: true,
        searchLabel: "Enter an address..."
      },
    };
  },
  mounted() {
    this.$nextTick(() => {
      // this.$refs.myMap.mapObject.ANY_LEAFLET_MAP_METHOD();
      this.$refs.map.mapObject.on('geosearch/showlocation', (result) => {
        const x = result.location.x;
        const y = result.location.y;
        const geom = `${x}, ${y}`;
        const distance = 1609;
        const params = { geom, distance };
        this.$refs.map.setZoom(14);
        this.searchForPoints(params);
        this.showSearchInstructions = false;
        this.showFarmersMarkets = true;
        this.showGroceryStores = true;
        this.showCensusTracts = true;
      });

      this.$refs.map.mapObject.on('zoomend', () => {
        if (this.$refs.map.mapObject.getZoom() < 9) {
          this.showFarmersMarkets = false;
          this.showGroceryStores = false;
        }
      });
    })
  },
  methods: {
    zoomUpdated(zoom) {
      this.zoom = zoom;
    },
    centerUpdated(center) {
      this.center = center;
    },
    boundsUpdated(bounds) {
      this.bounds = bounds;
    },
    clearSearchResults() {
      this.$store.dispatch("groceryStore/clearSearchResults");
      this.$store.dispatch("farmersMarket/clearSearchResults");
      this.showSearchResults = false;
    },
    createMarkers(geojson, alternateIcon) {
      const markersArray = geojson["features"].map((feature) => {
        // eslint-disable-next-line no-undef
        let markerObject = L.latLng(feature["geometry"]["coordinates"][1], feature["geometry"]["coordinates"][0]);
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
      let propertyString =
        `<div class="pdx-tooltip__title">${props.county_1} County, ${props.state_1}</div>
      <div class="pdx-tooltip__title"><strong>Census Tract:</strong> ${props.censustrac}</div>
      <hr>
      <div>Median Family Income: <strong><span class="mono-font text-lg">${this.formatCurrency(props.medianfami)}</span></strong></div>
      <div>Poverty Rate: <strong><span class="mono-font">${props.povertyrat}%</span></strong>.<div>
      `;
      if (props.lilatrac_1 == 1) {
        propertyString += foodDesertMessage;
      }

      return propertyString;
    },
    formatCurrency(dollarValue) {
      // syntax numObj.toLocaleString([locales [, options]])
      return dollarValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0
      });
    },
    resetMapView() {
      this.$refs.map.setCenter([45.59, -122.6793]);
      this.$refs.map.setZoom(8.5);
      this.showFarmersMarkets = false;
      this.showGroceryStores = false;
    },
    async searchForPoints(params) {
      await this.$store.dispatch("groceryStore/search", params);
      await this.$store.dispatch("farmersMarket/search", params);
      this.showSearchResults = true;
    },
    setDefaultStyles(layer, feature) {
      layer.setStyle(defaultStyle);
      if (feature.properties.lilatrac_1 == 1) {
        layer.setStyle(foodDesertDefaultStyle);
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
        });
      });
    }
  },
  props: {
    loading: Boolean,
    default: function () {
      return false;
    },
  }
}
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

.pdx-floatingCardContainer--left {
  background-color: transparent;
  max-width: 360px;
  position: absolute;
  top: 120px;
  z-index: 11000;
}

.pdx-floatingCardContainer--right {
  background-color: transparent;
  position: absolute;
  right: 100px;
  top: 120px;
  width: 360px;
  z-index: 10000;
}

.pdx-floatingCardContainer--center {
  color: #795548 !important;
  background-color: transparent;
  font-weight: 400;
  font-size: 18px;
  height: 400px;
  left: 50%;
  margin-left: -200px;
  margin-top: -200px;
  opacity: 0.95;
  position: absolute;
  top: 50%;
  width: 400px;
  z-index: 10000;
}

.pdx-leafletControl__card {
  padding: 15px;
  max-height: 580px;
  opacity: 0.95;
  overflow-y: auto;
}

.pdx-leafletControl__card--instructions {
  color: #795548 !important;
  padding: 15px 15px 25px 15px;
}

.pdx-leafletControl__card img {
  height: 50px;
  width: 50px;
}

.pdx-legendSymbol--foodDesert {
  background-color: #795548;
  height: 40px;
  margin-right: 10px;
  opacity: 0.6;
  width: 40px;
}

.pdx-tooltip,
.pdx-popup--census {
  border-radius: 0 !important;
  text-align: left;
  color: #251611 !important;
  font-family: "Poppins" !important;
}

.pdx-tooltip__title,
.pdx-popup__title--census {
  font-weight: bold;
}

.pdx-message--foodDesert {
  font-weight: bold;
}

/* leaflet style overrides */

.leaflet-control {
  font-family: "Poppins" !important;
}

input {
  font-family: "Poppins" !important;
}

.leaflet-control-geosearch {
  z-index: 12000 !important;
}

.leaflet-bar-part,
.leaflet-bar-part-single {
  border: 2px solid #795548 !important;
}

.leaflet-control-geosearch a.leaflet-bar-part:before {
  border-top: 2px solid #cddc39 !important;
}

.leaflet-control-geosearch .leaflet-bar-part {
  border-radius: none;
}

.leaflet-control-geosearch .leaflet-bar-part:hover {
  opacity: 0.9;
}

.leaflet-control-geosearch a.leaflet-bar-part:after {
  border: 2px solid #cddc39 !important;
}

.leaflet-touch .leaflet-control-layers,
.leaflet-touch .leaflet-bar {
  border: 2px solid #795548 !important;
}

.leaflet-touch .leaflet-bar a {
  background-color: #795548 !important;
  color: #cddc39 !important;
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
  border: 2px solid #795548 !important;
  max-width: 290px;
}

.leaflet-control-geosearch input {
  max-width: 300px;
}

.leaflet-control-geosearch a.reset {
  background: #795548 !important;
  color: #cddc39 !important;
  font-weight: bold;
}

.leaflet-control-geosearch a.reset:hover {
  opacity: 0.9;
}

.leaflet-popup-content-wrapper {
  border-radius: 0 !important;
  font-family: "Poppins" !important;
  opacity: 0.95 !important;
  color: #251611 !important;
}
</style>
