import React, { useRef, useEffect } from "react";
import MapView from "@arcgis/core/views/MapView";
import WebMap from "@arcgis/core/WebMap";
import Bookmarks from "@arcgis/core/widgets/Bookmarks";
import Expand from "@arcgis/core/widgets/Expand";
import Home from "@arcgis/core/widgets/Home";
import Search from "@arcgis/core/widgets/Search.js";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";
import TimeSlider from "@arcgis/core/widgets/TimeSlider.js";
import Locate from "@arcgis/core/widgets/Locate.js";
import { mapClick, mapLocate } from "../utils/mapUtils";

function Map({ setMapClickObject, setFormStage, setIsSubmissionDisplayed }) {
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

      // Create a mapView
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

      // Create home Widget
      const homeWidget = new Home({
        view: view,
      });

      // Add the home widget to the top left corner of the MapView
      view.ui.add(homeWidget, "top-left");

      const bookmarks = new Bookmarks({
        view,
        // Allows bookmarks to be added, edited, or deleted
        editingEnabled: true,
      });

      const bkExpand = new Expand({
        view,
        content: bookmarks,
        expanded: false,
        autoCollapse: true,
      });

      // Add the widget to the top-right corner of the view
      view.ui.add(bkExpand, "top-right");

      // const submissionLayer = new FeatureLayer({
      //   url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/submission/FeatureServer",
      //   outFields: ["*"],
      // });

      // Add search widget
      const searchWidget = new Search({
        view: view,
        allPlaceholder: "Features or Submissions",
        includeDefaultSources: true,
        searchAllEnabled: true,

        // sources: [
        //   {
        //     layer: submissionLayer,
        //     searchFields: ["userName"],
        //     displayField: "userName",
        //     exactMatch: false,
        //     outFields: ["*"],
        //     name: "Submitted by",
        //     placeholder: "Search submissions by user name",
        //     zoomScale: 1000,
        //     popupTemplate: {
        //       title: "Caption: {caption}",
        //       content: [
        //         {
        //           // if attachments are associated with feature, display it.
        //           // Autocasts as new AttachmentsContent()
        //           type: "attachments",
        //         },
        //         {
        //           type: "fields",
        //           fieldInfos: [
        //             {
        //               fieldName: "submissionType",
        //               label: "Submission Type:",
        //             },
        //             {
        //               fieldName: "userName",
        //               label: "Submitted by:",
        //             },
        //             {
        //               fieldName: "submissionDateTime",
        //               label: "Submitted on:",
        //               format: {
        //                 dateFormat: "long-month-day-year-short-time",
        //               },
        //             },
        //           ],
        //         },
        //       ],
        //     },
        //   },
        // {

        //],
      });

      // Override the default search result scale
      searchWidget.on("select-result", function () {
        view.goTo({
          scale: 1000,
        });
      });

      // Add the search widget to the top right corner of the view
      const searchExpand = new Expand({
        view,
        expandTooltip: "Search Features and Submissions",
        content: searchWidget,
        expanded: false,
        autoCollapse: true,
        mode: "floating",
      });
      view.ui.add(searchExpand, {
        position: "top-right",
      });

      // creates a date object that is 7 days back from current date
      function oneWeekAgo() {
        // Get current date
        var date = new Date();
        // Subtract a week from the current date
        date.setDate(date.getDate() - 7);
        return date;
      }

      // Create a timeslider to filter submissions
      const timeSlider = new TimeSlider({
        container: "timeSliderDiv",
        visible: false,
        view: view,
        layout: "auto",
        // Show data within a given time range
        mode: "time-window",
        fullTimeExtent: {
          // Entire extent of the timeSlider
          start: new Date(2023, 2, 1),
          end: Date.now(),
        },
        timeExtent: {
          // Location of timeSlider thumbs
          start: oneWeekAgo(),
          end: Date.now(),
        },
      });
      view.ui.add(timeSlider, "bottom-right");

      // Create an expand to show/hide the time slider
      const timeExpand = new Expand({
        view,
        expandIconClass: "esri-icon-time-clock",
        expandTooltip: "Filter Submissions by Date",
        expanded: false,
        mode: "floating",
      });
      view.ui.add(timeExpand, "top-right");

      // When the time expand is expanded show time slider and hide other tools
      reactiveUtils.watch(
        () => timeExpand?.expanded,
        () => {
          timeSlider.visible = !timeSlider.visible;
          bkExpand.visible = !bkExpand.visible;
          searchExpand.visible = !searchExpand.visible;
          submissionExpand.visible = !submissionExpand.visible;
        }
      );

      // Create an expand to launch submission workflow
      const submissionExpand = new Expand({
        view,
        expandIconClass: "esri-icon-plus-circled",
        expandTooltip: "Add Submission",
        expanded: false,
        autoCollapse: true,
      });
      view.ui.add(submissionExpand, {
        position: "top-right",
      });

      // When the submission expand is expanded start the submission workflow
      reactiveUtils.when(
        () => submissionExpand?.expanded,
        () => {
          setIsSubmissionDisplayed(true);
          submissionExpand.toggle();
        }
      );
      let locateWidget = new Locate({
        view: view,
        container: "locateDiv",
      });

      // This is a hack to get the state of formStage without rendering on each formStage state change
      // Identify the target node
      const navDiv = document.getElementById("navDiv");

      // Set what to observe on the target node
      const config = { attributes: true };

      // Callback to be run when a mutation is observed
      const callback = (mutationList, observer) => {
        for (const mutation of mutationList) {
          if (mutation.type === "attributes") {
            console.log(
              `The ${mutation.attributeName} attribute was modified.`
            );
            switch (navDiv.dataset.formstage) {
              case "locate":
                locateWidget.locate().then(function (position) {
                  // Fires after the user's location has been found
                  console.log("position", position.coords);
                  let lat = position.coords.latitude;
                  let lon = position.coords.longitude;
                  mapLocate(view, setMapClickObject, setFormStage, lat, lon);
                });
                break;
              case "map":
                // Get location and feature info on a map click
                mapClick(view, setMapClickObject, setFormStage);
                break;
              default:
                break;
            }
          }
        }
      };
      // Create an observer instance linked to the callback function
      const observer = new MutationObserver(callback);

      // Start observing the target node for configured mutations
      observer.observe(navDiv, config);
    }
  }, []);

  return <div className="mapDiv" ref={mapDiv}></div>;
}

export default Map;
