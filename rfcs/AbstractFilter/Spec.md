# GraphQL Abstract Type Filter Specification

_Status: Strawman_<br>
_Version: 2026-01-14_

This specification aims to provide a standardized way for clients to communicate
the exclusive set of types allowed in a resolver’s response when returning one
or more abstract types (i.e. an Interface or Union return type).

In the following example, `allPets` will return **only** `Cat` or `Dog` types:

```graphql example
{
  allPets(only: ["Cat", "Dog"]) {
    ... on Cat { name }
    ... on Dog { name }
  }
}
```

This is enforced on the server when using the `@limitTypes` type system
directive:

```graphql example
type Query {
  allPets(only: [String] @limitTypes): [Pet]
}
```

**@matches**

This document also specifies the `@matches` executable directive. Client tooling
may implement this to let query authors avoid manually defining the allowed
types (which is implicitly already defined inside the
[selection set](<https://spec.graphql.org/draft/#sec-Selection-Sets>) of the
{field} for which the {argument} the directive is applied to).

The following example is identical to the query above when compiled (either at
build time, or as a runtime transformation):

```graphql example
{
  allPets @matches {
    ... on Cat { name }
    ... on Dog { name }
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
