describe("Grocery Stores", () => {
  const groceryStoreMarkerObjects = "[data-cy=groceryStorePoint]";

  beforeEach(() => {
    cy.visit("/");
  });

  it("Displays grocery store markers with popups on a map", () => {
    cy.get(groceryStoreMarkerObjects).should("have.length", 105);
  });
});
