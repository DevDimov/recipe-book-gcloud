import { useRef } from 'React'
import InputWord from '../InputWord';
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react';

describe('InputWord', () => {
    test('renders InputWord component', () => {
        // const testRef = useRef()
        render(
            <InputWord
                headerName='testHeaderName'
                labelName='testLabelName'
                // accessRef={testRef}
            />
        );
        expect(screen.queryByText('testHeaderName')).toBeInTheDocument()
        expect(screen.queryByText('testLabelName')).toBeInTheDocument()
    });
});