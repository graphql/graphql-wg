# RFC: Opt-in features

**Proposed by:** [Martin Bonnin](https://twitter.com/martinbonnin)

This document is a work in progress. A lot of the questions about introspection are closely related
to [#300](https://github.com/graphql/graphql-spec/issues/300) (`Expose user-defined meta-information via introspection API in form of directives`)
and will therefore need to be revisited based on the progress there.

## 📜 Problem Statement

GraphQL has a [built-in mechanism for deprecation](https://spec.graphql.org/draft/#sec--deprecated) allowing to
gracefully remove features from the schema. The lifecycle of a feature can typically be represented as `stable`
-> `deprecated` -> `removed`.

In a lot of cases though, a feature lifecycle includes an experimental phase where it has just been added and can be
changed without warning. In this state, the feature is usable and feedback is encouraged but isn't considered stable
enough to be put in production. The feature lifecycle becomes `experimental` -> `stable` -> `deprecated` -> `removed` .

### Goals

The goal of this proposal is to support the `experimental` state and, moving forward, any state that requires the client
developer to make an explicit decision before using a given feature. In that sense, it's about "opting in" to using the
feature, which includes supporting `experimental` states.

To give a few examples:

* a field is experimental and might be changed or removed without prior notice (the above example).

* a field is expensive to compute and should be used with caution.

* a field has specific security requirements and requires a specific header or other form of authentication.

### Non-goals

This proposal is not about security and/or hiding parts of a schema. Its goal is to make it easier to communicate opt-in
features to client developer and therefore needs to expose that information.

## 👀 Prior work

* GitHub uses [schema previews](https://docs.github.com/en/graphql/overview/schema-previews) to opt-in new features.
* Kotlin has [OptIn requirements](https://kotlinlang.org/docs/opt-in-requirements.html) that started out
  as `@Experimental`
  before [being changed to `@OptIn`](https://youtrack.jetbrains.com/issue/KT-26216/Generalize-Experimental-API)
* Atlassian
  has [a `@beta` directive](https://developer.atlassian.com/platform/atlassian-graphql-api/graphql/#schema-changes) that
  is enforced during execution. A client must provide a `X-ExperimentalApi: $Feature` HTTP header or the request will
  fail.

## 🧑‍💻 Proposed solution

### The `@requiresOptIn` directive

It is proposed to add an `@requiresOptIn` directive to the specification:

```graphql
"""
Indicates that the given field, argument, input field or enum value requires
giving explicit consent before being used.
"""
directive @requiresOptIn(feature: String!) repeatable
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
    startInstant: Instant @requiresOptIn(feature: "experimentalInstantApi")
    endInstant: Instant @requiresOptIn(feature: "experimentalInstantApi")
}
```

### Introspection

> This section is a proposal based on the current introspection mechanism. A more global mechanism (
> see [#300](https://github.com/graphql/graphql-spec/issues/300)) would make it obsolete

`@requiresOptIn` features should be hidden from introspection by default and include if `includeRequiresOptIn` contains the
given feature:

```graphql
type __Type {
    kind: __TypeKind!
    name: String

    # [...] other fields omitted for clarity

    # includeRequiresOptIn is a list of features to include
    fields(includeDeprecated: Boolean = false, includeRequiresOptIn: [String!]): [__Field!]
}
```

Tools can get a list of `@requiresOptIn` features required to use a field (or input field, argument, enum value)
using `requiresOptIn`:

```graphql
type __Field {
    name: String!
    isDeprecated: Boolean!

    # [...] other fields omitted for clarity

    # list of @requiresOptIn features required to use this field
    requiresOptIn: [String!]
    args(includeDeprecated: Boolean = false, includeRequiresOptIn: [String!]): [__InputValue!]!
}
```

A given field is included in introspection results if all the conditions are satisfied. In pseudo code, if the following
condition is true:

```
includeRequiresOptIn.containsAll(field.requiresOptIn) && (includeDeprecated || !field.isDeprecated)
```

### Validation

Similarly to [deprecation](https://spec.graphql.org/draft/#sel-FAHnBZNCAACCwDqvK), the `@requiresOptIn` directive must
not appear on required (non-null without a default) arguments or input object field definitions.

In other words, `@requiresOptIn`  arguments or input fields, must be either nullable or have a default value.

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

The spec defines a directive named @requiresOptIn (and in doing so introduces the need to be able to apply directives to
directive definitions)

```graphql
directive @requiresOptIn on DIRECTIVE_DEFINITION
```

Services create a directive for each distinct opt-in feature they want in their schema:

```graphql
# optIn usage defines @experimentalDeploymentApi as an opt-in marker
directive @experimentalDeploymentApi on FIELD_DEFINITION @requiresOptIn

type Query {
    deployment: Deployment @experimentalDeploymentApi
}

enum WorkspaceKind {
    CROSS_PROJECT
    CROSS_COMPANY
}
directive @workspaces(kind: WorkspaceKind) on FIELD_DEFINITION @requiresOptIn

type Deployment {
    workspaces: [Workspace] @workspaces(kind: CROSS_COMPANY)
}
```

Pros:

* gives more control to the user about the directive used
* has more type information

Cons:

* more complex
* requires a grammar change

## 🪵 Decision Log

This proposal started out with a very simple premise and implementation, and has gotten more complex as
the community has explored edge cases and facets about how GraphQL is actually used in practice.

This decision log was written with newcomers in mind to avoid rediscussing issues that have already been hashed out,
and to make it easier to understand why certain decisions have been made. At the time of writing,
the decisions here aren't set in stone, so any future discussions can use this log as a starting point.

### directive name

Initially, the directive name was `@experimental` then `@optIn` to account for other use cases than just experimental
status before [settling on `@requiresOptIn`](https://github.com/graphql/graphql-wg/pull/1006#discussion_r889467023)
because it is both more explicit and leaves room for clients to use an `@optIn` directive.
