---
layout: post
title: "Use Suspense + ErrorBoundary with data fetching"
tags: [React]
---

### What Is Suspense & ErrorBoundary, Exactly?
In short, `Suspense` is the boundary (or fallback) for data fetching in `loading` state while `ErrorBoundary` is the boundary (or fallback) for data fetching in `error` state.

### Traditional Data Fetch
Use [React-query](https://react-query.tanstack.com/examples/simple) as an example. Below is how we handle the data fetching regularly:

```javascript
function Example() {
  const { isLoading, error, data, isFetching } = useQuery("repoData", () =>
    axios.get(
      "https://api.github.com/repos/tannerlinsley/react-query"
    ).then((res) => res.data)
  );

  if (isLoading) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.description}</p>
      <strong>👀 {data.subscribers_count}</strong>{" "}
      <strong>✨ {data.stargazers_count}</strong>{" "}
      <strong>🍴 {data.forks_count}</strong>
      <div>{isFetching ? "Updating..." : ""}</div>
      <ReactQueryDevtools initialIsOpen />
    </div>
  );
}
```
The drawback of this approach is:
1. We need to handle all different states (`loading`, `error` and `loaded`) of data fetching in a single react component;
2. It's difficult to propagate the data fetching states bottom-up;

### Data Fetch with Suspense + ErrorBoundary
#### 1. Enable suspense mode in React-query
```javascript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true,
    },
  },
});
```

#### 2. Wrap the react data fetching component with Suspense + ErrorBoundary

```javascript
import { ErrorBoundary } from "react-error-boundary";
import "bootstrap/dist/css/bootstrap.css";
import Spinner from "react-bootstrap/Spinner";

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

const spinner = (
  <Spinner animation="border" role="status">
    <span className="visually-hidden">Loading...</span>
  </Spinner>
);

ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={spinner}>
          <App />
        </Suspense>
      </ErrorBoundary>
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
```

where in `App.js`, we can then only focus on data successfully loaded rendering:
```javascript
export default function App(): React$MixedElement {
  const { data } = useQuery("repoData", () =>
    axios
      .get("https://api.github.com/repos/goplusgo/react-flow-template")
      .then((res) => res.data)
  );

  return (
    <div className="App">
      <header className="App-header">
        <p>Hello, {data.name}!</p>
      </header>
    </div>
  );
}
```

Come back to the drawback #2 for traditional data fetching mechanism, we are now able to set the `Suspense` or `ErrorBoundary` at any higher level. For instance, if we have multiple data fetching components and we would like to display a loading spinner (or error state) as long as there is a single component remaining experiencing such state, we can do this:

```javascript
<ErrorBoundary FallbackComponent={ErrorFallback}>
  <Suspense fallback={spinner}>
    <Component1 />
    <Component2 />
    <Component3 />
  </Suspense>
</ErrorBoundary>
```
