import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Kpi } from "@/components/Kpi";

describe("Kpi", () => {
  it("renders label and value", () => {
    render(<Kpi label="Success rate" value="98%" tone="green" />);
    expect(screen.getByText("Success rate")).toBeInTheDocument();
    expect(screen.getByText("98%")).toBeInTheDocument();
  });
});
