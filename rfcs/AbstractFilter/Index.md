# GraphQL Abstract Type Filter Specification

_Status: Strawman_

This specification aims to provide a standardized way for clients to communicate
the exclusive set of types permitted in a resolver’s response when returning one
or more abstract types (i.e. an Interface or Union return type).

Algorithms are provided for resolvers to enforce this contract at runtime.

In the following example, `getMedia` will return **only** `Book` or `Movie`
types:

```graphql example
query GetMedia {
  getMedia(only: ["Book", "Movie"]) {
    ... on Book { author }
    ... on Movie { director }
  }
}
```

This is enforced on the server when using the `@limitTypes` type system
directive:

```graphql example
union Media = Book | Movie | Opera

type Query {
  getMedia(only: [String] @limitTypes): Media
}
```

**@matches**

This document also specifies a `@matches` executable directive. Client tooling
may implement this to let query authors avoid manually defining the allowed
types (which is implicitly already defined inside the
[selection set](<https://spec.graphql.org/draft/#sec-Selection-Sets>) of the
{field} for which the {argument} the directive is applied to).

The following example is identical to the query above when compiled (either at
build time, or as a runtime transformation):

```graphql example
query GetMedia {
  getMedia @matches {
    ... on Book { title author }
    ... on Movie { title director }
  }
}
```

**Use Cases**

Applications may implement this specification to provide a filter for what
type(s) may be returned by a resolver. Notably, the filtering happens on the
server side allowing clients to receive a fixed length of results.

This may also be used a versioning scheme by applications that dynamically
render different parts of a user interface mapped from the return type(s) of a
resolver. Each version of the application can define the exclusive set of types
it supports displaying in the user interface.

# [AbstractFilterArgumentSpec](AbstractFilterArgumentSpec.md)
# [Matches](Matches.md)

