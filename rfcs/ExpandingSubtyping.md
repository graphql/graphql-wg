# RFC: Expanding Subtyping (for output types)

Related issues:

Original take on unions implements interfaces (prior to when interfaces implemented interfaces):
- [graphql-js - PR: A union type cannot satisfy an interface even if each child type does](https://github.com/graphql/graphql-js/pull/1488)
- [graphql-spec - Issue: [RFC] Union types can implement interfaces](https://github.com/graphql/graphql-spec/issues/518)

Second take on unions implementing interfaces:
- [graphql-spec - PR: allow unions to declare implementation of interfaces](https://github.com/graphql/graphql-spec/pull/939)
- [graphql-js - PR: allow unions to declare implementation of interfaces](https://github.com/graphql/graphql-js/pull/3527)

Alternative to constraints using new intersection type:
- [graphql-spec - Discussion: New Intersection Type](https://github.com/graphql/graphql-wg/discussions/944)

Unions including other abstract types:
- [graphql-spec - Issue: union does not allow sub-union or covariance](https://github.com/graphql/graphql-spec/issues/711)
- [graphql-spec - PR: allow unions to include interfaces and unions](https://github.com/graphql/graphql-spec/pull/950)
- [graphql-js - PR: allow unions to include abstract types](https://github.com/graphql/graphql-js/pull/3682)

## Problem Statement

### Introduction

Currently, GraphQL recognizes subtypes of two forms:

1. A type (object or interface type) may implement an interface. The given type (object or interface) can therefore be recognized as a subtype of that interface.
2. A type (object type) may be a member of a union. The given object type is recognized as a subtype of that union.

Recognization as a subtype is important for the ["IsValidImplementation"](<https://spec.graphql.org/October2021/#IsValidImplementation()>) and ["IsValidImplementationFieldType"](<https://spec.graphql.org/October2021/#IsValidImplementationFieldType()>) algorithms.

To quote the former, emphasis added here:

> 2. e) {field} must return a type which is equal to **or a sub-type of (covariant)** the return type of {implementedField} field’s return type

The latter algorithm contains the steps that check whether a type is indeed a subtype of another:

> 3. If {fieldType} is the same type as {implementedFieldType} then return {true}
> 4. If {fieldType} is an Object type and {implementedFieldType} is a Union type and {fieldType} is a possible type of {implementedFieldType} then return {true}.
> 5. If {fieldType} is an Object or Interface type and {implementedFieldType} is an Interface type and {fieldType} declares it implements {implementedFieldType} then return {true}.
> 6. Otherwise return {false}.

[Note [that there exists a PR](https://github.com/graphql/graphql-spec/pull/977) to break out this subtyping algorithm into a separate small algorithm "IsSubType".]

This algorithm currently fails to capture all output types that are subtypes (covariant) of another. Namely, although interfaces can be subtypes of other interfaces, they cannot be subtypes of unions, nor can unions be subtypes of unions or of interfaces.

### Case 1: Unions Subtyping Interfaces

Unions cannot be subtypes of an interface even if all member types implement an interface:

Assume the following generic types:

```graphql
# generic types
interface Node {
  id: ID!
}

interface Connection {
  pageInfo: PageInfo!
  edges: [Edge]
}

interface Edge {
  cursor: String
  node: Node
}

type PageInfo {
  hasPreviousPage: Boolean
  hasNextPage: Boolean
  startCursor: String
  endCursor: String
}
```

The following cannot be expressed.

```graphql
type Cat implements Node {
  id: ID!
  name: String
}

type Dog implements Node {
  id: ID!
  name: String
}

union Pet = Cat | Dog

type PetEdge implements Edge {
  cursor: String
  node: Pet # <<< fails validation
}

type PetConnection implements Connection {
  pageInfo: PageInfo!
  edges: [HousePetEdge]
}
```

Even though all members of `Pet` implement `Node`, by the above algorithm, union types cannot be subtypes of interface types.

### Case 2: Unions Subtyping Unions

Unions cannot be subtypes of another union even if all members of the (potential subtyping) union are members of the other (potential supertyping) union:

```graphql
type Cow {
  fieldA: String
}

type Wolf {
  fieldB: String
}

type Lion {
  fieldC: String
}

union Animal = Cow | Wolf | Lion

union CowOrWolf = Cow | Wolf

interface Person {
  animal: Animal
}

type CowOrWolfPerson implements Person {
  animal: CowOrWolf # <<< fails validation
}
```

Even though all members of `CowOrWolf` are members of `Animal`, by the above algorithm, union types cannot be subtypes of union types.

### Case 3: Interfaces Subtyping Unions

Interfaces cannot be subtypes of a union even if all implementations of the interface are member types of the union:

```graphql
interface Programmer {
  someField: String
}

type RESTConsultatnt implements Programmer {
  someField: String
}

type GraphQLEnthusiast implements Programmer {
  someField: String
}

type Admin {
  anotherField: String
}

union Employee = RESTConsultant | GraphQLEnthusiast | Admin

interface Company {
  employees: [Employee]
}

type NoAdminCompany implements Company {
  employees: [Programmer] # <<< fails validation
}
```

Even though all implementations of `Programmer` are members of `Employee`, by the above algorithm, interface types cannot be subtypes of a union type.

### Conclusion/Refinement of the Problem Statement

GraphQL types cannot implement interfaces if the implementing or implemented type utilizes unions, even if analysis of the schema would lead to one believe that the implementing fields' types are subtypes of the implemented fields.

The problems with the current behavior are:

- Type system coherence. GraphQL cannot be made aware of the ground truth regarding subtypes.
- Power. Unions cannot be utilized to their full extent, as their use is limited in the presence of interfaces.
- Translatability. Converting from other more well-defined type systems to GraphQL is limited.

The advantages of the current behavior are:

- Simplicity.
- Schema evolution.

To expand on the problems related to schema evolution:

Case 1: Unions Subtyping Interfaces

If a union is allowed to subtype an interface because all existing members of the subtyping union implement the interface, then introducing an additional member to the subtyping union that does not implement the interface would be a (subtle!) breaking change.

Case 2: Unions Subtyping Unions

If a union is allowed to subtype a union because all existing members of the subtyping union implement the other union, then introducing an additional member to the subtyping union that is not a member of the other union would be a (subtle!) breaking change.

Case 3: Interfaces Subtyping Unions

If an interface is allowed to subtype a union because all implementations of the interface are members of the union, then introducing a new type that implements the subtyping interface that is not a member of the union would be a (subtle!) breaking change.

## Proposed Solution

Introduction of Constraints:

### Case 1: Unions Subtyping Interfaces

```
union Pet implements Node = Cat | Dog
```

or

```
union Pet @whereMemberImplements(interface: "Node") = Cat | Dog
```

These options differ only in terms of new syntax vs. the use of directives, but basically work in the same way. With the addition of the new syntax, schema developers that introduce a type to the union that does not satisfy the constraint will receive a schema validation error.

#### Question: should the following query be allowed?

```graphql
{
  petConnection {
    edges {
      node {
        id
      }
    }
  }
}
```

or should it be required to write:

```graphql
{
  petConnection {
    edges {
      node {
        ... on Node {
          id
        }
      }
    }
  }
}
```

Certainly the second formulation is awkward; the field is named "node", so presumably it is of type `Node`. Moreover, if the union is constrained to always implement an interface, it should be safe to specify fields directly on the union. On the other hand, if a union is constrained by multiple interfaces that have fields with non-identical, but compatible types, the types of the fields are ambiguous. (This concern also affects [implicit interface field inheritance](https://github.com/graphql/graphql-wg/blob/8faa7af3ce7a3b447c66583c96d94892228ef17b/rfcs/ImplicitInheritance.md#disadvantages).)

Of course, it would be unambiguous to assign _some_ fields to the union, such as "id" above, because "id" can have only the type ID; not only is there only one interface within the constraint, but even if there were multiple, there are no potential compatible types of a Scalar type.

We can potentially "solve" this problem more generally with new syntax:

```
union Pet implements Node with {
  id: ID
} = Cat | Dog
```

The "with" clause defines the exact way in which the union will be required to implement the type, which would be optional if there would be no other way to interpret the `Node` interface, as in this case.

### Case 2: Unions Subtyping Unions

#### Option A

```
union Animal = CowOrWolf | Lion

union CowOrWolf = Cow | Wolf
```

We can allow union to be member types of unions, such that all member types of the child union are also considered to be member types of the parent union.

Schema construction will now cause some level of recursion. Determining the `possibleTypes` of `Animal` requires first determining the possible types of `CowOrWolf`. Cycles must be forbidden as well, similar to how cycles are forbidden for interfaces implementing interfaces.

This new construction would require changes to introspection:

##### Suboption A

- existing field `possibleTypes` for `Animal` could include: `Cow`, `Wolf`, and `Lion`
- new field `memberTypes` for `Animal` could include only: `CowOrWolf` and `Lion`

##### Suboption A

- existing field `possibleTypes` for `Animal` could include: `CowOrWolf`, `Cow`, `Wolf`, and `Lion` => this would change the meaning of the `possibleTypes` field from being a list of concrete types to be the list of recognized subtypes, which may or may not be concrete.
- no need for any new fields

#### Option B

```
union Animal = CowOrWolf | Cow | Wolf | Lion

union CowOrWolf = Cow | Wolf
```

This option differs from "Option A" only in that all members of the child union must be explicitly listed in the parent union, thus ensuring that no recursion is required.

#### Option C

```
union Animal = Cow | Wolf | Lion

union CowOrWolf memberOf Animal = Cow | Wolf
```

This option differs from "Option A" and "Option B" in that instead of actually allowing a union to be a member of another union, we introduce a constraint on the child union that indicates that all member types must have a certain property, similar to "Case 1".

#### Option D

```
union Animal = Cow | Wolf | Lion

union CowOrWolf @memberOf(union: "Animal") = Cow | Wolf
```

This option differ from "Option C" only in terms of new syntax vs. the use of directives, but works in the same way.

### Case 3: Interfaces Subtyping Unions

#### Option A

```
interface Programmer {
  someField: String
}

union Employee = Programmer | Admin
```

We can allow interfaces to be member types of unions, such that all implementations of the interface are considered to be member types of the parent union.

Schema construction will now be somewhat increased in complexity. Determining the `possibleTypes` of `Employee` requires first determining all the implementations of `Programmer`; this is not a recursive process, however.

This new construction would require changes to introspection:

##### Suboption A

- existing field `possibleTypes` for `Employee` could include: `RESTConsultant`, `GraphQLEnthusiast`, and `Admin`
- new field `memberTypes` for `Employee` could include only: `Programmer` and `Admin`

##### Suboption B

- existing field `possibleTypes` for `Employee` could include: `Programmer`, `RESTConsultant`, `GraphQLEnthusiast`, and `Admin` => as above, this would change the meaning of the `possibleTypes` field from being a list of concrete types to be the list of recognized subtypes, which may or may not be concrete.
- no need for any new fields

#### Option B

```
interface Programmer {
  someField: String
}

union Employee = Programmer | RESTConsultant | GraphQLEnthusiast | Admin
```

This option differs from "Option A" only in that all implementations of the interface must be explicitly listed in the parent union, potentially improving schema readability.

#### Option C

```
interface Programmer memberOf Union {
  someField: String
}

union Employee = RESTConsultant | GraphQLEnthusiast | Admin
```

This option differs from "Option A" and "Option B" in that instead of actually allowing an interface to be a member of a union, we introduce a constraint on the interface that indicates that all implementations must have a certain property, similar to "Case 1" and "Case 2 / Option C".

#### Option D

```
interface Programmer @memberOf(union: "Employee") {
  someField: String
}

union Employee = RESTConsultant | GraphQLEnthusiast | Admin
```

This option differ from "Option C" only in terms of new syntax vs. the use of directives, but works in the same way.

## Closing Thoughts

- It would be nice to have a uniform way of solving Cases 1-3, but this might not be the optimal solution.
