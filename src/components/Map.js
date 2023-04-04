import React, { useRef, useEffect } from "react";

import MapView from "@arcgis/core/views/MapView";
import WebMap from "@arcgis/core/WebMap";
import Bookmarks from "@arcgis/core/widgets/Bookmarks";
import Expand from "@arcgis/core/widgets/Expand";
import Home from "@arcgis/core/widgets/Home";
// import Editor from "@arcgis/core/widgets/Editor";

function Map({ setSubmissionObject }) {
  const mapDiv = useRef(null);

  function mapClick(view) {
    // Listen to the click event on the view
    view.on("click", async (event) => {
      view.hitTest(event).then(function (response) {
        let graphicHitsArray = response.results;

        graphicHitsArray.forEach((graphicHit) => {
          if (
            graphicHit.layer.type === "feature" &&
            graphicHit.layer.title !== "submission"
          ) {
            let lat = graphicHit.mapPoint.latitude;
            let lon = graphicHit.mapPoint.longitude;
            let attrs = graphicHit.graphic.attributes;

            console.log("<<<<New Result>>>>");
            // console.log(graphicHit.layer.title);
            // console.log("Latitude: " + lat);
            // console.log("Longitude: " + lon);
            console.log("Attributes: ");
            console.log(attrs);
            setSubmissionObject({
              longitude: lon,
              latitude: lat,
              OBJECTID: attrs.OBJECTID,
              name: attrs.name,
              type: attrs.type,
            });
          }
        });
      }); //END hittest
    }); //END view.on
  }

  useEffect(() => {
    if (mapDiv.current) {
      /**
       * Initialize application
       */
      const webmap = new WebMap({
        portalItem: {
          id: "6b985168463441f28942e228241e63c6",
        },
      });

      const view = new MapView({
        container: mapDiv.current,
        map: webmap,
        center: [-123.085, 44.028],
        zoom: 14,
        constraints: {
          minScale: 200000,
          rotationEnabled: false,
        },
      });

      const homeWidget = new Home({
        view: view,
      });

      // adds the home widget to the top left corner of the MapView
      view.ui.add(homeWidget, "top-left");

      // const editor = new Editor({
      //   view: view,
      //   allowedWorkflows: "create-features",
      // });

      // const editExpand = new Expand({
      //   view,
      //   content: editor,
      //   expanded: false,
      // });

      // // adds the edit widget to the top right corner of the MapView
      // view.ui.add(editExpand, "top-right");

      const bookmarks = new Bookmarks({
        view,
        // allows bookmarks to be added, edited, or deleted
        editingEnabled: true,
      });

      const bkExpand = new Expand({
        view,
        content: bookmarks,
        expanded: false,
      });

      // Add the widget to the top-right corner of the view
      view.ui.add(bkExpand, "top-right");

      // map utils
      mapClick(view);
    }
  }, []);

  return <div className="mapDiv" ref={mapDiv}></div>;
}

export default Map;
