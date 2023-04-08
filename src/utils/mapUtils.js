import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";
import Point from "@arcgis/core/geometry/Point.js";

function executeHitTest(view, setMapClickObject, setFormStage, hitArg) {
  view.hitTest(hitArg).then(function (response) {
    let graphicHitsArray = response.results;

    console.log("grphic hits", graphicHitsArray[0]);
    // TODO: set condition that if location is outside park it offers a prompt to click instead.

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
}

// Get location and feature info on a map click
export function mapClick(view, setMapClickObject, setFormStage) {
  // Listen to the click event on the view
  view.on("click", async (event) => {
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

    executeHitTest(view, setMapClickObject, setFormStage, event);
  }); // END view.on
} // END mapClick

export function mapLocate(view, setMapClickObject, setFormStage, lat, lon) {
  console.log("mapLocate called");

  const mapPoint = new Point({
    latitude: 44.031556063782176,
    longitude: -123.08528967857363,
  });

  // get the screen point for the specified map point.
  // const mapPoint = new Point({
  //   latitude: lat,
  //   longitude: lon,
  // });

  const screenPoint = view.toScreen(mapPoint);
  console.log("screenpoint: ", screenPoint);

  executeHitTest(view, setMapClickObject, setFormStage, screenPoint);
}
