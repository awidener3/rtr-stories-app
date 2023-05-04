import { describe, it, expect, vi } from 'vitest';
import { storiesReducer, Item } from './App';
import { fireEvent, render, screen } from '@testing-library/react';
import { SearchForm } from './App';
import { InputWithLabel } from './App';

const storyOne = {
	title: 'React',
	url: 'https://reactjs.org',
	author: 'Jordan Walke',
	num_comments: 3,
	points: 4,
	objectID: 0,
};

const storyTwo = {
	title: 'Redux',
	url: 'https://redux.js.org/',
	author: 'Dan Abramov, Andrew Clark',
	num_comments: 2,
	points: 5,
	objectID: 1,
};

const stories = [storyOne, storyTwo];

describe('storiesReducer', () => {
	it('sets isLoading to true when initializing', () => {
		const action = { type: 'STORIES_FETCH_INIT' };
		const state = { data: [], isLoading: false, isError: false };

		const newState = storiesReducer(state, action);

		const expectedState = { data: [], isLoading: true, isError: false };

		expect(newState).toStrictEqual(expectedState);
	});

	it('returns the payload on fetch success', () => {
		const action = { type: 'STORIES_FETCH_SUCCESS', payload: stories };
		const state = { data: [], isLoading: true, isError: false };

		const newState = storiesReducer(state, action);

		const expectedState = { data: stories, isLoading: false, isError: false };

		expect(newState).toStrictEqual(expectedState);
	});

	it('sets isError to true when dispatching a failure', () => {
		const action = { type: 'STORIES_FETCH_FAILURE' };
		const state = { data: [], isLoading: true, isError: false };

		const newState = storiesReducer(state, action);

		const expectedState = { data: [], isLoading: false, isError: true };

		expect(newState).toStrictEqual(expectedState);
	});

	it('removes a story from all stories', () => {
		const action = { type: 'REMOVE_STORY', payload: storyOne };
		const state = { data: stories, isLoading: false, isError: false };

		const newState = storiesReducer(state, action);

		const expectedState = {
			data: [storyTwo],
			isLoading: false,
			isError: false,
		};

		expect(newState).toStrictEqual(expectedState);
	});

	it('throws an error if an invalid type is passed in', () => {
		const action = { type: 'INVALID_TYPE' };
		const state = { data: [], isLoading: false, isError: false };

		expect(() => storiesReducer(state, action)).toThrow(new Error());
	});
});

describe('Item', () => {
	it('renders all properties', () => {
		render(<Item item={storyOne} />);

		// ? Displays the element in the console to view
		// screen.debug();

		expect(screen.getByText('Jordan Walke')).toBeInTheDocument();
		expect(screen.getByText('React')).toHaveAttribute('href', 'https://reactjs.org');
	});

	it('renders a clickable dismiss button', () => {
		render(<Item item={storyOne} />);

		// getByRole() is usually used to retrieve elements by aria-label attributes
		expect(screen.getByRole('button')).toBeInTheDocument();
	});

	it('clicking the dismiss button calls the callback handler', () => {
		// vi.fn() returns a mock for an actual function
		const handleRemoveItem = vi.fn();

		render(<Item item={storyOne} onRemoveItem={handleRemoveItem} />);

		fireEvent.click(screen.getByRole('button'));

		expect(handleRemoveItem).toHaveBeenCalledTimes(1);
	});
});

describe('SearchForm', () => {
	const searchFormProps = {
		searchTerm: 'React',
		onSearchInput: vi.fn(),
		onSearchSubmit: vi.fn(),
	};

	it('renders the input field with its value', () => {
		render(<SearchForm {...searchFormProps} />);

		// Useful for inputs with default values
		expect(screen.getByDisplayValue('React')).toBeInTheDocument();
	});

	it('renders the correct label', () => {
		render(<SearchForm {...searchFormProps} />);

		// The regex expression can be more efficient
		expect(screen.getByLabelText(/Search/)).toBeInTheDocument();
	});

	it('calls onSearchInput on input field change', () => {
		render(<SearchForm {...searchFormProps} />);

		fireEvent.change(screen.getByDisplayValue('React'), {
			target: { value: 'Redux' },
		});

		expect(searchFormProps.onSearchInput).toHaveBeenCalledTimes(1);
	});

	it('calls onSearchSubmit on button submit click', () => {
		render(<SearchForm {...searchFormProps} />);

		fireEvent.submit(screen.getByRole('button'));

		expect(searchFormProps.onSearchSubmit).toHaveBeenCalledTimes(1);
	});
});

describe('InputWithLabel', () => {
	const inputProps = {
		id: 1,
		value: 'React',
		isFocused: true,
		onInputChange: vi.fn(),
	};

	it('renders the expected label', () => {
		render(<InputWithLabel {...inputProps} />);

		screen.debug;
	});
});
