import { render } from "@testing-library/react";

import { BrowserRouter } from "react-router-dom";

import App from "./app";

describe("App", () => {
  it("should export component", () => {
    expect(App).toBeTruthy();
  });
});
