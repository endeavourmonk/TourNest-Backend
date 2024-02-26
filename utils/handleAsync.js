module.exports = (fn) => (req, res, next) => fn(req, res, next).catch(next);

// wrapper function takes the async route handler function.
// and return an anonymous fn with args and inside anonymous fn calls the handler fn
// passed to the wrapper fn. and execute the fn passing the args of the returned fn.
// then chaining the catch method because async fn returns promise and passing next for
// error handling
