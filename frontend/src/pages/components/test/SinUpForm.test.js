import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import SignUpForm from '../SignUpForm'; // Adjust the path based on your project structure


describe('SignIn Form Title in SignUpForm Component', () => {
    beforeEach(() => {
        render(
            <BrowserRouter>
                <SignUpForm />
            </BrowserRouter>
        );
    });

    test('title displays the correct word using test id', () => {
        const signInTitle = screen.getByTestId("sign-in");
        expect(signInTitle).toBeInTheDocument();
        expect(signInTitle).toHaveTextContent('Sign In');
    });
});