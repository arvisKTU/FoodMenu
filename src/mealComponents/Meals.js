import React, { useState } from "react"
import "./Meals.css"
import "./Meal"
import searchForMeal from "./Meal"

function Meals() {
  const MEAL_SEARCH_API = "https://themealdb.com/api/json/v1/1/search.php?s="
  const MEALS_BY_CATEGORY_API =
    "https://themealdb.com/api/json/v1/1/filter.php?c="
  const MEALS_BY_AREA_API = "https://themealdb.com/api/json/v1/1/filter.php?a="

  const [query, setQuery] = useState("")
  const [searchedMeal, setSearchedMeal] = useState(null)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    setLoading(true)
    const response = await fetch(`${MEAL_SEARCH_API}${query}`)
    const json = await response.json()
    if (!json.meals) {
      setError(true)
      setLoading(false)
      setSearchedMeal(null)
      return null
    }

    const searchedMeal = json.meals[0]
    const response1 = await fetch(
      `${MEALS_BY_CATEGORY_API}${searchedMeal.strCategory}`
    )
    const json1 = await response1.json()
    const dataFetchCategory = []

    const filterCategory = json1.meals
      ? json1.meals.filter(
          (item) => !item.strMeal.includes(searchedMeal.strMeal)
        )
      : null
    filterCategory.forEach((element) => {
      searchForMeal(element.strMeal).then((data) => {
        dataFetchCategory.push(data)
      })
    })
    const response2 = await fetch(
      `${MEALS_BY_AREA_API}${searchedMeal.strArea}`
    )
    const json2 = await response2.json()
    const dataFetchArea = []
    const filterArea = json2.meals
      ? json2.meals.filter(
          (item) => !item.strMeal.includes(searchedMeal.strMeal)
        )
      : null

    filterArea.forEach((element) => {
      searchForMeal(element.strMeal).then((data) => {
        dataFetchArea.push(data)
      })
    })

    const searchedMeal1 = {
      meal: searchedMeal,
      mealsByCategory: dataFetchCategory,
      mealsByArea: dataFetchArea,
    }

    setSearchedMeal(searchedMeal1)

    setLoading(false)
    setError(false)
  }

  return (
    <div>
      <h1>Meal menu</h1>
      <div className="search">
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <br />
        <br />
      </div>
      <div className="searchButton">
        <button onClick={handleClick}>Search meal</button>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: Meal not found</p>}
      <div>
        {searchedMeal && (
          <>
            <h2>Searched meal</h2>
            <div className="card">
              <div>
                <h4>{searchedMeal.meal.strMeal}</h4>
                <h4>Category: {searchedMeal.meal.strCategory}</h4>
                <h4>Area: {searchedMeal.meal.strArea}</h4>
                <img
                  src={searchedMeal.meal.strMealThumb}
                  alt={searchedMeal.meal.strMeal}
                />
              </div>
            </div>
          </>
        )}
      </div>
      <div>
        {searchedMeal && (
          <>
            <h2>Similar meals by Category</h2>
            <div className="card">
              {searchedMeal.mealsByCategory.slice(0, 5).map((item) => (
                <div key={item.strMeal}>
                  <h4>{item.strMeal}</h4>
                  <h4>Category: {item.strCategory}</h4>
                  <h4>Area: {item.strArea}</h4>
                  <img src={item.strMealThumb} alt={item.strMeal} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div>
        {searchedMeal && (
          <>
            <h2>Similar meals by Area</h2>
            <div className="card">
              {searchedMeal.mealsByArea.slice(0, 3).map((item) => (
                <div key={item.strMeal}>
                  <h4>{item.strMeal}</h4>
                  <h4>Category: {item.strCategory}</h4>
                  <h4>Area: {item.strArea}</h4>
                  <img src={item.strMealThumb} alt={item.strMeal} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Meals
