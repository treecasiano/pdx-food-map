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
          v-bind:key="index"
          :lat-lng="item"
        >
          <l-popup>
            <div>
              {{item.props}}
            </div>
          </l-popup>
        </l-marker>
        <l-geo-json
          v-if="show"
          :geojson="pdxTractGeoJSON"
          :options="options"
          :options-style="styleFunction"
        >
        </l-geo-json>
        <l-control position="topleft">
          <div v-if="loading">
            <v-card class="pdx-leafletControl__card">
              <v-progress-circular indeterminate rotate color="accent"></v-progress-circular>
              Loading Census Tract Layer... 
            </v-card>
          </div>
        </l-control>
        <l-control position="bottomleft">
          <v-card class="pdx-leafletControl__card">    
            <v-checkbox
            v-model="show"
            :label="`Census Tracts`"></v-checkbox>
              <v-checkbox
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
        mapMarkers = this.createMarkers(geojson);
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
      show: true
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
    createMarkers(geojson) {
      const markersArray = geojson["features"].map((feature) => {
        // eslint-disable-next-line no-undef
        let markerObject = L.latLng(feature["geometry"]["coordinates"][1], feature["geometry"]["coordinates"][0]);
        let props = feature["properties"];

        Object.assign(markerObject, { props });
        return markerObject;
      });
      return markersArray;
    },
    createCensusTractContent(props) {
      console.log(props);
      const propertyString = 
      `<span class="pdx-tooltip__title">${props.county_1} County, ${props.state_1}</span><br>
      <strong>CENSUS TRACT:</strong> ${props.censustrac} 
      <hr>
      <strong>MEDIAN FAMILY INCOME (2015):</strong> ${props.medianfami} <br>
      <strong>POVERTY RATE (2015):</strong> ${props.povertyrat}%<br> 
      <strong> HUNVFLAG:</strong> ${props.hunvflag}`;
      return propertyString;
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
  padding: 15px;
}
.pdx-tooltip {
  text-align: left;
}
.pdx-tooltip__title {
  font-weight: bold;
  text-align: center;
  text-transform: uppercase;
}
</style>

