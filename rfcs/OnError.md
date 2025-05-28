RFC: `onError` request property
-------

See also [SemanticNullability.md](SemanticNullability.md). 

`onError` is a part of the more general semantic nullability solution. But `onError` can be added independently of the more general solution, hence a separate RFC.

## 📜 Introduction

When working on improving GraphQL nullability, it was found that [GraphQL error propagation](https://spec.graphql.org/draft/#sec-Executing-Selection-Sets.Errors-and-Non-Null-Types), by encouraging the use of nullable types for error reasons is creating confusion for frontend developers. 

"Is a field nullable for product reasons or error reasons?" Without more information, it's impossible to tell 🤷‍♂️.

This defeats GraphQL as a type-safe language aiming to improve backend/frontend communication.

This proposal introduces `onError` as a way to disable error propagation so that the schemas can express the [true nullability](https://github.com/graphql/graphql-wg/discussions/1394) of their data.

## 💡 The `onError` request property

It is proposed that clients send a new `onError` property:

```json
{
  "query": "{ helloWorld }",
  "onError": "NULL"
}
```

Possible values for the `onError` property are:

* `NULL`: disables error propagation. The executor emits `null` in the `data` part of the response and a GraphQL [execution error](https://spec.graphql.org/draft/#execution-error) in the `errors` part of the response.
* `PROPAGATE`: propagates the error to the nearest nullable parent field. This is the current behaviour.
* `HALT`: stops executing the request whenever an error is encountered. This allows services to save resources if clients do not consume partial data.

Servers not supporting `onError` must execute in the `PROPAGATE` mode. 

Servers supporting `onError` must decide on a sensible default. Existing servers will most likely use `PROPAGATE`, new servers will most likely use `NULL`. `HALT` is also possible as a default albeit it's expected to be used less frequently.

In the end state where error propagation is disabled and clients are error-handling clients, the default of `NULL` saves a few bytes over the wire for each request.

The default error propagation is indicated in introspection with a new meta-field, `onErrorDefault` of `String!` type.

```graphql
type __Service {
    """
    Indicates the error behaviour when `onError` is not present in the request.
    One of `NULL`, `PROPAGATE`, `HALT`
    """
    onErrorDefault: String!
}
extend type __Schema {
    """
    Information relative to the service.
    In a perfect world, this is a separate meta-field separate from __Schema but new meta fields are not discoverable
    and this is added as a `__Schema` field for backward compatibility reasons.
    """
    service: __Service
}
```

Services not supporting `onError` must not support `onErrorDefault` and must ignore the `onError` request property.  

> [!NOTE]
> The type of `onErrorDefault` is not an enum because it would break existing tooling. See https://github.com/graphql/graphiql/issues/3968 for more details.

## 🙅‍♂️ Rejected solution: schema directive

It was initially suggested that the default behavior could be a schema directive:

```graphql
enum __ErrorBehavior {
  NULL
  PROPAGATE
  ABORT
}

directive @behavior(onError: __ErrorBehavior! = PROPAGATE) on SCHEMA
```

This was discussed in [the May working group](https://youtu.be/Lo0OhLoMBII?t=4211). In addition to [breaking existing tooling](https://github.com/graphql/graphiql/issues/3968), another issue is that such a directive is most likely to stay around forever, forbidding a clean end state (see [wg video](https://youtu.be/Lo0OhLoMBII?t=5380)).   

## 🙅‍♂️ Rejected solution: `@disableErrorPropagation`

`@disableErrorPropagation` ([spec PR](https://github.com/graphql/graphql-spec/pull/1050)) has the advantage that it's a `graphql-js` only change. When `graphql-js` is updated, middleware such as apollo-server, yoga, etc... would get support out of the box.

But one inconvenient is that it mostly requires a compiler to add the directive automatically. Adding the directive manually is going to be very cumbersome and not something we want the users to do. Having compilers that modify the request is generally avoided because it is surprising. The query that the user is typing is not the one that get executed on the wire. This is an issue if comparing the GraphiQL results with your favorite clients results for an example.

