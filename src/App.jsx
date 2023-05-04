import axios from 'axios';
import { memo, useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';

import './index.css';
import './App.css';

const useStorageState = (key, initialState) => {
	const isMounted = useRef(false); // made up state
	const [value, setValue] = useState(localStorage.getItem(key) || initialState);

	useEffect(() => {
		if (!isMounted.current) {
			console.log('A');
			// runs on render
			isMounted.current = true;
		} else {
			// runs on re-render
			localStorage.setItem(key, value);
		}
	}, [value, key]);

	return [value, setValue];
};

const storiesReducer = (state, action) => {
	switch (action.type) {
		case 'STORIES_FETCH_INIT':
			return {
				...state,
				isLoading: true,
				isError: false,
			};
		case 'STORIES_FETCH_SUCCESS':
			return {
				...state,
				isLoading: false,
				isError: false,
				data: action.payload,
			};
		case 'STORIES_FETCH_FAILURE':
			return {
				...state,
				isLoading: false,
				isError: true,
			};
		case 'REMOVE_STORY':
			return {
				...state,
				data: state.data.filter((story) => action.payload.objectID !== story.objectID),
			};
		default:
			throw new Error();
	}
};

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

const getSumComments = (stories) => {
	console.log('C');

	return stories.data.reduce((result, value) => result + value.num_comments, 0);
};

const App = () => {
	console.log('B:App');
	const [searchTerm, setSearchTerm] = useStorageState('search', 'React');
	const [url, setUrl] = useState(`${API_ENDPOINT}${searchTerm}`);

	const handleSearchInput = (e) => setSearchTerm(e.target.value);

	const handleSearchSubmit = (e) => {
		e.preventDefault();
		setUrl(`${API_ENDPOINT}${searchTerm}`);
	};

	const [stories, dispatchStories] = useReducer(storiesReducer, { data: [], isLoading: false, isError: false });

	const handleFetchStories = useCallback(async () => {
		dispatchStories({ type: 'STORIES_FETCH_INIT' });

		try {
			const result = await axios.get(url);

			dispatchStories({
				type: 'STORIES_FETCH_SUCCESS',
				payload: result.data.hits,
			});
		} catch (error) {
			dispatchStories({ type: 'STORIES_FETCH_FAILURE' });
		}
	}, [url]);

	useEffect(() => {
		handleFetchStories();
	}, [handleFetchStories]);

	// useCallback here so that a new version of this function is not created when App re-renders. This stops <List /> from experiencing an unnecessary update.
	const handleRemoveStory = useCallback((item) => {
		dispatchStories({
			type: 'REMOVE_STORY',
			payload: item,
		});
	}, []);

	// Stops `getSumComments()` from running on each render
	const sumComments = useMemo(() => getSumComments(stories), [stories]);

	return (
		<div className="container">
			<h1 className="headline-primary">My Hacker Stories with {sumComments} comments.</h1>

			<SearchForm searchTerm={searchTerm} onSearchSubmit={handleSearchSubmit} onSearchInput={handleSearchInput} />

			{stories.isError && <p>Something went wrong...</p>}

			{stories.isLoading ? <p>Loading...</p> : <List list={stories.data} onRemoveItem={handleRemoveStory} />}
		</div>
	);
};

const SearchForm = ({ searchTerm, onSearchSubmit, onSearchInput }) => (
	<form onSubmit={onSearchSubmit} className="search-form">
		<InputWithLabel id="search" label="Search" value={searchTerm} isFocused onInputChange={onSearchInput}>
			<strong>Search:</strong>
		</InputWithLabel>

		<button type="submit" disabled={!searchTerm} className="button button_large">
			Search
		</button>
	</form>
);

const InputWithLabel = ({ id, value, type = 'text', onInputChange, isFocused, children }) => {
	return (
		<>
			<label htmlFor={id} className="label">
				{children}
			</label>
			&nbsp;
			<input id={id} type={type} value={value} autoFocus={isFocused} onChange={onInputChange} className="input" />
		</>
	);
};

// eslint-disable-next-line react/display-name
const List = memo(({ list, onRemoveItem }) => (
	<ul>
		{list.map((item) => (
			<Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
		))}
	</ul>
));

const Item = ({ item, onRemoveItem }) => {
	const handleRemoveItem = () => {
		onRemoveItem(item);
	};

	return (
		<li className="item">
			<span>
				<a href={item.url}>{item.title}</a>
			</span>
			<span>{item.author}</span>
			<span>{item.num_comments}</span>
			<span>{item.points}</span>
			<span>
				<button type="button" onClick={handleRemoveItem} className="button button_small">
					Dismiss
				</button>
			</span>
		</li>
	);
};

export default App;
export { storiesReducer, SearchForm, InputWithLabel, List, Item };
