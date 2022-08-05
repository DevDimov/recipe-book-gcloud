import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react';

import Tag from '../Tag';

describe('Tag', () => {
    test('renders Tag component', () => {
        render(<Tag text='Text' />);

        expect(screen.queryByText('Text')).toBeInTheDocument()
    });
});