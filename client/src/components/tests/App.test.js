import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import '@testing-library/jest-dom'
import App from "../../App";
import axios from 'axios';

jest.mock('axios');

describe('App', () => {

    test('Fetch recipes from an API without filters', async () => {
        const recipes = fetch('./testData/twoRecipes.json').then(res => res.json())
        // const recipes = [
        //     { objectID: '1', title: 'Hello' },
        //     { objectID: '2', title: 'React' },
        // ];

        axios.get.mockImplementationOnce(() =>
            Promise.resolve({ data: { hits: recipes } })
        );

        render(<App />);
        const searchBox = screen.queryByRole('textbox');
        userEvent.type(searchBox, 'recipe')
        const searchButton = screen.getByTestId('searchButton');
        userEvent.click(searchButton)
        const items = await screen.findAllByRole('listitem');

        expect(items).toHaveLength(2);
    });

    test('fetches stories from an API and fails', async () => {
        axios.get.mockImplementationOnce(() =>
            Promise.reject(new Error())
        );
        render(<App />);
        const searchButton = screen.getByTestId('searchButton');
        userEvent.click(searchButton)
        const message = await screen.findByText(/No recipes to display/);
        expect(message).toBeInTheDocument();
    });
});