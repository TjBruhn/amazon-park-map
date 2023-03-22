import React, { useRef, useEffect } from "react";

import MapView from "@arcgis/core/views/MapView";
import WebMap from "@arcgis/core/WebMap";
import Bookmarks from "@arcgis/core/widgets/Bookmarks";
import Expand from "@arcgis/core/widgets/Expand";
import Home from "@arcgis/core/widgets/Home";
import Editor from "@arcgis/core/widgets/Editor";
import "./App.css";

function App() {
  const mapDiv = useRef(null);

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

      const editor = new Editor({
        view: view,
        allowedWorkflows: "create-features",
      });

      const editExpand = new Expand({
        view,
        content: editor,
        expanded: false,
      });

      // adds the edit widget to the top right corner of the MapView
      view.ui.add(editExpand, "top-right");

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
    }
  }, []);

  return (
    <>
      <div className="header">
        <h1>Amazon Park</h1>
      </div>
      <div className="mapDiv" ref={mapDiv}></div>
    </>
  );
}

export default App;
