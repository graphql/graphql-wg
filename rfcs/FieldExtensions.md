# RFC: Field/Argument/EnumValues Extensions

**Proposed by:** [Martin Bonnin](https://mastodon.mbonnin.net/@mb) - Apollo

## Problem statement

The current GraphQL specification allows [type system extensions](https://spec.graphql.org/draft/#sec-Type-System-Extensions). 

For example, it is possible to add directives to an existing type. In this example (from the [specification text](https://spec.graphql.org/draft/#sel-FAHZnCNCAACCck1E)), a directive is added to a User type without adding any field:

```graphql
extend type User @addedDirective
```

The same thing is not possible for fields/inputFields/arguments/enumValues:

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
# Adding directives to a field
extend field User.id @key

# Adding directives to an argument
extend argument Query.node(id:) @keyArg

# Adding directives to an enum value
extend enumValue Direction.north @target(name: "NORTH")
```

This syntax purposedly disallows changing the type of the field and is limited to adding directives. The same validation as for other type system extensions would apply: the directive needs either not be already present or be repeatable.

## Formal Syntax:

```
FieldExtension:
  extend field FieldCoordinates Directives[const]

ArgumentExtension:
  extend field ArgumentCoordinates Directives[const]

EnumValueExtension:
  extend field EnumValueCoordinates Directives[const]
```

## Questions

### Should we use the existing syntax instead?

We could use the existing type extensions instead of coordinates:

```graphql
extend type User {
    id: ID! @key
}
```

This is more familiar but more verbose and move some logic from the parser to the validation. For example, validation should double check that the field and argument types are the same.

Using the existing type extensions would also allow adding arguments to an existing field if this is something that we want to allow. 

```graphql
extend type User {
    address(newArgument: String): String!
}
```


