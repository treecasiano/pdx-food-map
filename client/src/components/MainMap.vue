<template>
  <v-layout>
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
            <v-checkbox
              v-model="showCensusTracts"
              :label="`Census Tracts`"
            ></v-checkbox>
            <v-checkbox
              v-if="showCensusTracts"
              v-model="enableTooltip"
              :label="`Census Tract Tooltips`"
            ></v-checkbox>
            <v-checkbox
              v-model="showGroceryStores"
              :label="`Grocery Stores`"
            ></v-checkbox>
            <v-checkbox
              v-model="showFarmersMarkets"
              :label="`Farmers Markets`"
            ></v-checkbox>
            <v-spacer></v-spacer>
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
                    src="leaflet/PDXFoodMap31.svg"
                    alt="grocery store symbol"
                  >
                  <div>Grocery Stores</div>
                </v-layout>
              </v-flex>
              <v-flex>
                <v-layout align-center>
                  <img
                    src="leaflet/PDXFoodMap33.svg"
                    alt="farmers market symbol"
                  >
                  <div>Farmers Markets</div>

                </v-layout>
              </v-flex>
              <v-flex>
                <v-layout align-center>
                  <div class="pdx-legendSymbol--foodDesert"></div>
                  <div>Food Deserts</div>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-card>
        </v-flex>
        <v-btn
          style="margin-top: -15px; margin-left: 18px;"
          text
          icon
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
      v-if="groceryStoreSearchResults.length || farmersMarketSearchResults.length"
      class="pdx-floatingCardContainer--right"
    >
      <v-card class="pdx-leafletControl__card elevation-20">
        <v-list
          two-line
          subheader
        >
          <v-subheader inset>Grocery Store Search Results: {{groceryStoreSearchResults.length}}</v-subheader>
          <v-list-tile
            v-for="item in groceryStoreSearchResults"
            :key="item.index"
          >
            <v-list-tile-avatar>
              <v-icon color="accent">shopping_cart</v-icon>
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title>{{ item.name }}</v-list-tile-title>
              <v-list-tile-sub-title>{{ item.distance }}km</v-list-tile-sub-title>
              <v-list-tile-sub-title>{{ item.address }}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-divider inset></v-divider>

          <v-subheader inset>Farmers Market Search Results: {{farmersMarketSearchResults.length}}</v-subheader>
          <v-list-tile
            v-for="item in farmersMarketSearchResults"
            :key="item.index"
          >
            <v-list-tile-avatar>
              <v-icon color="secondary">store</v-icon>
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title>{{ item.market }}</v-list-tile-title>
              <v-list-tile-sub-title>{{ item.location }}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>

        </v-list>
      </v-card>
    </div>
    <v-flex>
      <l-map
        ref="map"
        style="height: 700px; width: 100%"
        :zoom="zoom"
        :center="center"
        :maxZoom="maxZoom"
        @update:zoom="zoomUpdated"
        @update:center="centerUpdated"
        @update:bounds="boundsUpdated"
        :options="{zoomControl: false}"
      >
        <l-control-zoom position="bottomright"></l-control-zoom>
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
        <l-control position="topleft">
          <v-btn
            dark
            color="primary"
            @click="resetMapView"
          >
            <v-icon color="accent">home</v-icon>
          </v-btn>
        </l-control>

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

      </l-map>
    </v-flex>
  </v-layout>
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
          layer.setStyle(defaultStyle);
          layer.unbindTooltip();
        };
      }
      return (feature, layer) => {
        const tooltipContent = this.createCensusTractContent(feature.properties);
        if (this.enableTooltip) {
          layer.bindTooltip(tooltipContent, { permanent: false, sticky: true, className: 'pdx-tooltip' });
        }
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
      showFarmersMarkets: true,
      showGroceryStores: true,
      showMapControls: true,
      showSearchResults: false,
      // eslint-disable-next-line
      farmersMarketIcon: L.icon({
        iconUrl: 'leaflet/PDXFoodMap33.svg',
        iconSize: [64, 64],
        iconAnchor: [22, 94],
        shadowAnchor: [4, 62],
        popupAnchor: [-2, -96]
      }),
      // eslint-disable-next-line
      groceryStoreIcon: L.icon({
        iconUrl: 'leaflet/PDXFoodMap31.svg',
        iconSize: [64, 64],
        iconAnchor: [22, 94],
        shadowAnchor: [4, 62],
        popupAnchor: [-2, -96]
      }),
      // eslint-disable-next-line
      geosearchIcon: L.icon({
        iconUrl: 'leaflet/PDXFoodMap31.svg',
        iconSize: [64, 64],
        iconAnchor: [22, 94],
        shadowAnchor: [4, 62],
        popupAnchor: [-2, -96]
      }),
      geosearchOptions: {
        provider: new OpenStreetMapProvider(),
        style: 'bar',
        autoComplete: true,
        autoCompleteDelay: 250,
        animateZoom: false,
        marker: {
          icon: L.icon({
            iconUrl: 'leaflet/PDXFoodMap34.svg',
            iconSize: [64, 64],
            iconAnchor: [22, 94],
            shadowAnchor: [4, 62],
            popupAnchor: [-2, -96]
          }),
          draggable: false,
        },
        searchLabel: "Enter an address"
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
      <div>Median Family Income: <strong>${this.formatCurrency(props.medianfami)}</strong> </div>
      <div>Poverty Rate: <strong>${props.povertyrat}%</strong>.<div>
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
    },
    async searchForPoints(params) {
      await this.$store.dispatch("groceryStore/search", params);
      await this.$store.dispatch("farmersMarket/search", params);
      this.showSearchResults = true;
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
  height: 100%;
  opacity: 0.95;
  position: absolute;
  top: 125px;
  width: 250px;
  z-index: 100001;
}
.pdx-floatingCardContainer--right {
  background-color: transparent;
  height: 100%;
  opacity: 0.95;
  position: absolute;
  right: 0;
  top: 110px;
  width: 375px;
  z-index: 100001;
}

.pdx-leafletControl__card {
  font-family: "Anton" !important;
  padding: 15px;
  max-height: 500px;
  overflow-y: auto;
}

.pdx-leafletControl__card img {
  height: 40px;
  width: 40px;
}

.pdx-legendSymbol--foodDesert {
  background-color: #795548;
  height: 30px;
  margin-right: 10px;
  opacity: 0.6;
  width: 30px;
}

.pdx-tooltip {
  text-align: left;
}
.pdx-tooltip__title {
  font-weight: bold;
}
.pdx-message--foodDesert {
  font-weight: bold;
}
</style>
