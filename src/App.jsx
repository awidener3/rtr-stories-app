import * as React from 'react';

/*
 * RULE OF THUMB: If a variable does not need anything from within a function component's body (parameters), define it outside of the component
 */

// This will only be defined once since it is outside of the functional component
const title = 'React';

function App() {
	// This would be redefined anytime this functional component renders/runs
	// const title = 'React';

	return (
		<div>
			<h1>Hello {title}</h1>
		</div>
	);
}

export default App;
