// ! Notes at bottom

import { useCallback, useEffect, useReducer, useState } from 'react';

const useStorageState = (key, initialState) => {
	const [value, setValue] = useState(localStorage.getItem(key) || initialState);

	useEffect(() => {
		localStorage.setItem(key, value);
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

const App = () => {
	const [searchTerm, setSearchTerm] = useStorageState('search', 'React');

	const handleSearch = (e) => setSearchTerm(e.target.value);

	const [stories, dispatchStories] = useReducer(storiesReducer, { data: [], isLoading: false, isError: false });

	// This is the logic that was originally in the `useEffect()` below, but now it is reusable.
	const handleFetchStories = useCallback(() => {
		if (!searchTerm) return;

		dispatchStories({ type: 'STORIES_FETCH_INIT' });

		fetch(`${API_ENDPOINT}${searchTerm}`)
			.then((response) => response.json())
			.then((result) => {
				dispatchStories({
					type: 'STORIES_FETCH_SUCCESS',
					payload: result.hits,
				});
			})
			.catch(() => dispatchStories({ type: 'STORIES_FETCH_FAILURE' }));
	}, [searchTerm]);

	useEffect(() => {
		handleFetchStories();
	}, [handleFetchStories]);

	const handleRemoveStory = (item) => {
		dispatchStories({
			type: 'REMOVE_STORY',
			payload: item,
		});
	};

	return (
		<div>
			<h1>My Hacker Stories</h1>

			<InputWithLabel id="search" label="Search" value={searchTerm} isFocused onInputChange={handleSearch}>
				<strong>Search:</strong>
			</InputWithLabel>

			<hr />

			{stories.isError && <p>Something went wrong...</p>}

			{stories.isLoading ? <p>Loading...</p> : <List list={stories.data} onRemoveItem={handleRemoveStory} />}
		</div>
	);
};

const InputWithLabel = ({ id, value, type = 'text', onInputChange, isFocused, children }) => {
	return (
		<>
			<label htmlFor={id}>{children}</label>
			&nbsp;
			<input id={id} type={type} value={value} autoFocus={isFocused} onChange={onInputChange} />
		</>
	);
};

const List = ({ list, onRemoveItem }) => {
	return (
		<ul>
			{list.map((item) => (
				<Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
			))}
		</ul>
	);
};

const Item = ({ item, onRemoveItem }) => {
	const handleRemoveItem = () => {
		onRemoveItem(item);
	};

	return (
		<li>
			<span>
				<a href={item.url}>{item.title}</a>
			</span>
			<span>{item.author}</span>
			<span>{item.num_comments}</span>
			<span>{item.points}</span>
			<span>
				<button type="button" onClick={handleRemoveItem}>
					Dismiss
				</button>
			</span>
		</li>
	);
};

export default App;

/*
  > NOTES
  > DEFINING VARIABLES AND RE-RENDERING: If a variable does not need anything from within a function component's body (parameters), define it outside of the component

  > UPDATES: Any time a file changes the dev server reloads all affected files for browser. Uses "React Fash Refresh" on react's side and "Hot Module Replacement" on dev server side

  > REACT HTML ATTRIBUTES: https://legacy.reactjs.org/docs/dom-elements.html#all-supported-html-attributes

  > ESLINT: install dev dependency `vite-plugin-eslint` and integrate into vite.config.js (import eslint, then include in array). Create .eslintrc if needed

  > MAPPED KEYS: When using keys, react can efficiently exchange changed items.

  > COMPONENT HIERARCHIES/TREES: A parent-child tree that begins with the "entry point component" (AKA App.jsx).

  > COMPONENT DECLARATION: Components can be written as arrow functions, along with all methods and JSX within. You can even simply return HTML if no methods are needed in a component. BE CONSISTENT!

  > CALLBACK HANDLER: Pass function from parent to child component via props - call func in child, but have implementation in parent.

  > SPREAD/REST OPERATORS: Utilize the spread/rest operator when passing props down components. Use the spread to avoid a lot of props being passed down in instantiation (i.e. <List name={item.name} url={item.url} etc. />) into <List {...item} /> and use the rest operator in maps to simplify keys and props:

    {list.map(({ objectID, ...item }) => (
      <Item key={objectID} {...item} />
    ))}
  
  > PROPS HANDLING RULE OF THUMB: 
    - Always use object destructuring for props
    - Use spread operator when you want to pass all key/value pairs to a child component
    - Use the rest operator only when you want to split out certain properties.
    - Use nested destructuring only when it improves readability 

  > USESTATE VS. USEEFFECT: useState is used for values that change over time; useEffect is used to opt into the lifecycle of componenets to introduce side-effects.

  > CUSTOM HOOKS: Maintain conventions:
    - custom hooks should begin with the `use-` prefix
    - custom hooks should return an array (<STATE>, set<STATE>) 
    - custom hooks should be reusable

  > INLINE HANDLERS: Inline handlers are useful in child components when callback handlers require some sort of parameter, for example a current item. The `onClick` attribute returns the event object by default, but by using the inline handler, you can send specific information back

  > USEREDUCER: The useReducer hook enables one to use more sophisticated state management for complex state structures.
    - The state processed by a reducer function is immutable - it always returns a new state object
    - It is recommended to use the spread ({ ...object }) operator to keep state the same except for the properties we are changing.

      const personReducer = (person, action) => {
        switch (action.type) {
          case 'INCREASE_AGE':
            return { ...person, age: person.age + 1 };
          case 'CHANGE_LASTNAME':
            return { ...person, lastname: action.lastname };
          default:
            return person;
        }
      }
    
    - An action provided to a reducer function can have an optional payload (this would change our example above to dig deeper into the action object `action.payload.lastname`)

      const action = {
        type: 'CHANGE_LASTNAME',
        payload: {
          lastname: 'Doe'
        }
      }

    > MEMOIZED FUNCTIONS: By using the `useCallback()` hook, a function is memoized. This stops the function from being created each time the component re-renders.
 */
