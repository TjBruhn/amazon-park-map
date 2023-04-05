import "./App.css";
import { useState, useEffect } from "react";
import Map from "./components/Map";
import NavBar from "./components/NavBar";
import ProjectAbout from "./components/ProjectAbout";
import Submission from "./components/Submission";

function App() {
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const [isAboutDisplayed, setIsAboutDisplayed] = useState(false);
  const [isSubmissionDisplayed, setIsSubmissionDisplayed] = useState(false);

  //state of submission form
  const [formStage, setFormStage] = useState("initial");

  // a state object to hold submission attributes
  const [mapClickObject, setMapClickObject] = useState({
    longitude: 0.0,
    latitude: 0.0,
    OBJECTID: 0,
    name: "",
    type: "",
  });

  return (
    <>
      <NavBar
        isNavExpanded={isNavExpanded}
        setIsNavExpanded={setIsNavExpanded}
        setIsAboutDisplayed={setIsAboutDisplayed}
        setIsSubmissionDisplayed={setIsSubmissionDisplayed}
        formStage={formStage}
      ></NavBar>
      {isAboutDisplayed ? (
        <ProjectAbout
          isAboutDisplayed={isAboutDisplayed}
          setIsAboutDisplayed={setIsAboutDisplayed}
        ></ProjectAbout>
      ) : null}
      {isSubmissionDisplayed ? (
        <Submission
          setIsSubmissionDisplayed={setIsSubmissionDisplayed}
          formStage={formStage}
          setFormStage={setFormStage}
          mapClickObject={mapClickObject}
        ></Submission>
      ) : null}

      <Map
        setMapClickObject={setMapClickObject}
        setFormStage={setFormStage}
      ></Map>
    </>
  );
}

export default App;
