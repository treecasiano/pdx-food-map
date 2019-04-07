describe("Example", () => {
  const markersArray = ".leaflet-marker-pane img";
  const popupContent = ".leaflet-popup-content";

  beforeEach(() => {
    cy.visit("/");
  });

  it("Displays grocery store markers with popups on a map", () => {
    cy.get(markersArray).should("have.length", 105);
    cy.get(markersArray)
      .first()
      .click();
      cy.wait(1000);
    cy.get(popupContent).should("contain", "Green Zebra Grocery");
  });
});
