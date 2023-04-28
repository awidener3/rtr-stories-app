// ! Notes at bottom

import { useEffect, useState } from 'react';

const useStorageState = (key, initialState) => {
	const [value, setValue] = useState(localStorage.getItem(key) || initialState);

	useEffect(() => {
		localStorage.setItem(key, value);
	}, [value, key]);

	return [value, setValue];
};

const App = () => {
	const [searchTerm, setSearchTerm] = useStorageState('search', 'React');

	const stories = [
		{
			title: 'React',
			url: 'https://reactjs.org/',
			author: 'Jordan Walke',
			num_comments: 3,
			points: 4,
			objectID: 0,
		},
		{
			title: 'Redux',
			url: 'https://redux.js.org/',
			author: 'Dan Abramov, Andrew Clark',
			num_comments: 2,
			points: 5,
			objectID: 1,
		},
	];

	// Callback handler, allows parent to see state of child
	const handleSearch = (e) => setSearchTerm(e.target.value);

	const searchedStories = stories.filter((story) => story.title.toLowerCase().includes(searchTerm.toLowerCase()));

	return (
		<div>
			<h1>My Hacker Stories</h1>

			<Search search={searchTerm} onSearch={handleSearch} />

			<hr />

			<List list={searchedStories} />
		</div>
	);
};

const Search = ({ search, onSearch }) => {
	return (
		<div>
			<label htmlFor="search">Search: </label>
			<input id="search" type="text" value={search} onChange={onSearch} />
		</div>
	);
};

const List = ({ list }) => {
	return (
		<ul>
			{list.map((item) => (
				<Item key={item.objectID} item={item} />
			))}
		</ul>
	);
};

const Item = ({ item }) => {
	return (
		<li>
			<span>
				<a href={item.url}>{item.title}</a>
			</span>
			<span>{item.author}</span>
			<span>{item.num_comments}</span>
			<span>{item.points}</span>
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
 */
