import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import Graphic from "@arcgis/core/Graphic.js";
import Query from "@arcgis/core/rest/support/Query.js";

// sets the initial form in the submission workflow
function GetLocation({ setFormStage, setIsSubmissionDisplayed }) {
  function getMapInfo(method) {
    switch (method) {
      case "locate":
        setFormStage("locate");
        break;
      case "map":
        setFormStage("map");
        break;
      default:
        setFormStage("initial");
        setIsSubmissionDisplayed(false);
    }

    return;
  }
  return (
    <>
      <h5>First we need to get the location of the submission</h5>
      <button onClick={() => getMapInfo("locate")}>Use My Location</button>
      <button onClick={() => getMapInfo("map")}>Select Location on Map</button>
    </>
  );
}

// That attribute collection form and submission logic
function AddAttributes({
  setFormStage,
  setIsSubmissionDisplayed,
  mapClickObject,
}) {
  let attributes = {
    caption: "",
    userName: "",
    submissionType: "Submission",
    submissionDateTime: Date.now(),
    reviewStatus: "pending",
    parkFeatureID: mapClickObject.OBJECTID,
    parkFeature: mapClickObject.name,
    parkFeatureClass: mapClickObject.type,
  };

  const layer = new FeatureLayer({
    url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/submission/FeatureServer",
  });

  let point = {
    type: "point", // autocasts as new Point()
    longitude: mapClickObject.longitude,
    latitude: mapClickObject.latitude,
  };

  const newFeature = new Graphic({
    geometry: point,
    attributes: attributes,
  });

  function submit() {
    console.log("top of Submit");
    //reference for adding features https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-FeatureLayer.html#applyEdits

    // Get the image from the attachment form
    var attachmentForm = document.getElementById("imgUploadForm");
    const formData = new FormData(attachmentForm);

    // add the new feature
    const promise = layer.applyEdits({
      addFeatures: [newFeature],
    });

    // after successful add get Object Id of new feature from the result and use it to add attachment
    promise
      .then((result) => {
        console.log("Feature added: ");
        console.log(result.addFeatureResults[0]);

        // get OID of new feature
        let justAddedOID = result.addFeatureResults[0]?.objectId;

        // Create Query to retrieve new feature
        const query = new Query();
        query.where = "OBJECTID='" + justAddedOID + "'";
        query.returnGeometry = true;
        query.outFields = ["*"];

        // query for new feature
        layer.queryFeatures(query).then(function (results) {
          // get the graphic that was just added
          let justAddedGraphic = results.features[0];
          //add the image attachment to the feature
          layer
            .addAttachment(justAddedGraphic, formData)
            .then(function (result) {
              console.log("attachment added: ", result);
            })
            .catch(function (err) {
              console.log("attachment adding failed: ", err);
            });
        });
      })
      .catch((error) => {
        console.error(error);
      });

    console.log("Bottom of submit");
    console.log(attributes);

    setIsSubmissionDisplayed(false);
    setFormStage("initial");
  }

  function cancel() {
    console.log("cancel");
    setIsSubmissionDisplayed(false);
    setFormStage("initial");
  }
  return (
    <>
      <form id="imgUploadForm">
        Image:
        <input type="file" name="attachment" />
      </form>
      <label>
        Caption:
        <textarea
          rows="2"
          onChange={(e) => (attributes.caption = e.target.value)}
        />
      </label>
      <label>
        Submitted by:
        <input
          type="text"
          onChange={(e) => (attributes.userName = e.target.value)}
        />
      </label>
      <label>
        Submission Type:
        <select
          list="submissionType"
          onChange={(e) => (attributes.submissionType = e.target.value)}
          defaultValue={"Submission"}
        >
          <option value="Submission">Submission</option>
          <option value="report">Report an Issue</option>
        </select>
      </label>

      <label>
        Park Feature:
        <input
          type="text"
          onChange={(e) => (attributes.parkFeature = e.target.value)}
          value={mapClickObject.name}
        />
      </label>
      <label>
        Park Feature Class:
        <input
          type="text"
          onChange={(e) => (attributes.parkFeatureClass = e.target.value)}
          value={mapClickObject.type}
        />
      </label>
      <button onClick={submit}>Submit</button>
      <button onClick={cancel}>Cancel</button>
    </>
  );
}

const Submission = ({
  setIsSubmissionDisplayed,
  formStage,
  setFormStage,
  mapClickObject,
}) => {
  const submissionDisplayHandler = () => {
    setIsSubmissionDisplayed(false);
    setFormStage("initial");
  };

  function toggleform() {
    switch (formStage) {
      case "initial":
        setFormStage("attributes");
        break;
      default:
        setFormStage("initial");
    }
  }

  switch (formStage) {
    case "map":
      return (
        <div className="popupMapInteract">
          <h3>Click the Location</h3>
        </div>
      );

    default:
      return (
        <div className="popupPage">
          <div className="popupContent">
            <button onClick={submissionDisplayHandler}>close</button>
            <button onClick={toggleform}>toggle form</button>
            <h3>Submit to the Amazon Park Community Experience Project</h3>
            {formStage === "initial" && (
              <GetLocation
                setFormStage={setFormStage}
                setIsSubmissionDisplayed={setIsSubmissionDisplayed}
              />
            )}
            {formStage === "attributes" && (
              <AddAttributes
                setFormStage={setFormStage}
                setIsSubmissionDisplayed={setIsSubmissionDisplayed}
                mapClickObject={mapClickObject}
              />
            )}
          </div>
        </div>
      );
  }
};

export default Submission;
