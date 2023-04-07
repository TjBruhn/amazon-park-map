import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";
// Get location and feature info on a map click
export function mapClick(view, setMapClickObject, setFormStage) {
  // Listen to the click event on the view
  view.on("click", async (event) => {
    // This is a hack to get the state of formStage without rendering on each formStage state change
    // First get the element that contains the formstage in a data attribute
    const navDiv = document.getElementById("navDiv");
    // Then get the current value of the formstage
    const formStageData = navDiv.dataset.formstage;

    // Only run the hit test if the stage is locate

    if (formStageData === "locate") {
      // Watch the popup and if it opens close it
      function closepopup() {
        view.popup.close();
        console.log("Closed popup");
        // Remove the watch
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
      }); // END hittest
    } // END if
  }); // END view.on
}
