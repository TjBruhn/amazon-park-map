import { useState, useEffect } from "react";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import Graphic from "@arcgis/core/Graphic.js";
import Query from "@arcgis/core/rest/support/Query.js";

// Sets the initial form in the submission workflow
function GetLocation({ setFormStage, setIsSubmissionDisplayed }) {
  function cancel() {
    console.log("cancel");
    setIsSubmissionDisplayed(false);
    setFormStage("initial");
  }

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
      <p>How do you want to provide the location of the submission?</p>
      <div className="submissionBtns">
        <button onClick={() => getMapInfo("locate")}>Use My Location</button>
        <button onClick={() => getMapInfo("map")}>Click on Map</button>
        <button onClick={cancel}>Cancel</button>
      </div>
    </>
  );
}

// The attribute collection form and submission logic
function AddAttributes({
  setFormStage,
  setIsSubmissionDisplayed,
  mapClickObject,
}) {
  const [attributes, setAttributes] = useState({
    caption: "",
    userName: "",
    submissionType: "Submission",
    submissionDateTime: Date.now(),
    reviewStatus: "pending",
    parkFeatureID: mapClickObject.OBJECTID,
    parkFeature: mapClickObject.name,
    parkFeatureClass: mapClickObject.type,
  });

  // Run enable submit when attributes changes
  useEffect(enableSubmit, [attributes]);

  const [submitDisabled, setsubmitDisabled] = useState(true);

  const layer = new FeatureLayer({
    url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/submission/FeatureServer",
  });

  let point = {
    type: "point", // Autocasts as new Point()
    longitude: mapClickObject.longitude,
    latitude: mapClickObject.latitude,
  };

  const newFeature = new Graphic({
    geometry: point,
    attributes: attributes,
  });

  function submit() {
    console.log("top of Submit");
    // Reference for adding features https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-FeatureLayer.html#applyEdits

    // Get the image from the attachment form
    var attachmentForm = document.getElementById("imgUploadForm");
    const formData = new FormData(attachmentForm);

    // Add the new feature
    const promise = layer.applyEdits({
      addFeatures: [newFeature],
    });

    // After successful add get Object Id of new feature from the result and use it to add attachment
    promise
      .then((result) => {
        console.log("Feature added: ");
        console.log(result.addFeatureResults[0]);

        // Get OID of new feature
        let justAddedOID = result.addFeatureResults[0]?.objectId;

        // Create Query to retrieve new feature
        const query = new Query();
        query.where = "OBJECTID='" + justAddedOID + "'";
        query.returnGeometry = true;
        query.outFields = ["*"];

        // Query for new feature
        layer.queryFeatures(query).then(function (results) {
          // Get the graphic that was just added
          let justAddedGraphic = results.features[0];
          // Add the image attachment to the feature
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

  //
  function enableSubmit() {
    let disableSubmit = true;
    var attachmentForm = document.getElementById("imgfile");

    // Check for an image
    if (!attachmentForm.files.length) {
      setsubmitDisabled(disableSubmit);
      return;
    }
    // Check that all the other fields are complete
    for (const property in attributes) {
      if (!attributes[property]) {
        disableSubmit = true;
        break;
      } else {
        disableSubmit = false;
      }
    }

    setsubmitDisabled(disableSubmit);
    return;
  }
  // Form elements that could be added if app extended to use relationship between park features and submissions
  // <label>
  //       Park Feature:
  //       <input
  //         type="text"
  //         onChange={(e) => (attributes.parkFeature = e.target.value)}
  //         value={mapClickObject.name}
  //       />
  //     </label>
  //     <label>
  //       Park Feature Class:
  //       <input
  //         type="text"
  //         onChange={(e) => (attributes.parkFeatureClass = e.target.value)}
  //         value={mapClickObject.type}
  //       />
  //     </label>
  return (
    <div className="attributeForm">
      <form id="imgUploadForm">
        <label htmlFor="imgfile">Select an Image:</label>
        <input
          type="file"
          id="imgfile"
          name="attachment"
          accept="image/png, image/jpeg"
          onChange={(e) => enableSubmit()}
        />
      </form>
      <label>
        Caption:
        <textarea
          className="subFormInput"
          rows="2"
          onChange={(e) => {
            setAttributes({ ...attributes, caption: e.target.value });
          }}
        />
      </label>
      <label>
        Submitted by:
        <input
          className="subFormInput"
          type="text"
          onChange={(e) => {
            setAttributes({ ...attributes, userName: e.target.value });
          }}
        />
      </label>
      <label>
        Submission Type:
        <select
          className="subFormInput"
          list="{submissionType"
          onChange={(e) => {
            setAttributes({ ...attributes, submissionType: e.target.value });
          }}
          defaultValue={"Submission"}
        >
          <option value="Submission">Submission</option>
          <option value="report">Report an Issue</option>
        </select>
      </label>
      <div className="submissionBtns">
        <button onClick={submit} disabled={submitDisabled}>
          Submit
        </button>
        <button onClick={cancel}>Cancel</button>
      </div>
    </div>
  );
}

const Submission = ({
  setIsSubmissionDisplayed,
  formStage,
  setFormStage,
  mapClickObject,
}) => {
  switch (formStage) {
    case "map":
      return (
        <div className="popupMapInteract">
          <h3>Click the Location</h3>
        </div>
      );
    case "offMap":
      return (
        <div className="popupMapInteract">
          <h5>
            That location is off the map
            <br />
            Try Clicking the Location
          </h5>
        </div>
      );
    default:
      return (
        <div className="popupPage">
          <div className="popupContent">
            <h3>Submit to the Amazon Park Community Experience Project</h3>
            <hr />
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
