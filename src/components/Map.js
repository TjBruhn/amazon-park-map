import React, { useRef, useEffect } from "react";

import MapView from "@arcgis/core/views/MapView";
import WebMap from "@arcgis/core/WebMap";
import Bookmarks from "@arcgis/core/widgets/Bookmarks";
import Expand from "@arcgis/core/widgets/Expand";
import Home from "@arcgis/core/widgets/Home";
import Search from "@arcgis/core/widgets/Search.js";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";

function Map({ setMapClickObject, setFormStage }) {
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

      const submissionLayer = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/submission/FeatureServer",
        outFields: ["*"],
      });

      // Add search widget
      const searchWidget = new Search({
        view: view,
        allPlaceholder: "Submissions",
        includeDefaultSources: false,
        sources: [
          {
            layer: submissionLayer,
            searchFields: ["userName"],
            displayField: "userName",
            exactMatch: false,
            outFields: ["*"],
            name: "Submitted by",
            placeholder: "Search submissions by user name",
            zoomScale: 1000,
            popupTemplate: {
              title: "Caption: {caption}",
              content: [
                {
                  // if attachments are associated with feature, display it.
                  // Autocasts as new AttachmentsContent()
                  type: "attachments",
                },
                {
                  type: "fields",
                  fieldInfos: [
                    {
                      fieldName: "submissionType",
                      label: "Submission Type:",
                    },
                    {
                      fieldName: "userName",
                      label: "Submitted by:",
                    },
                    {
                      fieldName: "submissionDateTime",
                      label: "Submitted on:",
                      format: {
                        dateFormat: "long-month-day-year-short-time",
                      },
                    },
                  ],
                },
              ],
            },
          },
          // {
          //   layer: featureLayerSenators,
          //   searchFields: ["Name", "Party"],
          //   suggestionTemplate: "{Name}, Party: {Party}",
          //   exactMatch: false,
          //   outFields: ["*"],
          //   placeholder: "example: Casey",
          //   name: "Senators",
          //   zoomScale: 500000,
          //   resultSymbol: {
          //     type: "picture-marker", // autocasts as new PictureMarkerSymbol()
          //     url: "https://developers.arcgis.com/javascript/latest//sample-code/widgets-search-multiplesource/live/images/senate.png",
          //     height: 36,
          //     width: 36
          //   }
          // },
        ],
      });
      // Add the search widget to the top right corner of the view
      const searchExpand = new Expand({
        view,
        content: searchWidget,
        expanded: false,
      });
      view.ui.add(searchExpand, {
        position: "top-right",
      });

      // Get location and feature info on a map click
      function mapClick() {
        // Listen to the click event on the view
        view.on("click", async (event) => {
          // this is a hack to get the state of formStage without rendering on each formStage state change
          // first get the element that contains the formstage in a data attribute
          const navDiv = document.getElementById("navDiv");
          //then get the current value of the formstage
          const formStageData = navDiv.dataset.formstage;

          // Only run the hit test if the stage is locate

          if (formStageData === "locate") {
            //watch the popup and if it opens close it
            function closepopup() {
              view.popup.close();
              console.log("Closed popup");
              //remove the watch
              popupWatch.remove();
            }
            // Watch popup for visible=true
            const popupWatch = reactiveUtils.when(
              () => view.popup?.visible,
              () => {
                console.log("Popup Open");
                closepopup();
              }
            );

            view.hitTest(event).then(function (response) {
              let graphicHitsArray = response.results;

              graphicHitsArray.forEach((graphicHit) => {
                if (
                  graphicHit.layer &&
                  graphicHit.layer.type === "feature" &&
                  graphicHit.layer.title !== "submission"
                ) {
                  let lat = graphicHit.mapPoint.latitude;
                  let lon = graphicHit.mapPoint.longitude;
                  let attrs = graphicHit.graphic.attributes;

                  console.log("<<<<New Result>>>>");
                  console.log("Attributes: ");
                  console.log(attrs);
                  setMapClickObject({
                    longitude: lon,
                    latitude: lat,
                    OBJECTID: attrs.OBJECTID,
                    name: attrs.name,
                    type: attrs.type,
                  });
                }
              }); // END forEach
              setFormStage("attributes");
            }); //END hittest
          } //END if
        }); //END view.on
      }

      mapClick();
    }
  }, []);

  return <div className="mapDiv" ref={mapDiv}></div>;
}

export default Map;
