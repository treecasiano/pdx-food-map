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
        :options="{ zoomControl: false, zoomDelta: 0.5, zoomSnap: 0.5 }"
      >
        <l-control position="topright">
          <v-btn small light @click="resetMapView">
            <v-icon color="primary">home</v-icon>
          </v-btn>
        </l-control>
        <l-control position="topright" ref="mapLayerControl">
          <MapLayers />
        </l-control>
        <v-geosearch :options="geosearchOptions" ref="geosearch"></v-geosearch>
        <l-control position="topleft" ref="mapControl">
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
                  <strong>CSA Dropoff Site for {{ item.props.farm_name }}</strong>
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
                <div v-if="item.props.farmdescri" class="my-1">{{ item.props.farmdescri }}</div>

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
                <div class="font-weight-bold">{{ item.props.location_name }}</div>
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

                <div class="font-weight-black my-2">Food Pantry</div>
                <div v-if="item.props.hours_of_operation">
                  <strong>Hours of Operation:</strong>
                  {{ item.props.hours_of_operation }}
                </div>
                <div v-if="item.props.areas_served">
                  <strong>Areas Served:</strong>
                  {{ item.props.areas_served }}
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
        <div v-if="displayBikePathsPortland">
          <l-polyline
            v-for="(item, index) in bikePathsPortland"
            v-bind:item="item"
            v-bind:index="index"
            v-bind:key="index"
            :lat-lngs="item.latlngs"
            :color="item.color"
            :weight="item.weight"
          >
            <l-popup>
              <div>
                <div class="font-weight-bold mr-1">Recommended Bike Path</div>
                <div>{{ item.props.segmentnam }}</div>
              </div>
              <div v-if="item.props.facility">{{ item.props.facility }}</div>
            </l-popup>
          </l-polyline>
        </div>
        <div v-if="displayCtranRoutes">
          <l-polyline
            v-for="(item, index) in ctranRoutes"
            v-bind:item="item"
            v-bind:index="index"
            v-bind:key="index"
            :lat-lngs="item.latlngs"
            :color="item.color"
            :weight="item.weight"
          >
            <l-popup>
              <span class="font-weight-bold mr-1">C-TRAN Route:</span>
              {{item.props.rt_long_nm}}
            </l-popup>
          </l-polyline>
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
        <div v-if="displayTrimetRoutes">
          <l-polyline
            v-for="(item, index) in trimetRoutes"
            v-bind:item="item"
            v-bind:index="index"
            v-bind:key="index"
            :lat-lngs="item.latlngs"
            :color="item.color"
            :weight="item.weight"
          >
            <l-popup>
              <span class="font-weight-bold mr-1">TriMet Route:</span>
              <span>{{item.props.public_rte}} - {{item.props.dir_desc}}</span>
              <div v-if="item.props.frequent === 'True'" class="font-weight-bold">Frequent Service</div>
              <div v-if="item.props.type">
                <span class="font-weight-bold mr-1">Route Type:</span>
                {{item.props.type}}
              </div>
            </l-popup>
          </l-polyline>
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
        <div v-if="displayTrailsClarkCounty">
          <l-polyline
            v-for="(item, index) in trailsClarkCounty"
            v-bind:item="item"
            v-bind:index="index"
            v-bind:key="index"
            :lat-lngs="item.latlngs"
            :color="item.color"
            :weight="item.weight"
          >
            <l-popup>
              <div v-if="item.props.trailname">
                <strong>Trail Name:</strong>
                {{item.props.trailname}}
              </div>
              <div v-if="item.props.systemname">
                <strong>Trail System Name:</strong>
                {{item.props.systemname}}
              </div>
              <div>
                <strong>Status:</strong>
                {{item.props.status}}
              </div>
              <div v-if="item.props.trlsurface">
                <strong>Surface:</strong>
                {{item.props.trlsurface}}
              </div>
              <div v-if="item.props.accessible">
                <strong>Accessible:&nbsp;</strong>
                <span v-if="item.props.accessible === 'Not Evaluated'">Not Evaluated</span>
                <span v-if="item.props.accessible === 'Accessible'">Yes</span>
                <span v-if="item.props.accessible === 'Not Accessible'">No</span>
              </div>
            </l-popup>
          </l-polyline>
        </div>
        <l-geo-json
          v-if="displayPdxTracts"
          :geojson="geojsonPdxTract"
          :options="tractOptions"
          :options-style="styleFunctionTract"
          ref="tractGeojson"
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
import { mapMutations, mapState } from "vuex";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import { cloneDeep } from "lodash";
import MapControls from "@/components/MapControls.vue";
import MapLayers from "@/components/MapLayers.vue";
import VGeosearch from "@/components/VGeosearch.vue";

/*limits to panning*/
var southWest = L.latLng(46.75, -124.0),
  northEast = L.latLng(44.5, -121.0);
var bounds = L.latLngBounds(southWest, northEast);

export default {
  name: "MainMap",
  components: { VGeosearch, MapControls, MapLayers },
  computed: {
    csaDropoffSiteMarkers() {
      const geojson = this.$store.state.csaDropoffSite.geoJSON;
      let mapMarkers = [];
      const icon = this.zoom > 12 ? this.csaIcon : this.csaIconSmall;
      if (geojson.features) {
        mapMarkers = this.createMarkers(geojson, icon);
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
      const icon = this.zoom > 12 ? this.pantryIcon : this.pantryIconSmall;
      if (geojson.features) {
        mapMarkers = this.createMarkers(geojson, icon);
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
    bikePathsPortland() {
      const geojson = this.$store.state.bikePathPortland.geoJSON;
      let polylines = [];
      if (geojson.features) {
        polylines = this.createPolyline(geojson, {
          color: "orange",
          weight: 4,
        });
        return polylines;
      }
      return polylines;
    },
    ctranRoutes() {
      const geojson = this.$store.state.ctranRoute.geoJSON;
      let polylines = [];
      if (geojson.features) {
        polylines = this.createPolyline(geojson, {
          color: this.transitStopFillColor,
          weight: 4,
        });
        return polylines;
      }
      return polylines;
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
    trailsClarkCounty() {
      const geojson = this.$store.state.trailClarkCounty.geoJSON;
      let polylines = [];
      if (geojson.features) {
        polylines = this.createPolyline(geojson, {
          color: "orange",
          weight: 4,
        });
        return polylines;
      }
      return polylines;
    },
    trimetRoutes() {
      const geojson = this.$store.state.trimetRoute.geoJSON;
      let polylines = [];
      if (geojson.features) {
        polylines = this.createPolyline(geojson, {
          color: this.transitStopFillColor,
          weight: 4,
        });
        return polylines;
      }
      return polylines;
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
      const radius = this.zoom > 11.75 ? 5 : 3;
      return radius;
    },
    styleFunctionTract() {
      return feature => {
        let styleConfig = {
          weight: 0.75,
          color: "#A9A9A9",
          opacity: 1,
          fillColor: "#B1B6B6",
          fillOpacity: 0.5,
        };
        if (feature.properties.lilatrac_1 === 1) {
          styleConfig.color = "#795548";
          styleConfig.fillColor = "#795548";
        }
        if (feature.properties.hunvflag === 1) {
          styleConfig.color = "#49332b";
          styleConfig.weight = 3;
        }
        return styleConfig;
      };
    },
    onEachTractFeatureFunction(feature, layer) {
      // The onEachFeature function has to be a computed property here
      // because of the need to change the behavior of the layer
      // based on the binding of the tooltip
      // and the need to update layer styles when this.selectedTract changes.
      // This feels hacky, but it'll suffice for now.
      return this.createTractLayer(
        feature,
        layer,
        this.displayStatusTooltip,
        this.selectedTract
      );
    },
    ...mapState({
      center: state => state.map.center,
      displayBikePathsPortland: state => state.bikePathPortland.displayStatus,
      displayCsaDropoffSites: state => state.csaDropoffSite.displayStatus,
      displayCtranRoutes: state => state.ctranRoute.displayStatus,
      displayCtranStops: state => state.ctranStop.displayStatus,
      displayFarmersMarkets: state => state.farmersMarket.displayStatus,
      displayFoodPantries: state => state.foodPantry.displayStatus,
      displayGroceryStores: state => state.groceryStore.displayStatus,
      displayPdxTracts: state => state.pdxTract.displayStatus,
      displayStatusTooltip: state => state.map.displayStatusTooltip,
      displayTrailsClarkCounty: state => state.trailClarkCounty.displayStatus,
      displayTrimetRoutes: state => state.trimetRoute.displayStatus,
      displayTrimetStops: state => state.trimetStop.displayStatus,
      geojsonPdxTract: state => state.pdxTract.geoJSON,
      searchRadius: state => state.map.searchRadius,
      searchResultFarmersMarket: state => state.farmersMarket.searchResult,
      searchResultFoodPantry: state => state.foodPantry.searchResult,
      searchResultGroceryStore: state => state.groceryStore.searchResult,
      selectedTract: state => state.pdxTract.tract,
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
      defaultZoom: 11.5,
      maxZoom: 18,
      minZoom: 8.5,
      showMapControls: true,
      // eslint-disable-next-line
      csaIcon: L.icon({
        iconUrl: "leaflet/map_marker_csa.svg",
        iconSize: [40, 40],
        iconAnchor: [25, 50],
        popupAnchor: [-10, -50],
      }),
      // eslint-disable-next-line
      csaIconSmall: L.icon({
        iconUrl: "leaflet/map_marker_csa.svg",
        iconSize: [25, 25],
        iconAnchor: [25, 50],
        popupAnchor: [-10, -50],
      }),
      // eslint-disable-next-line
      farmersMarketIcon: L.icon({
        iconUrl: "leaflet/map_marker_market.svg",
        iconSize: [40, 40],
        iconAnchor: [25, 50],
        popupAnchor: [-10, -50],
      }),
      // eslint-disable-next-line
      farmersMarketIconSmall: L.icon({
        iconUrl: "leaflet/map_marker_market.svg",
        iconSize: [25, 25],
        iconAnchor: [25, 50],
        popupAnchor: [-10, -50],
      }),
      // eslint-disable-next-line
      groceryStoreIcon: L.icon({
        iconUrl: "leaflet/map_marker_store.svg",
        iconSize: [40, 40],
        iconAnchor: [25, 50],
        popupAnchor: [-10, -50],
      }),
      // eslint-disable-next-line
      groceryStoreIconSmall: L.icon({
        iconUrl: "leaflet/map_marker_store.svg",
        iconSize: [25, 25],
        iconAnchor: [25, 50],
        popupAnchor: [-10, -50],
      }),
      // eslint-disable-next-line
      pantryIcon: L.icon({
        iconUrl: "leaflet/map_marker_pantry.svg",
        iconSize: [40, 40],
        iconAnchor: [25, 50],
        popupAnchor: [-10, -50],
      }),
      // eslint-disable-next-line
      pantryIconSmall: L.icon({
        iconUrl: "leaflet/map_marker_pantry.svg",
        iconSize: [25, 25],
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
        style: "bar",
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
        showPopup: true,
      },
      transitStopFillColor: "#2F4B53",
    };
  },
  mounted() {
    this.$nextTick(() => {
      // this.$refs.myMap.mapObject.ANY_LEAFLET_MAP_METHOD();
      this.$refs.map.mapObject.on(
        "geosearch/showlocation",
        async geosearchResult => {
          this.$refs.map.setZoom(14.25);
          this.searchForPoints(geosearchResult);
          this.setDisplayAllFoodSources(true);
          this.setSelectedTab("search");
        }
      );

      const geosearchResetButton = document.querySelector(".reset");
      geosearchResetButton.addEventListener("click", () => {
        this.setGeosearchResult(null);
      });

      this.$refs.map.mapObject.setMaxBounds(bounds);
      this.$refs.map.mapObject.on("drag", () => {
        this.$refs.map.mapObject.panInsideBounds(bounds, { animate: true });
      });

      const mapControl = L.DomUtil.get(this.$refs.mapControl.mapObject.element);
      mapControl.addEventListener("mouseover", () => {
        this.$refs.map.mapObject.dragging.disable();
      });
      mapControl.addEventListener("mouseout", () => {
        this.$refs.map.mapObject.dragging.enable();
      });

      const mapLayerControl = L.DomUtil.get(
        this.$refs.mapLayerControl.mapObject.element
      );
      mapLayerControl.addEventListener("mouseover", () => {
        this.$refs.map.mapObject.dragging.disable();
      });
      mapLayerControl.addEventListener("mouseout", () => {
        this.$refs.map.mapObject.dragging.enable();
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
    createTractLayer(feature, layer, tooltipDisplay, selectedTract) {
      return (feature, layer) => {
        layer.on("click", e => {
          const southWest = e.target._bounds._southWest;
          const northEast = e.target._bounds._northEast;
          // eslint-disable-next-line
          const tractBounds = L.latLngBounds(southWest, northEast);
          const {
            target: {
              feature: { properties },
            },
          } = e;
          this.setTract(properties);
          this.setSelectedTab("map");
          const polygonCenter = layer.getBounds().getCenter();
          // eslint-disable-next-line
          console.info("polygonCenter", polygonCenter);
          this.$refs.map.fitBounds(tractBounds);
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
        if (feature.properties.hunvflag === 1) {
          layer.bringToFront();
        }
        if (selectedTract.censustrac === feature.properties.censustrac) {
          layer.setStyle({ fillColor: "#c0ca33" });
        }
        layer.on("mouseover", () => {
          layer.bringToFront();
          layer.setStyle({ fillOpacity: 0.4 });
        });
        layer.on("mouseout", e => {
          layer.setStyle({ fillOpacity: 0.5 });
        });
      };
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
      return propertyString;
    },
    createPolyline(geoJSON, { color, weight }) {
      const polyLineArray = geoJSON["features"].map(feature => {
        // eslint-disable-next-line
        const coordinatesArray = feature["geometry"]["coordinates"][0];
        let polyLineObjectArray = coordinatesArray.map(coordinates => {
          // Leaflet requires the order to lat,long; geojson is formatted as long,lat
          return [coordinates[1], coordinates[0]];
        });
        let props = feature["properties"];
        const polyLineObj = Object.assign(
          {},
          {
            latlngs: polyLineObjectArray,
            props,
            color,
            weight,
          }
        );
        return polyLineObj;
      });
      return polyLineArray;
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
    async searchForPoints(geosearchResult) {
      const x = geosearchResult.location.x;
      const y = geosearchResult.location.y;
      const geom = `${x}, ${y}`;
      // 1 mile = 1609.34 meters
      const distance = this.searchRadius * 1609.34;
      const params = { geom, distance };
      // eslint-disable-next-line
      console.log(geosearchResult.location.label);
      // eslint-disable-next-line
      console.log(geom);
      this.setGeosearchResult(
        Object.assign(
          {},
          { geom, locationLabel: geosearchResult.location.label }
        )
      );
      try {
        Promise.all([
          await this.$store.dispatch("groceryStore/search", params),
          await this.$store.dispatch("farmersMarket/search", params),
          await this.$store.dispatch("foodPantry/search", params),
          await this.$store.dispatch("csaDropoffSite/search", params),
        ]);
      } catch (e) {
        // eslint-disable-next-line
        console.error(e);
      }
    },
    setDisplayAllFoodSources(val) {
      this.setDisplayStatusFarmersMarket(val);
      this.setDisplayStatusGroceryStore(val);
      this.setDisplayStatusCsaDropoffSite(val);
      this.setDisplayStatusFoodPantry(val);
    },
    setDisplayAllLineLayers(val) {
      this.setDisplayStatusBikePathPortland(val);
      this.setDisplayStatusCtranRoute(val);
      this.setDisplayStatusTrailClarkCounty(val);
      this.setDisplayStatusTrimetRoute(val);
    },
    zoomUpdated(zoom) {
      this.setZoom(zoom);
    },
    ...mapMutations({
      setDisplayStatusBikePathPortland: "bikePathPortland/setDisplayStatus",
      setDisplayStatusCsaDropoffSite: "csaDropoffSite/setDisplayStatus",
      setDisplayStatusCtranRoute: "ctranRoute/setDisplayStatus",
      setDisplayStatusCtranStop: "ctranStop/setDisplayStatus",
      setDisplayStatusFarmersMarket: "farmersMarket/setDisplayStatus",
      setDisplayStatusFoodPantry: "foodPantry/setDisplayStatus",
      setDisplayStatusGroceryStore: "groceryStore/setDisplayStatus",
      setDisplayStatusPdxTract: "pdxTract/setDisplayStatus",
      setDisplayStatusTrailClarkCounty: "trailClarkCounty/setDisplayStatus",
      setDisplayStatusTrimetRoute: "trimetRoute/setDisplayStatus",
      setDisplayStatusTrimetStop: "trimetStop/setDisplayStatus",
      setCenter: "map/setCenter",
      setGeosearchResult: "map/setGeosearchResult",
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
