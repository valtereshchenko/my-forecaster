import { render, screen, cleanup } from "@testing-library/react";
import Header from "../components/Header";

describe("test header component", () => {
  test("header component is rendered in DOM", () => {
    render(<Header />);
    const headerElement = screen.getByTestId("header-paper");
    expect(headerElement).toBeInTheDocument();
  });
  afterEach(() => {
    cleanup();
  });
});
