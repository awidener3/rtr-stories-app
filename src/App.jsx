// ! Notes at bottom

import { useState } from 'react';

const App = () => {
	const [searchTerm, setSearchTerm] = useState('react');

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
	const handleSearch = (e) => {
		setSearchTerm(e.target.value);
	};

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

const Search = (props) => {
	return (
		<div>
			<label htmlFor="search">Search: </label>
			<input id="search" type="text" value={props.search} onChange={props.onSearch} />
		</div>
	);
};

const List = (props) => {
	return (
		<ul>
			{props.list.map((item) => (
				<Item key={item.objectID} item={item} />
			))}
		</ul>
	);
};

const Item = (props) => {
	return (
		<li>
			<span>
				<a href={props.item.url}>{props.item.title}</a>
			</span>
			<span>{props.item.author}</span>
			<span>{props.item.num_comments}</span>
			<span>{props.item.points}</span>
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
 */
