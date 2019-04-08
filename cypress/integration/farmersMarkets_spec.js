describe("Farmers Markets", () => {
  const farmersMarketMarkers = "[data-cy=farmersMarketPoint]";

  beforeEach(() => {
    cy.visit("/");
  });

  it("Displays farmers market markers on a map", () => {
    cy.get(farmersMarketMarkers).should("have.length", 17);
  });
});
