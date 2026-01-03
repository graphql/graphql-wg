# Abstract Type Filter

<!-- todo: rename document title to `@limitTypes Type System Directive` ? -->
<!-- todo: rename this file `LimitTypes.md` ? -->

## @limitTypes

```graphql
directive @limitTypes on ARGUMENT_DEFINITION
```

`@limitTypes` is a type system directive that may be applied to a field
argument in order to express that it defines the exclusive set of types that the
field may return.
<!-- todo: any preference for "that are possible in this position" over "that the field may return"? -->

**Example Usage**

```graphql example
type Query {
  allPets(only: [String] @limitTypes): [Pet]
}

interface Pet {
  name: String!
}

type Cat implements Pet {
  name: String!
}

type Dog implements Pet {
  name: String!
}

interface Human {
  name: String!
}
```

`@limitTypes` may also be applied to schema that implements the
[GraphQL Cursor Connections Specification](https://relay.dev/graphql/connections.htm#sec-Connection-Types):

```graphql example
type Query {
  allPetsConnection(
    first: Int
    after: String
    only: [String] @limitTypes
  ): PetConnection
}

type PetConnection {
  edges: [PetEdge]
  pageInfo: PageInfo!
}

type PetEdge {
  cursor: String!
  node: Pet
}

interface Pet {
  name: String!
}
```

## Schema Validation

The `@limitTypes` directive must not appear on more than one argument on the
same field.

The `@limitTypes` directive may only appear on an argument that accepts a
(possibly non-nullable) list of (possibly non-nullable) String.

The `@limitTypes` directive may only appear on an field argument where the field
returns either:

- an abstract type
- a list of an abstract type
- a connection type (conforming to
[the GraphQL Cursor Connections Specification](https://relay.dev/graphql/connections.htm#sec-Connection-Types)) over an abstract type

## Execution

The `@limitTypes` directive places requirements on the {resolver} used to
satisfy the field. Implementers of this specification must honour these
requirements.

### Filter Argument Validation

:: A *filter argument* is the input value of a field argument with the
`@limitTypes` directive applied to it.

Each type referenced in the filter argument must exist in the type system, and
be possible in this position for it to be considered a valid input value in the
context of this specification.

This validation happens as part of {CoerceAllowedTypes()}, defined below.

```graphql counter-example
{
  allPets(only: ["Cat", "Dog", "LochNessMonster"]) {
    name
  }
}
```

The example above must yield an execution error, since `LochNessMonster` is not
a type that exists in the type system.

Note: Filter argument validation is necessary as schema-unaware clients are
otherwise unable to verify the correctness of this argument.

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
  - If {type} does not exist, raise an execution error.
  - If {type} is an object type:
    - If {type} is a member of {possibleTypes}, add {type} to {allowedTypes}.
    - Otherwise, raise an exection error.
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

When the field returns an abstract type, the {collection} is a list containing
a single element which is that type. When the field returns a list of an
abstract type, the {collection} is this list. When the field returns a
connection type over an abstract type, the {collection} is the list of abstract
type the connection represents.

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
non-terminal pages in the {collection} get full representation - i.e. there are
no gaps.

### Field Collection Validation

TODO: the following should raise an error since `Mouse` does not appear as a
value in {allowedTypes}

```graphql counter-example
{
  allPets(only: ["Cat", "Dog"]) {
    ... on Cat { name }
    ... on Dog { name }
    ... on Mouse { name }
  }
}
```

### Field Response Validation

TODO: if the response array of the field contains a type that did not appear in
{CoerceAllowedTypes()}, raise an execution error<br><br>
yes, if a resolver already correctly implements the "Enforcing Allowed Types"
logic then this isn't neccesary - but - I think this is worth speccing out as a
dedicated step because this is likely something tooling will want to be able to
automatically apply to all @limitTypes'd fields as a middleware. This is to
provide an extra layer of safety (otherwise we're trusting that human
implementors got it right inside the resolver)

For example, given a filter argument value of `["Cat", "Dog"]`, the following
would be invalid since {allPets} contains `Mouse`:

```json counter-example
{
  "data":
    "allPets": [
      { "__typename": "Cat", "name": "Tom" },
      { "__typename": "Mouse", "name": "Jerry" }
    ]
  }
}
```
