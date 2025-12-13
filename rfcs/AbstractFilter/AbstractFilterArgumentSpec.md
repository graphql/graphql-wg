# Abstract Filter Argument

Status: Strawman

## Directive

```graphql
directive @limitTypes on FIELD_DEFINITION
```

### Examples

```graphql
type Query {
  allPets(first: Int, only: [String] @limitTypes): [Pet]
}

interface Pet {
  name: String!
}
```

```graphql
type Query {
  allPetsConnection(
    first: Int
    after: String
    only: [String] @limitTypes
  ): PetConnection
}

# TODO: connection types

interface Pet {
  name: String!
}
```

## Schema Validation

The `@limitTypes` directive must not appear on more than one argument on the
same field.

The `@limitTypes` directive may only appear on an argument that accepts a
(possibly non-nullable) list of (possibly non-nullable) String.

The `@limitTypes` directive may only appear on an argument to a field whose
named return type is a connection type (that is to say, conforming to
[the GraphQL Cursor Connections Specification's Connection Type](https://relay.dev/graphql/connections.htm#sec-Connection-Types))
over an abstract type, or to a field whose return type is a list and the named
return type is an abstract type.

## Execution

The `@limitTypes` directive places requirements on the {resolver} used to
satisfy the field. Implementers of this specification must honour these
requirements.

### Coerce Allowed Types

The input to the filter argument is a list of strings, however this must be made
meaningful to the resolver such that it may perform its filtering - thus we must
resolve it into a list of valid concrete object types that are possible in this
position.

CoerceAllowedTypes(abstractType, typeNames):

- Let {possibleTypes} be a set of the possible types of {abstractType}.
- Let {allowedTypes} be an empty unordered set of object types.
- For each {typeName} in {typeNames}:
  - Let {type} be the type in the schema named {typeName}.
  - If {type} does not exist, continue to the next {typeName}.
  - If {type} is an object type:
    - If {type} is a member of {possibleTypes}, add {type} to {allowedTypes}.
  - Otherwise, if {type} is a union type:
    - For each {concreteType} in {type}:
      - If {concreteType} is a member of {possibleTypes}, add {concreteType} to
        {allowedTypes}.
  - Otherwise, if {type} is an interface type:
    - For each {concreteType} that implements {type}:
      - If {concreteType} is a member of {possibleTypes}, add {concreteType} to
        {allowedTypes}.
  - Otherwise continue to the next {typeName}.
- Return {allowedTypes}.

### Enforcing Allowed Types

Enforcement of the allowed types is the responsibility of the {resolver} called
in
[`ResolveFieldValue()`](<https://spec.graphql.org/draft/#ResolveFieldValue()>)
during the [`ExecuteField()`](<https://spec.graphql.org/draft/#ExecuteField()>)
algorithm. This is because the filtering must be applied to the {collection}
prior to applying the pagination arguments.

When the field returns a list of an abstract type, the {collection} is this
list. When the field returns a connection type over an abstract type, the
{collection} is the list of nodes the connection represents.

When a field with a `@limitTypes` argument is being resolved:

- Let {limitTypesArgument} be the first argument with the `@limitTypes`
  directive.
- If no such argument exists, no further action is necessary.
- If {argumentValues} does not provide a value for {limitTypesArgument}, no
  further action is necessary.
- Let {limitTypes} be the value in {argumentValues} of {limitTypesArgument}.
- If {limitTypes} is {null}, no further action is necessary.
- Let {abstractType} be the abstract type the {collection} represents.
- Let {allowedTypes} be {CoerceAllowedTypes(abstractType, limitTypes)}.

The resolver must ensure that the result of
[`ResolveAbstractType()`](<https://spec.graphql.org/draft/#ExecuteField()>) for
each entry in {collection} is a type within {allowedTypes}. The resolver must
apply this restriction before applying any pagination arguments.

Note: The restriction must be applied before pagination arguments so that
non-terminal pages in the collection get full representation - i.e. there are no
gaps.
