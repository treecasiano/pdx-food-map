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
  },
  data() {
    return {
      url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      zoom: 10.5,
      center: [45.5155, -122.6793],
      bounds: null,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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
    }
  }
}
</script>