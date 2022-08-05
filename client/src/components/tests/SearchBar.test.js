import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import '@testing-library/jest-dom'
import SearchBar from "../SearchBar";

describe('SearchBar', () => {
    test("Show search filters", () => {
        render(<SearchBar />);
        const tuneButton = screen.getByTestId('tuneButton');
        userEvent.click(tuneButton)
        const searchFilters = screen.getByRole('form')
        expect(searchFilters).toBeInTheDocument()
    });

    test("Renders search filters correctly", () => {
        render(<SearchBar />);
        const tuneButton = screen.getByTestId('tuneButton');
        userEvent.click(tuneButton)
        expect(screen.queryByText('Category')).toBeInTheDocument()
        expect(screen.queryByText('Preparation time')).toBeInTheDocument()
        expect(screen.queryByText('Servings')).toBeInTheDocument()
        expect(screen.queryByText('Ingredient')).toBeInTheDocument()
    });

    test("Hide search filters", () => {
        render(<SearchBar />);
        const tuneButton = screen.getByTestId('tuneButton');
        userEvent.click(tuneButton)
        const closeFilters = screen.queryByText('Close');
        userEvent.click(closeFilters)
        const searchFilters = screen.queryByRole('form')
        expect(searchFilters).toBeNull()
    });
});