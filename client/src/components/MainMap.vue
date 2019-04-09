<template>
  <v-layout>
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
      >
        <l-tile-layer
          :url="url"
          :attribution="attribution"
        ></l-tile-layer>
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
        <l-geo-json
          v-if="showCensusTracts"
          :geojson="pdxTractGeoJSON"
          :options="options"
          :options-style="styleFunction"
        >
        </l-geo-json>
        <l-control position="bottomleft">
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
          <v-card class="pdx-leafletControl__card">
            <v-checkbox
              v-model="showCensusTracts"
              :label="`Census Tracts`"
            ></v-checkbox>
            <v-checkbox
              v-if="showCensusTracts"
              v-model="enableTooltip"
              :label="`Census Tract Tooltips`"
            ></v-checkbox>
          </v-card>
        </l-control>
      </l-map>
    </v-flex>
  </v-layout>
</template>

<script>

export default {
  name: 'MainMap',
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
    farmersMarketMarkers() {
      const geojson = this.$store.state.farmersMarket.farmersMarketGeoJSON;
      let mapMarkers = [];
      if (geojson.features) {
        mapMarkers = this.createMarkers(geojson, this.farmersMarketIcon);
        return mapMarkers;
      }
      return mapMarkers;
    },
    options() {
      return {
        onEachFeature: this.onEachFeatureFunction
      };
    },
    styleFunction() {
      return () => {
        return {
          weight: 1,
          color: '#A9A9A9',
          opacity: 1,
          fillColor: '#B1B6B6',
          fillOpacity: .1
        };
      };
    },
    onEachFeatureFunction() {
      const highlightStyle = {
        color: '#2262CC',
        opacity: 0.6,
        fillOpacity: 0.65
      };
      const defaultStyle = {
        color: '#A9A9A9',
        opacity: 1,
        fillOpacity: .1
      };

      if (!this.enableTooltip) {
        return () => { };
      }
      return (feature, layer) => {
        const tooltipContent = this.createCensusTractContent(feature.properties);
        layer.bindTooltip(tooltipContent, { permanent: false, sticky: true, className: 'pdx-tooltip' });
        layer.on("mouseover", () => {
          layer.setStyle(highlightStyle);
          layer.on("mouseout", () => {
            layer.setStyle(defaultStyle);
          });
        });
      };
    }
  },
  data() {
    return {
      url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      zoom: 11,
      center: [45.5155, -122.6793],
      bounds: null,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 18,
      enableTooltip: true,
      showCensusTracts: true,
      // eslint-disable-next-line
      farmersMarketIcon: L.icon({
        iconUrl: 'leaflet/PDXFoodMap21.png',
        iconSize: [64, 64],
        iconAnchor: [22, 94],
        shadowAnchor: [4, 62],
        popupAnchor: [-2, -96]
      }),
      // eslint-disable-next-line
      groceryStoreIcon: L.icon({
        iconUrl: 'leaflet/pDXFoodMapConvert11.svg',
        iconSize: [64, 64],
        iconAnchor: [22, 94],
        shadowAnchor: [4, 62],
        popupAnchor: [-2, -96]
      }),
    };
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
      if (props.hunvflag == 1) {
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

.pdx-leafletControl__card {
  min-width: 200px;
  padding: 15px;
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
