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
          v-for="(item, index) in markersArray"
          v-bind:item="item"
          v-bind:index="index"
          v-bind:key="index"
          :lat-lng="item"
        >
          <l-popup>
            <div>
              <strong>name</strong>: {{item.props.first_name}} {{item.props.last_name}}
            </div>
            <div>
              <strong>favorite color:</strong> {{item.props.favorite_color}}
            </div>
          </l-popup>
        </l-marker>
      </l-map>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: 'MainMap',
  computed: {
    exampleGeoJSON() {
      return this.$store.state.example.exampleGeoJSON;
    },
  },
  async created() {
    await this.$store.dispatch("example/getExampleList");
    await this.$store.dispatch("example/getExampleGeoJSON");
    this.createMarkers(this.exampleGeoJSON);
  },
  data() {
    return {
      url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      zoom: 3,
      center: [45.5155, -122.6793],
      bounds: null,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      markersArray: [],
      subdomains: 'abcd',
      maxZoom: 18
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
    createMarkers() {
      const markersArray = this.exampleGeoJSON["features"].map((feature) => {
        // eslint-disable-next-line no-undef
        let markerObject = L.latLng(feature["geometry"]["coordinates"][1], feature["geometry"]["coordinates"][0]);
        let props = feature["properties"];

        Object.assign(markerObject, { props });
        return markerObject;
      });
      this.markersArray = markersArray;
    },
  },
}
</script>
