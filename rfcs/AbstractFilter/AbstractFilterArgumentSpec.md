# Abstract Type Filter Argument

## @limitTypes

```graphql
directive @limitTypes on ARGUMENT_DEFINITION
```

`@limitTypes` is a type system directive that may be applied to a field
argument definition in order to express that it will define the exclusive set of
types that the field is allowed to return.

The server must enforce and validate the allowed types according to this
specification.

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
- a connection type (conforming to the
  [GraphQL Cursor Connections Specification](https://relay.dev/graphql/connections.htm#sec-Connection-Types)
  over an abstract type)

## Execution

The `@limitTypes` directive places requirements on the {resolver} used to
satisfy the field. Implementers of this specification must honor these
requirements.

### Coercing Allowed Types

:: A *filter argument* is a field argument which has the `@limitTypes`
directive applied.

The input to the *filter argument* is a list of strings, however this must be
made meaningful to the resolver such that it may perform its filtering - thus we
must resolve it into a list of valid concrete object types that are possible in
this position.

:: The coerced list of valid concrete object types are the *allowed types*.

CoerceAllowedTypes(abstractType, typeNames):

- Let {possibleTypes} be a set of the possible types of {abstractType}.
- Let {allowedTypes} be an empty unordered set of object types.
- For each {typeName} in {typeNames}:
  - Let {type} be the type in the schema named {typeName}.
  - If {type} does not exist, raise an execution error.
  - If {type} is an object type:
    - If {type} is a member of {possibleTypes}, add {type} to {allowedTypes}.
    - Otherwise, raise an execution error.
  - Otherwise, if {type} is a union type:
    - For each {concreteType} in {type}:
      - If {concreteType} is a member of {possibleTypes}, add {concreteType} to
        {allowedTypes}.
  - Otherwise, if {type} is an interface type:
    - For each {concreteType} that implements {type}:
      - If {concreteType} is a member of {possibleTypes}, add {concreteType} to
        {allowedTypes}.
  - Otherwise, raise an execution error (scalars, enums, and input types are not
    valid filter argument values).
- Return {allowedTypes}.

**Explanatory Text**

The input to the *filter argument* may include both concrete and abstract types.
{CoerceAllowedTypes} expands *allowed types* to include the possible and valid
concrete types for each abstract type.

To see why this is needed, we will expand our example schema above to include
the following types:

```graphql example
interface Fish {
  swimSpeed: Int!
}
  
type Goldfish implements Pet & Fish {
  name: String!
  swimSpeed: Int!
}

type Haddock implements Fish {
  swimSpeed: Int!
}
```

It is possible for types to implement multiple interfaces. It therefore must be
possible to select concrete types of another interface in the *filter argument*:

```graphql example
{
  allPets(only: ["Fish"]) {
    ... on Goldfish {
      swimSpeed 
    }
  }
}
```

The below example must fail, since `Haddock` does not implement the `Pet`
interface, and is therefore not a possible return type.

```graphql counter-example
{
  allPets(only: ["Haddock"]) {
    ... on Fish {
      swimSpeed
    }
  }
}
```

### Allowed Types Restriction

Enforcement of the *allowed types* is the responsibility of the {resolver}
called in
[`ResolveFieldValue()`](<https://spec.graphql.org/draft/#ResolveFieldValue()>)
during the [`ExecuteField()`](<https://spec.graphql.org/draft/#ExecuteField()>)
algorithm.

:: When the field returns an abstract type, the *collection* is this type.
When the field returns a list of an abstract type, the *collection* is this
list. When the field returns a connection type over an abstract type, the
*collection* is the list of abstract type the connection represents.

The resolver must apply this restriction when fetching or generating the source
data to produce the *collection*. This is because the filtering must occur prior
to applying pagination logic in order to produce the correct number of results.

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

Note: The restriction must be applied before pagination arguments so that
non-terminal pages in the collection get full representation - i.e. there
are no gaps.

## Validation Algorithms

`@limitTypes` fields must implement the algorithms listed in the
[Execution](#Execution) section above to be spec-compliant. However, it may be
impossible or extremely difficult for GraphQL servers to statically verify the
correctness of the runtime and prevent non-compliant implementations.

To this end, this section specifies a set of algorithms in order for the server
to validate that the *filter argument* value and the field response are valid.

Usage of these algorithms is **optional**, but highly recommended to guard
against programmer error.

All algorithms in this section run either before or after 
[`ResolveFieldValue()`](<https://spec.graphql.org/draft/#ResolveFieldValue()>),
and must be run automatically by the server when executing fields for which
the `@limitTypes` directive is applied,

### Filter Argument Value Validation

Each member of the *filter argument* value must exist in the type system and be
a possible return type of the field.

For example, the query below must yield an execution error - since
`LochNessMonster` is not a type that exists in the example schema.

```graphql counter-example
{
  allPets(only: ["Cat", "Dog", "LochNessMonster"]) {
    name
  }
}
```

When used, this algorithm must be applied before
[`ResolveFieldValue()`](<https://spec.graphql.org/draft/#ResolveFieldValue()>).

ValidateFilterArgument(filterArgumentValue):

- Let {abstractType} be the abstract type the {collection} represents.
- Let {possibleTypes} be a set of the possible types of {abstractType}.
- For each {typeName} in {filterArgumentValue}:
  - Let {type} be the type in the schema named {typeName}.
  - If {type} does not exist, raise an execution error.
  - If {type} is an object type:
    - If {type} is not a member of {possibleTypes} raise an execution error.
  - Otherwise, if {type} is a union type:
    - ??? todo
  - Otherwise, if {type} is an interface type:
    - ??? todo
  - Otherwise, raise an execution error (scalars, enums, and input types are not
    valid filter argument values).
- Return {allowedTypes}.

Note: Schema-aware clients or linting tools are encouraged to implement this
validation locally.

### Field Collection Validation (wip)

For example, the following query must raise an execution error since `Mouse`
does not appear as a value in {allowedTypes}

```graphql counter-example
{
  allPets(only: ["Cat", "Dog"]) {
    ... on Cat { name }
    ... on Dog { name }
    ... on Mouse { name }
  }
}
```

TODO: implement algorithm

### Field Response Validation (wip)

TODO: if the response array of the field contains a type that did not appear in
{CoerceAllowedTypes()}, raise an execution error<br><br>
yes, if a resolver already correctly implements the "Enforcing Allowed Types"
logic then this isn't necessary - but - I think this is worth speccing out as a
dedicated step because this is likely something tooling will want to be able to
automatically apply to all @limitTypes'd fields as a middleware. This is to
provide an extra layer of safety (otherwise we're trusting that human
implementers got it right inside the resolver)

For example, given a *filter argument* of `["Cat", "Dog"]`, the following would
be invalid since {allPets} contains `Mouse`:

```json counter-example
{
  "data": {
    "allPets": [
      { "__typename": "Cat", "name": "Tom" },
      { "__typename": "Mouse", "name": "Jerry" }
    ]
  }
}
```

...is this even possible? this assumes that client asks for `__typename`
which isn't guaranteed. https://spec.graphql.org/draft/#ResolveAbstractType()
likely is not possible since this logic is intended to be run generically as a
middleware - i.e _after_ the field has completed, and the in-memory object
representation has been converted into json blob (potentially without
`__typename`)

or can we look at using \_\_resolveType()?
