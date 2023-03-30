const Filter = ({ isFilterDisplayed, setIsFilterDisplayed }) => {
  const filterDisplayHandler = () => setIsFilterDisplayed(false);
  return (
    <>
      <button onClick={filterDisplayHandler}>close</button>
      <h1>Filter The Experience on the Map</h1>
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

export default Filter;
