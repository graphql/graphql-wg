  

# RFC: Opt-in features

 This document is a work in progress. A lot of the questions about introspection are closely related to [#300](https://github.com/graphql/graphql-spec/issues/300) (`Expose user-defined meta-information via introspection API in form of directives`) and will therefore need to be revisited based on the progress there.

## 📜 Problem Statement

  

GraphQL has a [built-in mechanism for deprecation](https://spec.graphql.org/draft/#sec--deprecated) allowing to gracefully remove features from the schema. The lifecycle of a feature can typically be represented as `stable` -> `deprecated` -> `removed`.  

In a lot of cases though, a feature lifecycle includes an experimental phase where it has just been added and can be changed without warning. In this state, the feature is usable and feedback is encouraged but isn't considered stable enough to be put in production. The feature lifecycle becomes `experimental` -> `stable` -> `deprecated` -> `removed` .

  
### Goals
The goal of this proposal is to support the `experimental` state and, moving forward, any state that requires the client developer to make an explicit decision before using a given feature. In that sense, it's about "opting in" to using the feature, which includes supporting `experimental` states. 

To give a few examples:

* a field is experimental and might be changed or removed without prior notice (the above example).

* a field is expensive to compute and should be used with caution.

* a field has specific security requirements and requires a specific header or other form of authentication.

### Non-goals
This proposal is not about security and/or hiding parts of a schema. Its goal is to make it easier to communicate opt-in features to client developer and therefore needs to expose that information.

## 👀 Prior work

* GitHub uses [schema previews](https://docs.github.com/en/graphql/overview/schema-previews) to opt-in new features.
* Kotlin has [OptIn requirements](https://kotlinlang.org/docs/opt-in-requirements.html) that started out as `@Experimental` before [being changed to `@OptIn`](https://youtrack.jetbrains.com/issue/KT-26216/Generalize-Experimental-API)

## 🧑‍💻 Proposed solution

### The `@optIn` directive

It is proposed to add an `@optIn` directive to the specification:

```graphql
"""
Indicates that the given field, argument, input field or enum value requires
giving explicit consent before being used.
"""
directive @optIn(feature: String!) repeatable
    on FIELD_DEFINITION 
    | ARGUMENT_DEFINITION 
    | INPUT_FIELD_DEFINITION 
    | ENUM_VALUE
```

The `optIn` directive can then be used in the schema. For an example, to signal an experimental field:

```graphql
type Session {
  id: ID!
  title: String!
  # [...]
  startInstant: Instant @optIn(feature: "experimentalInstantApi")
  endInstant: Instant @optIn(feature: "experimentalInstantApi")
}
```

### Introspection

> This section is a proposal based on the current introspection mechanism. A more global mechanism (see [#300](https://github.com/graphql/graphql-spec/issues/300)) would make it obsolete

`@optIn` features should be hidden from introspection by default and include if `includeOptIn` contains the given feature:

```graphql
type __Type {
  kind: __TypeKind!
  name: String

  # [...] other fields omitted for clarity

  # includeOptIn is a list of features to include
  fields(includeDeprecated: Boolean = false, includeOptIn: [String!]): [__Field!]  
}
```

Tools can get a list of `@optIn` features required to use a field (or input field, argument, enum value) using `requiresOptIn`:
```graphql
type __Field {
  name: String!
  isDeprecated: Boolean!

  # [...] other fields omitted for clarity

  # list of @optIn features required to use this field
  requiresOptIn: [String!]
  args(includeDeprecated: Boolean = false, includeOptIn: [String!]): [__InputValue!]!
}
```

A given field is included in introspection results if all the conditions are satisfied. In pseudo code, if the following condition is true:

```
includeOptIn.containsAll(field.requiresOptIn) && (includeDeprecated || !field.isDeprecated)
```

### Validation

Similarly to [deprecation](https://spec.graphql.org/draft/#sel-FAHnBZNCAACCwDqvK), the `@optIn` directive must not appear on required (non-null without a default) arguments or input object field definitions.

In other words, `@optIn`  arguments or input fields, must be either nullable or have a default value.

## 🗳️ Alternate solutions

### `@experimental` directive

```graphql
# Indicates that the given field or enum value is still experimental and might be changed 
# in a backward incompatible manner
directive @experimental(
  reason: String! = "Experimental"
) on FIELD_DEFINITION | ARGUMENT_DEFINITION | INPUT_FIELD_DEFINITION | ENUM_VALUE
```

Pros:
* simple
* symmetrical with `@deprecated`

Cons:
* doesn't account for opt-in requirements that are not experimental 
* makes it harder to group by features. `reason` could be used for this but it is less explicit than `feature`

### marker directives

```graphql
directive @optIn
```

The user then define their own directives:

```graphql
# optIn usage defines @experimentalDeploymentApi as an opt-in marker
directive @experimentalDeploymentApi @optin

type Query {
  deployment: Deployment @experimentalDeploymentApi
}
```

Pros:
* gives more control to the user about the directive used
* has more type information

Cons:
* more complex
* requires a grammar change
