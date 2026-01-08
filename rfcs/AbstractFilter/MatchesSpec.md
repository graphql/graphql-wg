# GraphQL @matches Directive Specification

_Status: Strawman_<br>
_Version: 2026-01-08_

`@matches` is an executable directive that clients or code generation tools
may provide in order to generate the input value for a field argument which uses
`@limitTypes` type system directive.

Users of this specification must also implement
the [GraphQL Abstract Type Filter Specification](./AbstractFilterSpec.html)
on the server in order to enforce the type matching contract at runtime.

Note: Usage of `@matches` is optional, but recommended to avoid duplication of
the list of allowed types.

## @matches

```graphql
directive @matches(
  argument: String! = "only"
) on FIELD | FRAGMENT_SPREAD | INLINE_FRAGMENT
```

**Directive Arguments**

argument:
:   The name of the argument to populate with the list of allowed types.
    Defaults to `"only"`.

TODO: Introduce the `sort` flag

**Example Usage**

This operation expresses that the `allPets` field may only return types that
are selected for in the field's selection set (`Cat` and `Dog`):

```graphql example
{
  allPets @matches {
    ... on Cat { name }
    ... on Dog { name }
  }
}
```

The result of applying the document transform would be:

```graphql example
{
  allPets(only: ["Cat", "Dog"]) {
    ... on Cat { name }
    ... on Dog { name }
  }
}
```

`@matches` may also be applied in operations against schema that implements the
[GraphQL Cursor Connections Specification](https://relay.dev/graphql/connections.htm#sec-Connection-Types):


```graphql example
{
  allPetsConnection(first: 10, after: "opaqueCursor") @matches {
    edges {
      node {
        ... on Cat { name }
        ... on Dog { name }
      }
    }
  }
}
```

The result of applying the transform would be:


```graphql example
{
  allPetsConnection(first: 10, after: "opaqueCursor", only: ["Cat", "Dog"]) {
    edges {
      node {
        ... on Cat { name }
        ... on Dog { name }
      }
    }
  }
}
```

## Document Transform

`@matches` is a local-only directive. The client must transform the operation
(either at build-time, or at runtime) before sending the operation to the
server. `@matches` must not appear in an operation sent to the server.

Note: The server schema does not need to define the `@matches` directive, since
it is stripped before the operation is sent to the server.

Fields that use `@matches` must not already define the filter argument.

**Formal Specification**

CollectAllowedTypes(selectionSet):

- Let {allowedTypes} be an empty set.
- For each {selection} in {selectionSet}:
  - If {selection} is an InlineFragment:
    - Let {typeCondition} be the type condition of {selection}.
    - If {typeCondition} exists, add {typeCondition} to {allowedTypes}.
  - If {selection} is a FragmentSpread:
    - Let {fragment} be the fragment definition referenced by {selection}.
    - Let {typeCondition} be the type condition of {fragment}.
    - Add {typeCondition} to {allowedTypes}.
  - If {selection} is a Field and its name is {"edges"}:
    - Let {edgesSelectionSet} be the selection set of {selection}.
    - For each {edgeSelection} in {edgesSelectionSet}:
      - If {edgeSelection} is a Field and its name is {"node"}:
        - Let {nodeSelectionSet} be the selection set of {edgeSelection}.
        - Let {nodeTypes} be CollectAllowedTypes({nodeSelectionSet}).
        - Add each type in {nodeTypes} to {allowedTypes}.
- Return {allowedTypes}.

<!--
TODO: handle the following case

  allPetsConnection @matches {
    ... on ConnectionType { pageInfo { } }  # Fragment on the Connection type itself
    edges {
      node {
        ... on Cat { name }
        ... on Dog { name }
      }
    }
  }

CollectAllowedTypes needs to branch based on if it's a connection or not.
-->

TransformDocument(document):

- For each {field} in {document}:
  - Let {matchesDirective} be the directive named {"matches"} applied to {field}.
  - If {matchesDirective} does not exist, continue to the next {field}.
  - Let {argumentName} be the argument value of the {"argument"} argument of {matchesDirective}
  - If {field} has an argument named {argumentName}, raise an error.
  - Let {selectionSet} be the selection set of {field}.
  - Let {allowedTypes} be CollectAllowedTypes({selectionSet}).
  - Let {typeNames} be a list of the names of each type in {allowedTypes}.
  - Add an argument named {argumentName} with value {typeNames} to {field}.
  - Remove {matchesDirective} from {field}.
- Return {document}.
