# RFC: Field Extensions

**Proposed by:** [Martin Bonnin](https://mastodon.mbonnin.net/@mb) - Apollo

## Problem statement

The current GraphQL specification allows [type system extensions](https://spec.graphql.org/draft/#sec-Type-System-Extensions). 

For example, it is possible to add directives to an existing type. In this example (from the [specification text](https://spec.graphql.org/draft/#sel-FAHZnCNCAACCck1E)), a directive is added to a User type without adding fields:

```graphql
extend type User @addedDirective
```

The same thing is not possible for fields:

```graphql
# This is not valid GraphQL
extend type User {
    id: ID! @key
}
```

This has been an ongoing pain point when working in clients that do not own the schema but want to annotate it for codegen or other reasons. In Apollo Kotlin, this has led to the proliferation of directives ending in `*Field` whose only goal is to work around that limitation. For an example, this is happening in the [nullability directives](https://specs.apollo.dev/nullability/v0.4/):

```graphql
# This can be added to a field definition directly
directive @semanticNonNull(levels: [Int!]! = [0]) on FIELD_DEFINITION

# This is the same thing but on the containing type.
# It is more verbose and cumbersome to write and maintain
directive @semanticNonNullField(name: String!, levels: [Int!]! = [0]) repeatable on OBJECT | INTERFACE
```

## Proposal

This proposal introduces specific syntax to add directive to existing field definitions. It builds on top of the [schema coordinates RFC](https://github.com/graphql/graphql-wg/blob/main/rfcs/SchemaCoordinates.md) to allow for a shorter syntax:

```graphql
extend field User.id @key
```

Or for the nullability example above:

```graphql
extend field User.address @semanticNonNull
```

This syntax purposedly disallows changing the type of the field and is limited to adding directives. The same validation as for other type system extensions would apply: the directive needs either not be already present or be repeatable.

Syntax:

```
FieldExtension:
  extend field FieldCoordinates Directives[const]
```




