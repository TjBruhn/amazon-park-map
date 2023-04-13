const ProjectAbout = ({ isAboutDisplayed, setIsAboutDisplayed }) => {
  const aboutDisplayHandler = () => setIsAboutDisplayed(false);

  return (
    <div className="popupPage">
      <div className="popupContent">
        <h3>The Amazon Park Community Experience Project</h3>
        <hr />
        <p>
          Amazon Park is one of the most treasured resources to the surrounding
          communities. It is a place to gather, play, relax, and observe. Each
          of us enjoys this park for our own purposes. This project is an
          opportunity to collect and share the ways we enjoy and reasons we love
          this park.
        </p>
        <p>
          So please explore the park, take some photos, and share what Amazon
          means to you.
        </p>
        <p>
          See something not at it's best? Submit that here too so we can work on
          keeping this park great!
        </p>
        <div className="submissionBtns">
          <button onClick={aboutDisplayHandler}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default ProjectAbout;
