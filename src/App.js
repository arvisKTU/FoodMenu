import React, {useState} from "react";

function App() {
  const [query, setQuery] = useState("");
  const [dataSearched, setDataSearched] = useState(null);
  const [dataCategory, setDataCategory] = useState(null);
  const [dataArea, setDataArea] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      setError(null);
      setDataArea(null);
      setDataCategory(null);
      setDataSearched(null);
      const response = await fetch(`https://themealdb.com/api/json/v1/1/search.php?s=${query}`);
      const json = await response.json();
      const searchedMeal=json.meals[0];
      setDataSearched(searchedMeal);
      const response1 = await fetch(`https://themealdb.com/api/json/v1/1/filter.php?c=${searchedMeal.strCategory}`);
      const json1 = await response1.json();
      const filterCategory=json1.meals.filter(item => !item.strMeal.includes(searchedMeal.strMeal));
      setDataCategory(filterCategory);
      const response2 = await fetch(`https://themealdb.com/api/json/v1/1/filter.php?a=${searchedMeal.strArea}`);
      const json2 = await response2.json();
      const filterArea=json2.meals.filter(item => !item.strMeal.includes(searchedMeal.strMeal));
      setDataArea(filterArea);
    } catch (error) {
      setError(error);
      error.message="Meal not found";
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <button onClick={handleClick}>Fetch Data</button>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      <h1>Searched meal</h1>
      <table>
        <thead>
           <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Area</th>
          </tr>
        </thead>
        <tbody>
        {dataCategory && (
            <tr>
              <td>{dataSearched.strMeal}</td>
              <td>{dataSearched.strCategory}</td>
              <td>{dataSearched.strArea}</td>
            </tr>
          )}
        </tbody>
      </table>
      <h1>Similar meals by Category</h1>
      <table>
        <thead>
        </thead>
        <tbody>
          {dataCategory &&
            dataCategory.slice(0,5).map((item, index) => {
              const { strMeal} = item;
              return (
                <tr key={index}>
                  <td>{strMeal}</td>

                </tr>
              );
            })}
          {!dataCategory && (
            <tr>
              <td colSpan="3">Loading...</td>
            </tr>
          )}
        </tbody>
      </table>

      <h1>Similar meals by Area</h1>
      <table>
        <thead>
        </thead>
        <tbody>
          {dataArea &&
            dataArea.slice(0,3).map((item, index) => {
              const { strMeal} = item;
              return (
                <tr key={index}>
                  <td>{strMeal}</td>
                </tr>
              );
            })}
          {!dataArea && (
            <tr>
              <td colSpan="3">Loading...</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;