// ! Notes at bottom
const list = [
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

function App() {
	return (
		<div>
			<h1>My Hacker Stories</h1>

			<label htmlFor="search">Search: </label>
			<input type="text" id="search" />

			<hr />

			<ul>
				{list.map((item) => (
					<li key={item.objectID}>
						<span>
							<a href={item.url}>{item.title}</a>
						</span>
						<span>{item.author}</span>
						<span>{item.num_comments}</span>
						<span>{item.points}</span>
					</li>
				))}
			</ul>
		</div>
	);
}

export default App;

/*
  > NOTES
  > DEFINING VARIABLES AND RE-RENDERING: If a variable does not need anything from within a function component's body (parameters), define it outside of the component

  > UPDATES: Any time a file changes the dev server reloads all affected files for browser. Uses "React Fash Refresh" on react's side and "Hot Module Replacement" on dev server side

  > REACT HTML ATTRIBUTES: https://legacy.reactjs.org/docs/dom-elements.html#all-supported-html-attributes

  > ESLINT: install dev dependency `vite-plugin-eslint` and integrate into vite.config.js (import eslint, then include in array). Create .eslintrc if needed

  > MAPPED KEYS: When using keys, react can efficiently exchange changed items.
 */
