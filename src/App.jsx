// ! Notes at bottom
import * as React from 'react';

// This will only be defined once since it is outside of the functional component
const welcome = {
	title: 'React',
	greeting: 'Hello',
	colors: ['Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Indigo', 'Violet'],
};

function App() {
	// This would be redefined anytime this functional component renders/runs
	// const title = 'React';

	function getTitle(title) {
		return `${welcome.greeting} ${title}`;
	}

	return (
		<div>
			<h1>{getTitle('React')}</h1>

			<p>Rainbow Colors:</p>
			<ul>
				{welcome.colors.map((color) => (
					<li>{color}</li>
				))}
			</ul>

			<label htmlFor="search">Search: </label>
			<input type="text" id="search" />
		</div>
	);
}

export default App;

/*
  > NOTES
  > DEFINING VARIABLES AND RE-RENDERING: If a variable does not need anything from within a function component's body (parameters), define it outside of the component

  > UPDATES: Any time a file changes the dev server reloads all affected files for browser. Uses "React Fash Refresh" on react's side and "Hot Module Replacement" on dev server side

  > REACT HTML ATTRIBUTES: https://legacy.reactjs.org/docs/dom-elements.html#all-supported-html-attributes
 */
