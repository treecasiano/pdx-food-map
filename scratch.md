Resources:
https://jes.al/2018/02/getting-started-with-express-vuejs-postgresql/
https://vuejsdevelopers.com/2018/04/23/vue-boilerplate-template-scaffold/

https://korigan.github.io/Vue2Leaflet/#/?id=contributors

https://www.npmjs.com/package/vue2-leaflet


Project Proposal


Look at just the sources of healthy food and do a network analysis of pedestrian and/or public transportation accessibility. 


Data needed

- supermarket data set which includes grocery stores in the Portland-Vancouver statistical area 
- sidewalk data
- polygons: neighborhoods, zones of pedestrian accesibility (1m, ~15-20m walk)



Users can enter their address and see if they live in reasonable walking distance
from a source of health food based on if the point generated falls in one of the zones of accessibility
stored in the database (created from doing a network analysis on sidewalk and grocery store data)

My app won't do the network analysis on the fly, but instead will use previously generated polygons that represent zones of accessibility based on trimet bus/max lines and side walk data

I can get most of the data from an old grocery store dataset and then clean that dataset as best I can using google maps. The data does not change much over time. I'll create a coloumn for the database to track stores that have closed, serving as a "soft delete" so that I can hide it from the view  without destroying the record should the store every close. 

It can help people who have to live or want to live without a car find places where healthy food is easy to get to on foot or by bus or some combination thereof. 

To further extend the map: 

Look at wheelchair accessibility

A map that looks at the food environment of Portland Neighborhoods,
specifically, farmer's markets, restaurants, grocery stores, and convenience stores.

Display income and allow users to visualize the makeup of a neighborhood's food environment
and how it correlates to income disparities. 

AND/OR
