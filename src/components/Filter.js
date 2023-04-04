const Filter = ({ isFilterDisplayed, setIsFilterDisplayed }) => {
  const filterDisplayHandler = () => setIsFilterDisplayed(false);

  function filter() {
    console.log("Filter");
    setIsFilterDisplayed(false);
  }
  return (
    <div className="popupPage">
      <div className="popupContent">
        <button onClick={filterDisplayHandler}>close</button>
        <h3>Filter The Experience on the Map</h3>
        <label>
          Name:
          <input type="text" />
        </label>
        <label>
          Description:
          <textarea rows="4" />
        </label>
        <label>
          Date of guided walk:
          <input type="text" />
        </label>
        <button onClick={filter}>Filter Submissions</button>
      </div>
    </div>
  );
};

export default Filter;
