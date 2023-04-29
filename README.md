# Hacker Stories

## 📝 Description
This application is an example project used by ["The Road to React" by Robin Wieruch](https://www.roadtoreact.com/) to learn React fundamentals. 

## ✏️ Notes
* DEFINING VARIABLES AND RE-RENDERING: If a variable does not need anything from within a function component's body (parameters), define it outside of the component

* UPDATES: Any time a file changes the dev server reloads all affected files for browser. Uses "React Fash Refresh" on react's side and "Hot Module Replacement" on dev server side

* REACT HTML ATTRIBUTES: https://legacy.reactjs.org/docs/dom-elements.html#all-supported-html-attributes

* ESLINT: install dev dependency `vite-plugin-eslint` and integrate into vite.config.js (import eslint, then include in array). Create .eslintrc if needed

* MAPPED KEYS: When using keys, react can efficiently exchange changed items.

* COMPONENT HIERARCHIES/TREES: A parent-child tree that begins with the "entry point component" (AKA App.jsx).

* COMPONENT DECLARATION: Components can be written as arrow functions, along with all methods and JSX within. You can even simply return HTML if no methods are needed in a component. BE CONSISTENT!

* CALLBACK HANDLER: Pass function from parent to child component via props - call func in child, but have implementation in parent.

* SPREAD/REST OPERATORS: Utilize the spread/rest operator when passing props down components. Use the spread to avoid a lot of props being passed down in instantiation (i.e. `<List name={item.name} url={item.url} etc. />`) into `<List {...item} />` and use the rest operator in maps to simplify keys and props:
  
  ```js
  {list.map(({ objectID, ...item }) => (
    <Item key={objectID} {...item} />
  ))}
  ```

* PROPS HANDLING RULE OF THUMB: 
  * Always use object destructuring for props
  * Use spread operator when you want to pass all key/value pairs to a child component
  * Use the rest operator only when you want to split out certain properties.
  * Use nested destructuring only when it improves readability 

* USESTATE VS. USEEFFECT: useState is used for values that change over time; useEffect is used to opt into the lifecycle of componenets to introduce side-effects.

* CUSTOM HOOKS: Maintain conventions:
  * custom hooks should begin with the `use-` prefix
  * custom hooks should return an array (<STATE>, set<STATE>) 
  * custom hooks should be reusable

* INLINE HANDLERS: Inline handlers are useful in child components when callback handlers require some sort of parameter, for example a current item. The `onClick` attribute returns the event object by default, but by using the inline handler, you can send specific information back

* USEREDUCER: The useReducer hook enables one to use more sophisticated state management for complex state structures.
  * The state processed by a reducer function is immutable - it always returns a new state object
  * It is recommended to use the spread ({ ...object }) operator to keep state the same except for the properties we are changing.

  ```js
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
  ```
  * An action provided to a reducer function can have an optional payload (this would change our example above to dig deeper into the action object `action.payload.lastname`)

  ```js
    const action = {
      type: 'CHANGE_LASTNAME',
      payload: {
        lastname: 'Doe'
      }
    }
  ```

  * MEMOIZED FUNCTIONS: By using the `useCallback()` hook, a function is memoized. This stops the function from being created each time the component re-renders.
  
### React Maintenance
* Performance in React
  * **Strict Mode**: helper component that notifies developers in the case of something being wrong in implementation.
    * This may cause unexpected behaviors, such as `useEffect()` hooks running twice when we may expect it once. The result of the `useEffect()` is the same, therefore it does not affect the application. This is called an *idempotent* operation, which means the result of a successfully performed request is independent of the # of times it is executed.
    * "Strict Mode" is only used while in the development environment and is removed during the production build process.
    * When working on an app's performance optimization, you can simply remove the `<StrictMode>` tag at the React entry point. You should add the tags back when finished.
  * **`useEffect()` Updates**: There is no built-in way for a `useEffect()` hook to render only after an *update*.
    * Using the `useRef()` hook, you can create a "made up state" that updates and simulates an update.
    ```js
    const useStorageState = (key, initialState) => {
      const isMounted = useRef(false); // made up state
      const [value, setValue] = useState(localStorage.getItem(key) || initialState);

      useEffect(() => {
        if (!isMounted.current) { // runs on initial render
          isMounted.current = true;
        } else { // runs for every re-render
          localStorage.setItem(key, value);
        }
      }, [value, key]);

      return [value, setValue];
    };
    ```

### Testing in React
* Testing pyramid contains **end-to-end tests**, **integration tests**, and **unit tests**.
  * Unit tests -- small, isolated blocks of code
  * Integration tests -- figure out how well these blocks of code work together
  * End-to-end tests -- simulate a real-life scenario
* Many unit tests are required to cover all the functions and components in a working application.
* Many options for testing frameworks; this example uses **Vitest** and **React Testing Library (RTL)**