import { render, screen, fireEvent } from "@testing-library/react";
import Container from "./container";
import { DATA_TESTIDS } from "./defines/data-testids";

describe("Container Component", () => {
  it("initially does not display stats and displays them after clicking the button", () => {
    render(<Container name="Test Container" />);

    expect(screen.queryByTestId(DATA_TESTIDS.STATS_CONTAINER)).toBeNull();

    fireEvent.click(screen.getByTestId(DATA_TESTIDS.BUTTON));

    expect(
      screen.getByTestId(DATA_TESTIDS.STATS_CONTAINER)
    ).toBeInTheDocument();
  });
});
