describe("Example", () => {
  const markersArray = ".leaflet-marker-pane img";

  beforeEach(() => {
    cy.visit("/");
  });

  it("Displays grocery store markers with popups on a map", () => {
    cy.get(markersArray).should("have.length", 105);
    cy.get(markersArray)
      .first()
      .click();
    cy.contains("Green Zebra Grocery").should("be.visible");
    cy.get(markersArray)
      .eq(10)
      .click();
    cy.contains("People's Food Coop").should("be.visible");
    cy.contains("Green Zebra Grocery").should("not.be.visible");
  });
});
