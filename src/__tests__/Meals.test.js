import React from "react"
import { render, fireEvent } from "@testing-library/react"
import fetchMock from "fetch-mock"
import Meals from "../mealComponents/Meals"

const MEAL_SEARCH_API = "https://themealdb.com/api/json/v1/1/search.php?s="
const MEALS_BY_CATEGORY_API =
  "https://themealdb.com/api/json/v1/1/filter.php?c="
const MEALS_BY_AREA_API = "https://themealdb.com/api/json/v1/1/filter.php?a="

describe("App component", () => {
  afterEach(() => {
    fetchMock.reset()
  })

  it("should render input field and fetch button", () => {
    const { getByRole } = render(<Meals />)
    expect(getByRole("textbox")).toBeInTheDocument()
    expect(getByRole("button")).toHaveTextContent("Search meal")
  })

  it("fetches data from API and returns expected result", async () => {
    const fakeData = {
      meals: [
        {
          strMeal: "Spicy Arrabiata Penne",
          strCategory: "Vegetarian",
          strArea: "Italian",
        },
      ],
    }

    fetchMock.mock("*", JSON.stringify(fakeData))

    const response = await fetch(`${MEAL_SEARCH_API}Arrabiata`)
    const json = await response.json()

    expect(json.meals[0].strMeal).toEqual(fakeData.meals[0].strMeal)
    expect(json.meals[0].strCategory).toEqual(fakeData.meals[0].strCategory)
    expect(json.meals[0].strArea).toEqual(fakeData.meals[0].strArea)
    expect(fetchMock.called(`${MEAL_SEARCH_API}Arrabiata`)).toBeTruthy()
  })

  it("fetches correct meals by category of searched meal", async () => {
    const fakeData = {
      meals: [
        {
          strMeal: "Baingan Bharta",
        },
        {
          strMeal: "Chickpea Fajitas",
        },
        {
          strMeal: "Dal fry",
        },
        {
          strMeal: "Egg Drop Soup",
        },
      ],
    }

    fetchMock.mock("*", JSON.stringify(fakeData))

    const response = await fetch(`${MEALS_BY_CATEGORY_API}Vegetarian`)
    const json = await response.json()

    expect(json.meals[0].strMeal).toEqual(fakeData.meals[0].strMeal)
    expect(json.meals[1].strMeal).toEqual(fakeData.meals[1].strMeal)
    expect(json.meals[2].strMeal).toEqual(fakeData.meals[2].strMeal)
    expect(json.meals[3].strMeal).toEqual(fakeData.meals[3].strMeal)
    expect(fetchMock.called(`${MEALS_BY_CATEGORY_API}Vegetarian`)).toBeTruthy()
  })

  it("fetches correct meals by area of searched meal", async () => {
    const fakeData = {
      meals: [
        {
          strMeal: "Budino Di Ricotta",
        },
        {
          strMeal: "Chicken Alfredo Primavera",
        },
        {
          strMeal: "Chilli prawn linguine",
        },
      ],
    }

    fetchMock.mock("*", JSON.stringify(fakeData))

    const response = await fetch(`${MEALS_BY_AREA_API}Italian`)
    const json = await response.json()

    expect(json.meals[0].strMeal).toEqual(fakeData.meals[0].strMeal)
    expect(json.meals[1].strMeal).toEqual(fakeData.meals[1].strMeal)
    expect(json.meals[2].strMeal).toEqual(fakeData.meals[2].strMeal)
    expect(fetchMock.called(`${MEALS_BY_AREA_API}Italian`)).toBeTruthy()
  })

  it("should show error message when API fails", async () => {
    fetchMock.mock("*", 500)

    const { getByRole, findByText, getByText } = render(<Meals />)
    const input = getByRole("textbox")
    const button = getByRole("button")

    fireEvent.change(input, { target: { value: "cepelinai" } })
    fireEvent.click(button)

    await findByText("Error: Meal not found")
  })
})
