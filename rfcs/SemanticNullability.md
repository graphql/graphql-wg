# RFC: Semantic Nullability

# 📜 Problem History

One of GraphQL's early decisions was to allow "partial success"; this was a
critical feature for Facebook - if one part of their backend infrastructure
became degraded they wouldn't want to just render an error page, instead they
wanted to serve the user a page with as much working data as they could.

## Error propagation

To accomplish this, if an error occured within a resolver, the resolver's value
would be replaced with a `null`, and an error would be added to the `errors`
array in the response. GraphQL thus adopted the non-traditional stance of all
types being "nullable by default" (since an error could happen anywhere at any
time for any reason).

However, null-checking is exhausting and in some positions errors are extremely
unlikely (and null is not an expected value according to the business logic) so
GraphQL allowed a position to be marked non-nullable by following the type with
a `!` marker - this would guarantee that that position in the data could not
contain a `null`.

What if a non-null field were to throw an error, or incorrectly return `null`,
then? To solve that apparent contradiction, GraphQL introduced the "error
propagation" behavior (also known colloquially as "null bubbling") - when a
`null` (from an error or otherwise) occurs in a non-nullable position, the
parent position (either a field or a list item) is made `null` instead. This
behavior would repeat if the parent position was also non-nullable, and this
could propagate (or "bubble") all the way up to the root of the operation if
everything in the path is non-nullable.

Thus the `!` non-null marker has also been known as "kills parent on exception"
due to this destructive error propagation behavior.

This solved the issue, and meant that GraphQL's nullability promises were still
honoured; but it wasn't without complications.

### Complication 1: partial success

We want to be resilient to systems failing; but errors that occur in
non-nullable positions cascade to surrounding parts of the query, making less
and less data available to be rendered.

This seems contrary to our "partial success" aim, but it's easy to solve - we
just make sure that the positions where we expect errors to occur are nullable
so that errors don't propagate further. Clients now need to handle `null` in
these positions.

### Complication 2: nullable epidemic

Almost any field in your GraphQL schema could raise an error - errors might not
only be caused by backend services becoming unavailable or responding in
unexpected ways; they can also be caused by simple programming errors in your
business logic, data consistency errors (e.g. expecting a boolean but receiving
a float), or any other cause.

Since we don't want to "blow up" the entire response if any such issue occurred,
we've moved to strongly encourage nullable usage throughout a schema, only
adding the non-nullable `!` marker to positions where we're truly sure that
field is extremely unlikely to error. This has the effect of meaning that
developers consuming the GraphQL API have to handle potential nulls in more
positions than they would expect, making for additional work.

### Complication 3: normalized caching

Many modern GraphQL clients use a "normalized" cache, such that updates pulled
down from the API in one query can automatically update all the previously
rendered data across the application. This helps ensure consistency for users,
and is a powerful feature.

However, if an error occurs in a non-nullable position, it's
[no longer safe](https://github.com/graphql/nullability-wg/issues/20) to store
the data to the normalized cache. Again, the solution is to make more of your
schema nullable.

## The Nullability Working Group

At first, we thought the solution to this was to give clients control over the
nullability of a response, so we set up the Client-Controlled Nullability (CCN)
Working Group. Later, we renamed the working group to the Nullability WG to show
that it encompassed all potential solutions to this problem.

### Client-controlled nullability

The first Nullability WG proposal came from a collaboration between Yelp and
Netflix, with contributions from GraphQL WG regulars Alex Reilly, Mark Larah,
and Stephen Spalding among others. They proposed we could adorn the queries we
issue to the server with sigils indicating our desired nullability overrides for
the given fields - client-controlled nullability.

A `?` would be added to fields where we don't mind if they're null, but we
definitely want errors to stop there; and add a `!` to fields where we
definitely don't want a null to occur (whether or not there is an error). This
would give consumers control over where errors/nulls were handled.

However, after much exploration of the topic over years we found numerous issues
that traded one set of concerns for another. We kept iterating whilst we looked
for a solution to these tradeoffs.

### True nullability schema

Jordan Eldredge
[proposed](https://github.com/graphql/nullability-wg/discussions/22) that making
fields nullable to handle error propagation was hiding the "true" nullability of
the data. Instead, he suggested, we should have the schema represent the true
nullability, and put the responsibility on clients to use the `?` CCN operator
to handle errors in the relevant places.

However, this would mean that clients such as Relay would want to add `?` in
every position, causing an "explosion" of question marks, because really what
Relay desired was to disable null propagation entirely.

## Semantic nullability

What we ultimately realised is that GraphQL is missing a type.

Ignoring errors, if we look at our business logic we can determine if a field is
either _semantically nullable_ (it's meaningful for this field to be null - for
example an `Animal` might not have an `owner` currently) or _semantically
non-nullable_ (this field will never be null - for example every `Post` must
belong to a `topic`). However GraphQL muddied the waters here by factoring
errors into the mix... "what if the "topics" service went down?" it would ask;
"we might want to render the post!" And thus, we would make `Post.topic`
nullable, even though we know it _should_ always exist, because we don't want
error propagation to destroy the entire response.

So we actually have three types:

|                           | Value | Error | null |
| ------------------------- | ----- | ----- | ---- |
| Semantically nullable     | ✅    | ✅    | ✅   |
| Semantically non-nullable | ✅    | ✅    | ❌   |
| Strictly non-nullable     | ✅    | ❌    | ❌   |

We could already express a position that could never error and never be null (we
called this non-nullable, e.g. `Int!`), and we could express a position that
could be null or have an error (we called this nullable, e.g. `Int`), but what
we lacked was the ability to say "this position can be null, but that will only
happen if an error has occurred" - a "null only on error" or "semantically
non-null" type.

# 📜 Problem Statement

GraphQL needs to be able to represent semantically nullable and semantically
non-nullable types as such whilst allowing errors to occur in either position,
without triggering error propagation.

# 📋 Solution Criteria

This section sketches out the potential goals that a solution might attempt to
fulfill. These goals will be evaluated with the
[GraphQL Spec Guiding Principles](https://github.com/graphql/graphql-spec/blob/main/CONTRIBUTING.md#guiding-principles)
in mind:

- Backwards compatibility
- Performance is a feature
- Favor no change
- Enable new capabilities motivated by real use cases
- Simplicity and consistency over expressiveness and terseness
- Preserve option value
- Understandability is just as important as correctness

Each criteria is identified with a `Letter` so they can be referenced in the
rest of the document. New criteria must be added to the end of the list.

Solutions are evaluated and scored using a simple 3 part scale. A solution may
have multiple evaluations based on variations present in the solution.

- ✅ **Pass.** The solution clearly meets the criteria
- ⚠️ **Warning.** The solution doesn't clearly meet or fail the criteria, or
  there is an important caveat to passing the criteria
- 🚫 **Fail.** The solution clearly fails the criteria
- ❔ The criteria hasn't been evaluated yet

Passing or failing a specific criteria is NOT the final word. Both the Criteria
_and_ the Solutions are up for debate.

Criteria have been given a "score" according to their relative importance in
solving the problem laid out in this RFC while adhering to the GraphQL Spec
Guiding Principles. The scores are:

- 🥇 Gold - A must-have
- 🥈 Silver - A nice-to-have
- 🥉 Bronze - Not necessary

## 🎯 A. GraphQL should be able to indicate which positions will only be null if an error occurred

The promise of this RFC - the reflection of the semantic nullability of the
fields.

| [1][solution-1] | [2][solution-2] | [3][solution-3] | [4][solution-4] | [5][solution-5] |
|-----------------|-----------------|-----------------|-----------------|-----------------|
| ✅               | ✅               | ✅               | ✅               | ✅               |

Criteria score: 🥇

## 🎯 B. Existing executable documents should retain validity and meaning

Users should be able to adopt semantic nullability into an existing schema, and
when doing so all existing operations should remain valid, and should have the
same meaning as they always did.

| [1][solution-1] | [2][solution-2] | [3][solution-3] | [4][solution-4] | [5][solution-5] |
|-----------------|-----------------|-----------------|-----------------|-----------------|
| ✅               | 🚫              | ✅               | ✅               | ✅               |

Criteria score: 🥇

## 🎯 C. Existing meanings should be retained

GraphQL has been public for 10 years and there's a lot of content out there
noting that GraphQL types are nullable by default (unadorned type is nullable)
and that `!` means non-nullable. Our changes should not invalidate this content.

| [1][solution-1] | [2][solution-2] | [3][solution-3] | [4][solution-4] | [5][solution-5] |
|-----------------|-----------------|-----------------|-----------------|-----------------|
| ✅               | 🚫              | ✅               | 🚫              | ✅               |

Criteria score: 🥈

## 🎯 D. Syntax should be obvious to programmers

The GraphQL languages similarity to JSON is one of its strengths, making it
immediately feel familiar. Syntax used should feel obvious to developers new to
GraphQL.

| [1][solution-1] | [2][solution-2] | [3][solution-3] | [4][solution-4] | [5][solution-5] |
|-----------------|-----------------|-----------------|-----------------|-----------------|
| 🚫              | ✅               | ✅               | ✅              | ⚠️               |

Criteria score: 🥈

## 🎯 E. Syntax used in SDL and in executable documents should be consistent with SDL

When a user wishes to replace the value for an input field or argument with a
variable in their GraphQL operation, the type syntax should be either identical
or similar, and should carry the same meaning.

| [1][solution-1] | [2][solution-2] | [3][solution-3] | [4][solution-4] | [5][solution-5] |
|-----------------|-----------------|-----------------|-----------------|-----------------|
| ✅               | ✅               | ✅               | 🚫              | ✅               |

Criteria score: 🥇

## 🎯 F. Alternative syntaxes should not cause confusion

Where a proposal allows alternative syntaxes to be used, the two syntaxes should
not cause confusion.

| [1][solution-1] | [2][solution-2] | [3][solution-3] | [4][solution-4] | [5][solution-5] |
|-----------------|-----------------|-----------------|-----------------|-----------------|
| ✅               | ✅               | ✅               | 🚫              | ✅               |

Criteria score: 🥇

<!--

Template for new items:

## 🎯 X. Title

DESCRIPTION

| [1][solution-1] | [2][solution-2] | [3][solution-3] | [4][solution-4] | [5][solution-5] |
| --------------- | --------------- | --------------- | --------------- |-----------------|
| ?               | ?               | ?               | ?               | ?               |

Criteria score: ❔

-->

# 🚧 Possible Solutions

The community has imagined a variety of possible solutions, synthesized here.

Each solution is identified with a `Number` so they can be referenced in the
rest of the document. New solutions must be added to the end of the list.

## 💡 1. New "Semantic Non-Null" type, represented by `*`

**Champion**: @benjie

- Spec edits: https://github.com/graphql/graphql-spec/pull/1065
- GraphQL.js implementation: https://github.com/graphql/graphql-js/pull/4192
- Additional tools:
  - [GraphQL-TOE](https://www.npmjs.com/package/graphql-toe) - throw on error
    when reading from an errored field
  - [GraphQL-SOCK](https://www.npmjs.com/package/graphql-sock) - Semantic Output
    Conversion Kit - takes a schema involving semanantic non-null type and
    converts it to a schema using traditional syntax (respecting the client's
    error handling behaviors) for compatibility with existing (semantic non-null
    unaware) tooling

This proposal introduces a new Semantic Non-Null type using a prefix or postfix
symbol (currently `*` postfix) to indicate a field that will be null only on
error. Existing types and operations are unaffected, and usage can be migrated
on a per-type-position basis. Moving from a nullable type to a semantic
non-nullable type (on output) is a non-breaking change. Semantic non-nullable is
meaningless on input.

```graphql
type Post {
  # Every post belongs to a topic, however don't blow the post up if retrieval of the topic fails.
  topic: Topic*
}
```

Querying a semantic non-null field is the same as querying any other field.

|                           | Existing syntax | Proposed syntax |
| ------------------------- | --------------- | --------------- |
| Semantically nullable     | `Int`           | `Int`           |
| Semantically non-nullable | -               | `Int*`          |
| Strictly non-nullable     | `Int!`          | `Int!`          |

### 🎲 Variations

Various
[options for the syntax](https://gist.github.com/benjie/19d784721d1658b89fd8954e7ee07034)
have been discussed the choice of symbol comes down mostly to aesthetics.

### ⚖️ Evaluation

- [A][criteria-a]
  - ✅
- [B][criteria-b]
  - ✅ Existing symbology unchanged.
- [C][criteria-c]
  - ✅ Existing symbology unchanged.
- [D][criteria-d]
  - 🚫 `Int*` syntax is not immediately obvious.
- [E][criteria-e]
  - ✅ Same syntax.
- [F][criteria-f]
  - ✅ Same syntax.

## 💡 2. "Strict Semantic Nullability"

**Champion**: @leebyron

- Discussion: https://github.com/graphql/graphql-wg/discussions/1410

This proposal introduces a `@strictNullability` directive on the schema. Types
in schemas using this directive would now be semantically non-nullable by
default, and a new semantically nullable type is introduced (using the `?`
symbol) to indicate that a position may semantically be null.

|                           | Existing syntax | Proposed syntax |
| ------------------------- | --------------- | --------------- |
| Semantically nullable     | `Int`           | `Int?`          |
| Semantically non-nullable | -               | `Int`           |
| Strictly non-nullable     | `Int!`          | `Int!`          |

### ⚖️ Evaluation

- [A][criteria-a]
  - ✅
- [B][criteria-b]
  - 🚫 Though existing documents remain _valid_, input variables using the
    unadorned type now mean "semantically non-nullable" and will no longer
    accept `null` values? {Confirmation by Lee pending.}
- [C][criteria-c]
  - 🚫 GraphQL is no longer "nullable by default", and `Int` no longer
    represents a nullable integer.
- [D][criteria-d]
  - ✅ `Int?` is commonly used to indicate nullablility in programming languages
    and `Int!` indicating non-nullable or danger is common. `Int` is less
    obvious when `?` and `!` variants exist.
- [E][criteria-e]
  - ✅ The same syntax is used on input and output.
- [F][criteria-f]
  - ✅ There is no alternative syntax.

## 💡 3. New "Semantic Non-Null" type, usurping `!` syntax

**Champion**: @benjie

This proposal is similar to proposal 1, but:

1. It introduces a document-level directive, `@semanticNullability`, which when
   present on a document allows the `!` suffix to be used to represent
   semantically non-nullable types, and a new `!!` suffix to be used to
   represent strictly non-nullable types:

|                           | Syntax without directive | Syntax with directive |
| ------------------------- | ------------------------ | --------------------- |
| Semantically nullable     | `Int`                    | `Int`                 |
| Semantically non-nullable | -                        | `Int!`                |
| Strictly non-nullable     | `Int!`                   | `Int!!`               |

As such all documents (both SDL and executable documents) retain their current
meaning, and the semantically non-null type can be adopted on a per-document
basis.

2. It allows using semantically non-nullable types in input positions, allowing
   the `Int!` syntax to simply mean "non-nullable" on input.

Since there's no difference between whether a type is "semantically" or
"strictly" non-nullable on input (input does not represent errors), executable
documents will retain their existing syntax in perpetuity and never need to use
this new directive - it's only used in the SDL.

Further, it's proposed that the SDL production responsibility be pushed to the
client framework (Relay, Apollo, URQL, etc), which can reflect their own SDL for
the schema that honours their error behavior (e.g. throw on error), null
handling, and any client-local modifications (e.g. additional client-side
fields/types). This client-produced SDL can use the traditional syntax and
should be used by tooling such as code generation - this further limits the
`@semanticNullability` directive to only be used by schema and tooling authors,
meaning the vast majority of GraphQL consumers do not need to see it in their
day-to-day work.

### ⚖️ Evaluation

- [A][criteria-a]
  - ✅
- [B][criteria-b]
  - ✅ Executable documents are not impacted by this proposal.
- [C][criteria-c]
  - ✅ `Int` means nullable, and `Int!` means non-nullable, still.
- [D][criteria-d]
  - ✅ `Int!` to indicate non-nullable is common in programming languages; and
    `Int!!` looks like it indicates "danger".
- [E][criteria-e]
  - ✅ Executable documents do not use `!!`, and `!` means non-nullable on both
    input and output (the difference between semantic an strict non-null does
    not occur on input)
- [F][criteria-f]
  - ✅ `Int` reatains its meaning across both modes, and `Int!` means
    non-nullable in both modes. Only the SDL ever uses `Int!!` and it still
    means non-null, just with the additional "kills parent on exception"
    behavior.

## 💡 4. New "Semantic Non-Null" type, with `?` used for nullable types

**Champion**: @twof

This proposal builds on solution 3, but with a syntactic shuffle such that the
unadorned type may be used as the semantically non-nullable type when the
directive is present, and a `?` symbol is used to indicate a nullable position.

|                           | Syntax without directive | Syntax with directive |
| ------------------------- | ------------------------ | --------------------- |
| Semantically nullable     | `Int`                    | `Int?`                |
| Semantically non-nullable | -                        | `Int`                 |
| Strictly non-nullable     | `Int!`                   | `Int!`                |

### ⚖️ Evaluation

- [A][criteria-a]
  - ✅
- [B][criteria-b]
  - ✅ Existing documents don't use the directive, and thus are not impacted.
- [C][criteria-c]
  - 🚫 With the directive present, GraphQL is no longer "nullable by default",
    and `Int` no longer represents a nullable integer.
- [D][criteria-d]
  - ✅ `Int?` is commonly used to indicate nullablility in programming languages
    and `Int!` indicating non-nullable or danger is common. `Int` is less
    obvious when `?` and `!` variants exist.
- [E][criteria-e]
  - 🚫 If the schema uses `@semanticNullability` but an operation document does
    not, `Int` has vastly different meanings: nullable on input but non-nullable
    on output.
- [F][criteria-f]
  - 🚫 `Int` being nullable in one mode and non-nullable in the other mode is
    unexpected and will likely lead to confusion.

## 💡 5. Use non-null in semantically non-nullable places and encourage disabling error propagation

**Champion**: @martinbonnin

- Discussion: https://github.com/graphql/nullability-wg/discussions/85

This proposal relies on the ability of clients to opt out of error propagation; instead of introducing a new type it instructs schema authors to optimize for error-handling clients and use the traditional non-null type (`!`) on all semantically non-null fields.

### ⚖️ Evaluation

- [A][criteria-a]
  - ✅
- [B][criteria-b]
  - ✅ The default `@onError` action is `PROPAGATE`, making sure existing documents are not impacted.
- [C][criteria-c]
  - ✅ `Int` means nullable, and `Int!` means non-nullable, still.
- [D][criteria-d]
  - ⚠️ Adding `@onError` to operations is not immediately intuitive but most error-handling clients should add it automatically, making it transparent to end users. 
- [E][criteria-e]
  - ✅ Same syntax.
- [F][criteria-f]
  - ✅ Same syntax.
