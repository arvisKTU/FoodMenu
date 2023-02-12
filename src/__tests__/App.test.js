import React from "react";
import { render, fireEvent } from "@testing-library/react";
import App from "../App";

jest.mock("isomorphic-fetch");
import fetch from "isomorphic-fetch";

describe("App component", () => {
  it("should render input field and fetch button", () => {
    const { getByRole } = render(<App />);
    expect(getByRole("textbox")).toBeInTheDocument();
    expect(getByRole("button")).toHaveTextContent("Fetch Data");
  });

  // it("should fetch data from API ", async () => {
  //   const fakeData = {
  //     meals: [
  //       {
  //         strMeal: "Arrabiata",
  //         strCategory: "Vegetarian",
  //         strArea: "Italian"
  //       },

  //     ]
  //   };

  //   fetch.mockResponse(JSON.stringify(fakeData));

  //   const { getByRole, findByText, getByText } = render(<App />);
  //   const input = getByRole("textbox");
  //   const button = getByRole("button");

  //   fireEvent.change(input, { target: { value: "arrabiata" } });
  //   fireEvent.click(button);

  //   await findByText("Searched meal");
  //   expect(getByText("Arrabiata")).toBeInTheDocument();
  //   expect(getByText("Vegetarian")).toBeInTheDocument();
  //   expect(getByText("Italian")).toBeInTheDocument();
  // });

  it("should show error message when API fails", async () => {
    fetch.mockReject(new Error("API Error"));

    const { getByRole, findByText, getByText } = render(<App />);
    const input = getByRole("textbox");
    const button = getByRole("button");

    fireEvent.change(input, { target: { value: "cepelinai" } });
    fireEvent.click(button);

    await findByText("Loading...");
    await findByText("Error: Meal not found");
  });
});