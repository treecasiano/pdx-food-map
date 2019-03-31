<template>
  <div style="height: 100%; width: 100%">
    <v-card
      class="info"
      dark
    >
      <v-card-text>
        <span>Center: {{ center }}</span>
        <span> Zoom: {{ zoom }}</span>
        <span> Bounds: {{ bounds }}</span>
      </v-card-text>
    </v-card>
    <v-layout>
      <v-flex>
        <l-map
          ref="map"
          style="height: 700px; width: 100%"
          :zoom="zoom"
          :center="center"
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
          ><l-popup>
            <div>
            <strong>name</strong>: {{item.props.first_name}} {{item.props.last_name}}
            </div>
            <div>
            <strong>favorite color:</strong> {{item.props.favorite_color}} 
            </div>
            </l-popup></l-marker>
        </l-map>
      </v-flex>
    </v-layout>

    <v-card>
      <v-card-text>
        <v-list one-line>
          <template v-for="(item, index) in exampleList">
            <v-subheader
              v-if="item.user_name"
              :key="item.user_name"
            >
              {{ item.username }}
            </v-subheader>
            <v-list-tile :key="item.user_name">
              <v-list-tile-content>
                <v-list-tile-title>{{ index + 1 }}. <span v-html="item.last_name"></span>,&nbsp;<span v-html="item.first_name"></span></v-list-tile-title>
                <v-list-tile-sub-title>Favorite color: {{ item.favorite_color}}</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </template>
        </v-list>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>

export default {
  computed: {
    exampleList() {
      return this.$store.state.example.exampleList;
    },
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
      url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      zoom: 3,
      center: [45.5155, -122.6793],
      bounds: null,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      markersArray: []
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
      const markersArray = this.exampleGeoJSON["features"].map((feature)=>{
        let markerObject = L.latLng(feature["geometry"]["coordinates"][1],feature["geometry"]["coordinates"][0]);
        let props = feature["properties"];
      
     Object.assign(markerObject, {props});
        return markerObject;
      });
      this.markersArray = markersArray;
    },
  },
}
</script>