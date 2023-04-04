const NavBar = ({
  isNavExpanded,
  setIsNavExpanded,
  setIsAboutDisplayed,
  setIsSubmissionDisplayed,
  setIsFilterDisplayed,
}) => {
  function navExpandHandler(buttonClicked) {
    // Close all open popup windows
    setIsNavExpanded(false);
    setIsAboutDisplayed(false);
    setIsSubmissionDisplayed(false);
    setIsFilterDisplayed(false);

    // Open the associated window
    switch (buttonClicked) {
      case "about":
        setIsAboutDisplayed(true);
        break;
      case "submission":
        setIsSubmissionDisplayed(true);
        break;
      case "filter":
        setIsFilterDisplayed(true);
        break;
      default:
        break;
    }
  }

  return (
    <nav>
      <div
        className={
          isNavExpanded ? "navigation-menu expanded" : "navigation-menu"
        }
      >
        <div className="pageTitle">
          <h1>Amazon Park</h1>
          <h3>Community Experience</h3>
        </div>

        <ul>
          <li>
            <button
              onClick={() => {
                navExpandHandler("about");
              }}
            >
              About the Project
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                navExpandHandler("submission");
              }}
            >
              Add Submission
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                navExpandHandler("filter");
              }}
            >
              Filter Submissions
            </button>
          </li>
        </ul>
      </div>
      <button
        className="hamburger"
        onClick={() => setIsNavExpanded(!isNavExpanded)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="white"
        >
          <path
            fillRule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </nav>
  );
};

export default NavBar;
