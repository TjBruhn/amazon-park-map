import "./App.css";
import { useState, useEffect } from "react";
import Map from "./components/Map";
import NavBar from "./components/NavBar";
import ProjectAbout from "./components/ProjectAbout";
import Submission from "./components/Submission";
import Filter from "./components/Filter";

function App() {
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const [isAboutDisplayed, setIsAboutDisplayed] = useState(false);
  const [isSubmissionDisplayed, setIsSubmissionDisplayed] = useState(false);
  const [isFilterDisplayed, setIsFilterDisplayed] = useState(false);

  //state of submission form
  const [formStage, setFormStage] = useState("initial");

  // a state object to hold submission attributes
  const [submissionObject, setSubmissionObject] = useState({
    longitude: 0.0,
    latitude: 0.0,
    OBJECTID: 0,
    name: "",
    type: "",
  });

  useEffect(() => {
    console.log("submissionObject:");
    console.log(submissionObject);
    if (formStage === "locate") {
      setIsSubmissionDisplayed(true);
      setFormStage("attributes");
    }
  }, [submissionObject]);

  return (
    <>
      <NavBar
        isNavExpanded={isNavExpanded}
        setIsNavExpanded={setIsNavExpanded}
        setIsAboutDisplayed={setIsAboutDisplayed}
        setIsSubmissionDisplayed={setIsSubmissionDisplayed}
        setIsFilterDisplayed={setIsFilterDisplayed}
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
          submissionObject={submissionObject}
        ></Submission>
      ) : null}
      {isFilterDisplayed ? (
        <Filter
          isFilterDisplayed={isFilterDisplayed}
          setIsFilterDisplayed={setIsFilterDisplayed}
        ></Filter>
      ) : null}

      <Map setSubmissionObject={setSubmissionObject}></Map>
    </>
  );
}

export default App;
