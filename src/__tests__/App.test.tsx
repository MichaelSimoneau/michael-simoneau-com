import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import App from "../App";

describe("App", () => {
  it("renders the MetLife hero headline", () => {
    render(<App />);
    expect(
      screen.getByRole("heading", { name: /policy platform of the future/i }),
    ).toBeInTheDocument();
  });

  it("lists the signature programs", () => {
    render(<App />);
    expect(screen.getByText(/global enrollment cloud/i)).toBeInTheDocument();
    expect(screen.getByText(/advisor insight center/i)).toBeInTheDocument();
  });
});
