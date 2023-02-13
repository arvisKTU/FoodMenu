import React from "react";
import { render, fireEvent } from "@testing-library/react";
import fetchMock from "fetch-mock";
import App from "../App";

describe("App component", () => {
  afterEach(() => {
    fetchMock.reset();
  });

  it("should render input field and fetch button", () => {
    const { getByRole } = render(<App />);
    expect(getByRole("textbox")).toBeInTheDocument();
    expect(getByRole("button")).toHaveTextContent("Fetch Data");
  });

  it("fetches data from API and returns expected result", async () => {
    const fakeData = {
      meals: [
              {
                strMeal: "Spicy Arrabiata Penne",
                strCategory: "Vegetarian",
                strArea: "Italian"
              },
      
            ]
    };

    fetchMock.mock("*", JSON.stringify(fakeData));

    const response = await fetch("www.themealdb.com/api/json/v1/1/search.php?s=Arrabiata");
    const json = await response.json();

    expect(json.meals[0].strMeal).toEqual(fakeData.meals[0].strMeal);
    expect(json.meals[0].strCategory).toEqual(fakeData.meals[0].strCategory);
    expect(json.meals[0].strArea).toEqual(fakeData.meals[0].strArea);
    expect(fetchMock.called("www.themealdb.com/api/json/v1/1/search.php?s=Arrabiata")).toBeTruthy();
  });

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
      
            ]
    };

    fetchMock.mock("*", JSON.stringify(fakeData));

    const response = await fetch("https://themealdb.com/api/json/v1/1/filter.php?c=Vegetarian");
    const json = await response.json();

    expect(json.meals[0].strMeal).toEqual(fakeData.meals[0].strMeal);
    expect(json.meals[1].strMeal).toEqual(fakeData.meals[1].strMeal);
    expect(json.meals[2].strMeal).toEqual(fakeData.meals[2].strMeal);
    expect(json.meals[3].strMeal).toEqual(fakeData.meals[3].strMeal);
    expect(fetchMock.called("https://themealdb.com/api/json/v1/1/filter.php?c=Vegetarian")).toBeTruthy();
  });

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
              }
            ]
    };

    fetchMock.mock("*", JSON.stringify(fakeData));

    const response = await fetch("https://themealdb.com/api/json/v1/1/filter.php?a=Italian");
    const json = await response.json();

    expect(json.meals[0].strMeal).toEqual(fakeData.meals[0].strMeal);
    expect(json.meals[1].strMeal).toEqual(fakeData.meals[1].strMeal);
    expect(json.meals[2].strMeal).toEqual(fakeData.meals[2].strMeal);
    expect(fetchMock.called("https://themealdb.com/api/json/v1/1/filter.php?a=Italian")).toBeTruthy();
  });


  it("should show error message when API fails", async () => {
    fetchMock.mock("*", 500);

    const { getByRole, findByText, getByText } = render(<App />);
    const input = getByRole("textbox");
    const button = getByRole("button");

    fireEvent.change(input, { target: { value: "cepelinai" } });
    fireEvent.click(button);

    await findByText("Error: Meal not found");
  });
});