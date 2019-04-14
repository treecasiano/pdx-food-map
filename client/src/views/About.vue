<template>
  <v-container
    fill-height
    align-center
  >
    <v-layout>
      <v-flex>
        <v-header class="primary--text">
          <h1>About</h1>
        </v-header>
        <v-card class="ma-3 pa-3 primary--text">
          <v-card-title class="secondary--text">
            <h2>The Map</h2>
          </v-card-title>
          <v-card-text class="text-xs-left">
            <p>The PDX Food Environment Map is an evolving project first launched to satisfy final project requirements for GEOG 576 Geospatial Web and Mobile Programming, a course in the University of Wisconsin's MS in Cartography and GIS Development program.</p>
            <p>The map facilitates discovery of sources of fresh produce in the <a href="https://en.wikipedia.org/wiki/Portland_metropolitan_area">Portland Metropolitan Statistical Area</a>. It also provides food environment information at the census tract level such as food desert classification, poverty rate, and median household income. </p>
          </v-card-text>
        </v-card>
        <v-flex>
          <v-card class="ma-3 pa-3 primary--text">
            <v-card-title class="accent--text text--darken-2">
              <h2>The Data</h2>
            </v-card-title>
            <v-card-text class="text-xs-left">
              <ul style="padding: 0;">
                <li><strong>Grocery Stores</strong>
                  <p>The grocery store dataset was seeded with open <a href="https://gis-pdx.opendata.arcgis.com/datasets/grocery-stores/data">data from the City of Portland</a>. This provided approximately 105 records for Portland. Data entry for the rest of the study area remains a work in progress and will be maintained by the map author. The bulk of the grocery stores for Clark and Skamania Counties in Washington have been entered as of 4/15/2019.</p>
                </li>
                <li><strong>Farmers Markets</strong>
                  <p>A <a href="https://gis-pdx.opendata.arcgis.com/datasets/farmers-markets">farmers market dataset</a> was also obtained from the City of Portland to which additional farmers market records from the rest of the study area have been added and will contine to be added and edited as needed.</p>
                </li>
                <li><strong>Census Tracts</strong>
                  <p> A shapefile with all the census tracts in the Portland-Vancouver-Hillsboro Metropolitan Statistical Area was retrieved from <a href="http://rlisdiscovery.oregonmetro.gov/?action=viewDetail&layerID=2588">Oregon Metro</a>.
                  </p>
                  <p>
                    <a href="https://www.ers.usda.gov/data-products/food-access-research-atlas/">USDA ERS Food Access Research Atlas</a> (2015) data was joined to the census tract records.
                  </p>

                </li>
              </ul>

            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex>
          <v-card class="ma-3 pa-3 primary--text">
            <v-card-title class="info--text">
              <h2>The Map Author</h2>
            </v-card-title>
            <v-card-text class="text-xs-left">
              <p>
                <a href="http://treecasiano.com">Tree Casiano</a> is a software developer for a healthcare IT company and a graduate student at the University of Wisconsin-Madison.
              </p>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-flex>

    </v-layout>
  </v-container>
</template>
