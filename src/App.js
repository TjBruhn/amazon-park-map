import "./App.css";
import { useState } from "react";
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
          isSubmissionDisplayed={isSubmissionDisplayed}
          setIsSubmissionDisplayed={setIsSubmissionDisplayed}
        ></Submission>
      ) : null}
      {isFilterDisplayed ? (
        <Filter
          isFilterDisplayed={isFilterDisplayed}
          setIsFilterDisplayed={setIsFilterDisplayed}
        ></Filter>
      ) : null}

      <Map></Map>
    </>
  );
}

export default App;
