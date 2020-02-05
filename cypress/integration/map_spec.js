describe("Map Controls", () => {
  const censusTractPolygons = "path";
  const groceryStoreMarkers = "[data-cy=groceryStorePoint]";
  const farmersMarketMarkers = "[data-cy=farmersMarketPoint]";
  const censusTractsCheckbox =
    "div[data-cy=checkbox--censusTracts] > .v-input__control > .v-input__slot > .v-input--selection-controls__input > .v-input--selection-controls__ripple";
  const groceryStoreCheckbox =
    ":nth-child(6) > .v-input__control > .v-input__slot > .v-input--selection-controls__input > .v-input--selection-controls__ripple";
  const groceryStoreFilterAll = "[data-cy=radioButton--allStores]";
  const groceryStoreFilterLargeChain = "[data-cy=radioButton--largeChain]";
  const groceryStoreFilterIndependent = "[data-cy=radioButton--independent]";

  const farmersMarketCheckbox =
    "div[data-cy=checkbox--farmersMarkets] > .v-input__control > .v-input__slot > .v-input--selection-controls__input > .v-input--selection-controls__ripple";
  const tooltipsCheckbox =
    "div[data-cy=checkbox--tooltips] > .v-input__control > .v-input__slot > .v-input--selection-controls__input > .v-input--selection-controls__ripple";
  const searchButton = ".leaflet-bar-part";
  const mapControlButton = ".row > .v-btn > .v-btn__content > .v-icon";
  const clearResultsButton =
    ".pdx-leafletControl__card > .v-btn > .v-btn__content";
  const welcomeWindowCloseButton = "[data-cy=welcomeWindow__button--close]";
  const zoomInButton = ".leaflet-control-zoom-in";

  beforeEach(() => {
    cy.visit("/");
  });

  it.skip("Toggles map layers", () => {
    cy.wait(7000);
    cy.get(groceryStoreCheckbox).click();
    cy.get(groceryStoreMarkers).should("have.length", 264);
    // cy.get(farmersMarketCheckbox).click();
    // cy.get(farmersMarketMarkers).should("have.length", 41);
    cy.get(censusTractPolygons).should("have.length", 491);
    cy.get(mapControlButton).click();
    cy.get(censusTractPolygons)
      .eq(400)
      .trigger("mouseover");
    cy.contains("Clackamas County, Oregon").should("be.visible");
    cy.contains("Median Family Income: $97,440").should("be.visible");
    cy.contains("Poverty Rate: 5.3%").should("be.visible");
    cy.get(mapControlButton).click();
    cy.get(tooltipsCheckbox).click();
    cy.get(censusTractPolygons)
      .eq(400)
      .trigger("blur");
    cy.contains("Clackamas County, Oregon").should("not.be.visible");
  });

  it.skip("Searches by address and displays search results", () => {
    cy.get(searchButton).click();
    cy.get(".glass").type("Portland State University");
    cy.get('[data-key="0"]').click();
    // cy.contains("Grocery Stores: 4 result(s)").should("be.visible");
    // cy.contains("Farmers Markets: 3 result(s)").should("be.visible");
  });

  it.skip("Filters grocery store layer by store type", () => {
    cy.wait(7000);
    cy.get(groceryStoreCheckbox).click();
    cy.wait(1000);
    cy.get(groceryStoreFilterLargeChain).click({ force: true });
    cy.wait(1000);
    cy.get(groceryStoreMarkers).should("have.length", 205);
    cy.get(groceryStoreFilterIndependent).click({ force: true });
    cy.wait(1000);
    cy.get(groceryStoreMarkers).should("have.length", 59);
    cy.get(groceryStoreFilterAll).click({ force: true });
    cy.wait(1000);
    cy.get(groceryStoreMarkers).should("have.length", 264);
  });
});
