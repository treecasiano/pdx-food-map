<template>
  <v-container fill-height>
    <v-layout>
      <v-flex>
        <div class="primary--text">
          <h1>About</h1>
        </div>
        <v-card class="ma-3 pa-3 primary--text">
          <v-card-title class="secondary--text">
            <h2>The Map</h2>
          </v-card-title>
          <v-card-text>
            <p>The PDX Food Environment Map is an evolving project first launched to satisfy final project requirements for GEOG 576 Geospatial Web and Mobile Programming, a course in the University of Wisconsin's MS in Cartography and GIS Development program.</p>
            <p>
              The map facilitates discovery of sources of fresh produce in the
              <a
                href="https://en.wikipedia.org/wiki/Portland_metropolitan_area"
              >Portland Metropolitan Statistical Area (MSA)</a>. It also provides food environment information at the census tract level, surfacing attributes such as food desert classification, poverty rate, vehicle access, and median household income from the USDA Food Access Research Atlas.
            </p>
            <p>A food desert is a generally defined as a neighborhood that lack sources of healthy food, typically measured in ways that take into account supermarket accessibility, individual resources, and neighborhood-level resources.</p>
            <p>The USDA classifies a census tract as being a food desert if it is "low income" and has "low access." These food access indicators are defined as follows:</p>
            <ul>
              <li>
                <em>Low Income</em> census tracts have a poverty rate greater than 20%
                <strong>OR</strong> a median family income less than or equal to 80% of the state-wide median family income (OR the metro median family income if tract is in a metro area).
              </li>
              <li>
                <em>Low Access</em> classification is based on distance to a supermarket. There are four measures available in the dataset. The PDX Metro Food Environment Map uses the first set of criteria in the list below.
                <ol>
                  <li>1) Low-income AND at least 500 people OR 33% of the population live more than ½ mile from a supermarket (10 miles if in a rural area)</li>
                  <li>2) Low-income AND at least 500 people OR 33% of the population live more than 1 mile from a supermarket (or 10 miles if in a rural area)</li>
                  <li>3) Low-income AND at least 500 people or 33% of the population live more than 2 miles from a supermarket (or 20 miles if in a rural area)</li>
                  <li>4) Low-income and at least 100 households are more than ½ mile from a supermarket and have no vehicle access OR at least 500 people or 33% of the population > 20 miles away from a supermarket, regardless of their vehicle access status.</li>
                </ol>
              </li>
            </ul>
          </v-card-text>
        </v-card>
        <v-flex>
          <v-card class="ma-3 pa-3 primary--text">
            <v-card-title class="accent--text text--darken-2">
              <h2>The Data</h2>
            </v-card-title>
            <v-card-text>
              <ul style="padding: 0;">
                <li>
                  <h3>Grocery Stores</h3>
                  <p>
                    The grocery store dataset used in the map was initially seeded with
                    <a
                      href="https://gis-pdx.opendata.arcgis.com/datasets/grocery-stores/data"
                    >open data from the City of Portland in March 2019</a>, which provided approximately 105 records for Portland only. Another 162 records were added by the map author to cover the entire MSA.
                  </p>
                </li>
                <li>
                  <h3>Farmers Markets</h3>
                  <p>
                    A
                    <a
                      href="https://gis-pdx.opendata.arcgis.com/datasets/farmers-markets"
                    >farmers market dataset</a> was obtained from the City of Portland in March 2019,
                    to which additional farmers markets from the rest of the study area have been added.
                  </p>
                </li>
                <li>
                  <h3>Food Pantries</h3>
                  <p>
                    Portland Food Pantries:
                    <a
                      href="https://www.foodpantries.org/ci/or-portland"
                    >https://www.foodpantries.org/ci/or-portland</a>
                    <br />Clark County Food Pantries:
                    <a
                      href="https://www.clarkcountyfoodbank.org/foodpantrysites"
                    >https://www.clarkcountyfoodbank.org/foodpantrysites</a>
                  </p>
                </li>
                <li>
                  <h3>Community Supported Agriculture Dropoff Sites</h3>
                  <p>
                    <a
                      href="http://gis-pdx.opendata.arcgis.com/datasets/csa-farm-dropoff-locations"
                    >
                      Community Supported Agriculture (CSA) Farm Dropoff Sites
                      were retrieved from the City of Portland
                    </a>on 2/1/2020. Data last updated on 1/29/2019.
                  </p>
                </li>
                <li>
                  <h3>Census Tracts</h3>
                  <p>
                    A shapefile with all the census tracts in the Portland-Vancouver-Hillsboro Metropolitan Statistical Area was retrieved from
                    <a
                      href="http://rlisdiscovery.oregonmetro.gov/?action=viewDetail&layerID=2588"
                    >Oregon Metro</a>.
                    <br />
                    <a
                      href="https://www.ers.usda.gov/data-products/food-access-research-atlas/"
                    >Data from the United States Department of Agriculture Economic Research Service Food Access Research Atlas</a>
                    (2017) was joined to the census tract records.
                  </p>
                </li>
                <li>
                  <h3>Transit Data</h3>
                  <p>
                    C-TRAN Public Transit was retrieved from
                    <a
                      href="https://www.c-tran.com/about-c-tran/business/c-tran-gtfs-data"
                    >https://www.c-tran.com/about-c-tran/business/c-tran-gtfs-data</a>
                    on 2/1/2020.
                    <br />TriMet Geospatial Data (Route Stops) was retrieved from
                    <a
                      href="https://developer.trimet.org/gis/"
                    >https://developer.trimet.org/gis/</a>
                    on 2/1/2020.
                    Data last updated by TriMet on 1/15/2020.
                  </p>
                </li>
                <li>
                  <h3>Bicycle Path/Trail Data</h3>
                  <p>
                    Pedestrian and Bike Trails for Clark County, WA was retrieved from
                    <a
                      href="https://gis.clark.wa.gov/gishome/metadata/#/layer/306"
                    >https://gis.clark.wa.gov/gishome/metadata/#/layer/306</a> on 2/1/2020.
                    <br />Portland Recommended Bicycle Routes was retrieved from
                    <a
                      href="http://gis-pdx.opendata.arcgis.com/datasets/recommended-bicycle-routes"
                    >http://gis-pdx.opendata.arcgis.com/datasets/recommended-bicycle-routes</a> on 2/1/2020.
                  </p>
                </li>
              </ul>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex>
          <v-card class="ma-3 pa-3 primary--text">
            <v-card-title class="tertiary--text">
              <h2>The Map Author</h2>
            </v-card-title>
            <v-card-text>
              <p>
                <a href="http://treecasiano.com">Tree Casiano</a> is a software developer for a healthcare IT company in Portland, OR and a graduate student studying Cartography and GIS Development at the University of Wisconsin-Madison.
              </p>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-flex>
    </v-layout>
  </v-container>
</template>
