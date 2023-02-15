const MEAL_SEARCH_API = "https://themealdb.com/api/json/v1/1/search.php?s="

const searchForMeal = (mealName) => {
  return fetch(`${MEAL_SEARCH_API}${mealName}`)
    .then((response) => response.json())
    .then((data) => {
      return data.meals[0]
    })
}

export default searchForMeal
