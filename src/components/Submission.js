const Submission = ({ isSubmissionDisplayed, setIsSubmissionDisplayed }) => {
  const submissionDisplayHandler = () => setIsSubmissionDisplayed(false);
  return (
    <>
      <button onClick={submissionDisplayHandler}>close</button>
      <h1>Submit to the Amazon Park Community Experience Project</h1>
      <label>
        Name:
        <input type="text" />
      </label>
      <label>
        Description:
        <textarea rows="4" cols="50" />
      </label>
      <label>
        Date of guided walk:
        <input type="text" />
      </label>
    </>
  );
};

export default Submission;
