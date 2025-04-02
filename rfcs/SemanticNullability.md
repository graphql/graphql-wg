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
Relay desired was to disable error propagation entirely.

## Disabling error propagation

It became clear that disabling error propagation was desired by advanced GraphQL
clients and vital for ensuring that normalized caches were as useful as possible
and that we could live up to the promise of GraphQL's partial success without
compromise. But that was only part of the problem - the other part was that we
want to see the "true" nullability of fields, the nullability if we were to
exclude errors.

Note: this RFC assumes that clients may opt out of error propagation via some
mechanism that is outside the scope of this RFC and will be handled in a
separate RFC (e.g. via a directive such as `@noErrorPropagation` or
`@behavior(onError: NULL)`; or via a request-level flag) - in general the
specific mechanism is unimportant and thus solutions are not expected to comment
on it unless the choice is significant to the proposal.

### Semantic nullability

We realised that if we were to do this, we would need two schemas: one for when
null bubbling is disabled, where the true nullability of fields could be
represented; and one for the traditional error handling behavior, where
nullability would need to factor in that errors can occur.

However, maintaining two nearly-identical-except-for-nullability schemas is a
chore... and it felt like it was solveable if we could teach GraphQL to
understand this need... What we ultimately realised is that GraphQL is missing a
type.

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
non-nullable types as such when error propagation is disabled.

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

## 🎯 A. GraphQL should be able to indicate which nullable fields should become non-nullable when error propagation is disabled

[criteria-a]: #-a-graphql-should-be-able-to-indicate-which-nullable-fields-should-become-non-nullable-when-error-propagation-is-disabled

The promise of this RFC - the reflection of the semantic nullability of the
fields without compromising requests with error propagation enabled via the
differentiation of a "null if and only if an error occurs" type.

With error propagation enabled (the traditional GraphQL behavior), it's
recommended that fields are marked nullable if errors may happen there, even if
the underlying value is semantically non-nullable. If we allow error-handling
clients to disable error propagation, then these traditionally nullable
positions can be marked (semantically) non-nullable in that mode, since with
error propagation disabled the selection sets are no longer destroyed.

Note: Traditional non-nullable types will effectively become semantically
non-nullable when error propagation is disabled no matter which solution is
chosen, so this criteria is only concerned with traditionally nullable types.

| [1][solution-1] | [2][solution-2] | [3][solution-3] | [4][solution-4] | [5][solution-5] | [6][solution-6] | [7][solution-7] |
|-----------------|-----------------|-----------------|-----------------|-----------------|-----------------|-----------------|
| ✅               | ✅               | ✅               | ✅               | 🚫👍            | ✅               | ✅               |

Criteria score: 🥈

## 🎯 B. Existing executable documents should retain validity and meaning

[criteria-b]: #-b-existing-executable-documents-should-retain-validity-and-meaning

Users should be able to adopt semantic nullability into an existing schema, and
when doing so all existing operations should remain valid, and should have the
same meaning as they always did.

| [1][solution-1] | [2][solution-2] | [3][solution-3] | [4][solution-4] | [5][solution-5] | [6][solution-6] | [7][solution-7] |
|-----------------|-----------------|-----------------|-----------------|-----------------|-----------------|-----------------|
| ✅               | 🚫              | ✅               | ✅               | ✅               | ✅               | ✅               |

Criteria score: 🥈

## 🎯 C. Unadorned type should mean nullable

[criteria-c]: #-c-unadorned-type-should-mean-nullable

GraphQL has been public for 10 years and there's a lot of content out there
noting that GraphQL types are nullable by default (unadorned type is nullable)
and our changes should not invalidate this content.

| [1][solution-1] | [2][solution-2] | [3][solution-3] | [4][solution-4] | [5][solution-5] | [6][solution-6] | [7][solution-7] |
|-----------------|-----------------|-----------------|-----------------|-----------------|-----------------|-----------------|
| ✅               | 🚫              | ✅               | 🚫              | ✅               | ✅               | ✅               |

Criteria score: 🥉

## 🎯 D. Syntax should be obvious to programmers

[criteria-d]: #-d-syntax-should-be-obvious-to-programmers

The GraphQL languages similarity to JSON is one of its strengths, making it
immediately feel familiar. Syntax used should feel obvious to developers new to
GraphQL.

| [1][solution-1] | [2][solution-2] | [3][solution-3] | [4][solution-4] | [5][solution-5] | [6][solution-6] | [7][solution-7] |
|-----------------|-----------------|-----------------|-----------------|-----------------|-----------------|-------------|
| 🚫              | ✅               | ✅               | ✅              | ⚠️               | ✅          | ✅            |

Criteria score: 🥇

## 🎯 E. Syntax used in SDL and in executable documents should be consistent with SDL

[criteria-e]: #-e-syntax-used-in-sdl-and-in-executable-documents-should-be-consistent-with-sdl

When a user wishes to replace the value for an input field or argument with a
variable in their GraphQL operation, the type syntax should be either identical
or similar, and should carry the same meaning.

| [1][solution-1] | [2][solution-2] | [3][solution-3] | [4][solution-4] | [5][solution-5] | [6][solution-6] | [7][solution-7] |
|-----------------|-----------------|-----------------|-----------------|-----------------|-----------------|--------------|
| ✅               | ✅               | ✅               | 🚫              | ✅               | ✅          | ✅             |

Criteria score: 🥇

## 🎯 F. Alternative syntaxes should not cause confusion

[criteria-f]: #-f-alternative-syntaxes-should-not-cause-confusion

Where a proposal allows alternative syntaxes to be used, the two syntaxes should
not cause confusion.

| [1][solution-1] | [2][solution-2] | [3][solution-3] | [4][solution-4] | [5][solution-5] | [6][solution-6] | [7][solution-7] |
|-----------------|-----------------|-----------------|-----------------|-----------------|-----------------|--------------|
| ✅               | ✅               | ✅               | 🚫              | ✅               | ✅          | ✅             |

Criteria score: 🥇

## 🎯 G. Error propagation boundaries should not change in existing executable documents

[criteria-g]: #-g-error-propagation-boundaries-should-not-change-in-existing-executable-documents

An expansion of B, this states that the proposal will not change where errors
propagate to when error propagation is enabled (i.e. existing documents will
still keep errors local to the same positions that they did when they were
published), allowing for the "partial success" feature of GraphQL to continue to
shine and not compromising the resiliency of legacy deployed app versions.

| [1][solution-1] | [2][solution-2] | [3][solution-3] | [4][solution-4] | [5][solution-5] | [6][solution-6] | [7][solution-7] |
| --------------- | --------------- | --------------- | --------------- |-----------------|-----------------|-------------|
| ✅              | ✅              | ✅              | ✅              | 🚫              | ✅          | ⚠️            |

Criteria score: 🥈

* ✂️ Objection: proposal to lower the score to 🥈. With enough advance notice and a clear upgrade
path for legacy apps, the tradeoff might be acceptable.

## 🎯 H. Implementation and spec simplicity

[criteria-h]: #-h-implementation-and-spec-simplicity

The implementation required to make the proposal work should be simple.

| [1][solution-1] | [2][solution-2] | [3][solution-3] | [4][solution-4] | [5][solution-5] | [6][solution-6] | [7][solution-7] |
| --------------- | --------------- | --------------- | --------------- |-----------------|-----------------|--------------|
| ✅              | 🚫              | 🚫              | 🚫              | ✅             | ✅          | ✅            |

Criteria score: 🥇

## 🎯 I. Syntax used in executable documents should be unchanged

[criteria-i]: #-i-syntax-used-in-executable-documents-should-be-unchanged

Executable documents do not differentiate between semantic and strict non-null
since inputs never handle "errors" ("null only on error" is the same as "not
null" on input). As such, there's no benefit to clients for the syntax of
executable documents to change.

| [1][solution-1] | [2][solution-2] | [3][solution-3] | [4][solution-4] | [5][solution-5] | [6][solution-6] | [7][solution-7] |
|-----------------|-----------------|-----------------|-----------------|-----------------|-----------------|-------------|
| ✅               | ❔              | ✅               | 🚫               | ✅               | ✅          | ✅            |

Criteria score: 🥈

## 🎯 J. Type reasoning should remain local

[criteria-j]: #-j-type-reasoning-should-remain-local

The type of a field (`foo: Int`) can be determined by looking at the field and
its type; the reader should not have to read a document or schema directive to
determine how the type should be interpreted.

| [1][solution-1] | [2][solution-2] | [3][solution-3] | [4][solution-4] | [5][solution-5] | [6][solution-6] | [7][solution-7] |
|-----------------|-----------------|-----------------|-----------------|-----------------|-----------------|-------------|
| ✅               | ❔              | ⚠️               | 🚫               | ✅               | ⚠️          | ✅            |

Criteria score: 🥇

## 🎯 K. Introspection must be backwards compatible

[criteria-k]: #-k-introspection-must-be-backwards-compatible

We do not want to break existing tooling.

| [1][solution-1] | [2][solution-2] | [3][solution-3] | [4][solution-4] | [5][solution-5] | [6][solution-6] | [7][solution-7] |
|-----------------|-----------------|-----------------|-----------------|-----------------|-----------------|-------------|
| ✅               | ❔              | ✅               | ❔               | ✅               | ✅          | ⚠️            |

Criteria score: 🥈

## 🎯 L. General GraphQL consumers should only need to think about nullable vs non-nullable

[criteria-l]: #-l-general-graphql-consumers-should-only-need-to-think-about-nullable-vs-non-nullable

Schema authors and client frameworks can handle different types of nullability based around
error handling and error propagation, but consumers (frontend developers) should only need
to deal with nullable or non-nullable as presented to them by their client framework of choice.

May contradict: M

| [1][solution-1] | [2][solution-2] | [3][solution-3] | [4][solution-4] | [5][solution-5] | [6][solution-6] | [7][solution-7] |
|-----------------|-----------------|-----------------|-----------------|-----------------|-----------------|--------------|
| ✅               | ❔              | ✅               | ❔               | ✅               | ⚠️          | ✅             |

Criteria score: 🥈

## 🎯 M. The SDL should have exactly one form used by all producers and consumers

[criteria-m]: #-m-the-sdl-should-have-exactly-one-form-used-by-all-producers-and-consumers

The SDL should not be influenced by client features such as local extensions and
error propagation mechanics, and should always represent the true full source
schema SDL.

May contradict: L

| [1][solution-1] | [2][solution-2] | [3][solution-3] | [4][solution-4] | [5][solution-5] | [6][solution-6] | [7][solution-7] |
|-----------------|-----------------|-----------------|-----------------|-----------------|-----------------|-------------|
| ⚠️               | ❔              | ⚠️               | ❔               | ✅               | ✅          | ✅            |

Criteria score: 🥇

## 🎯 N. The solution should add value even with error propagation enabled

[criteria-n]: #-n-the-solution-should-add-value-even-with-error-propagation-enabled

Even when error propagation is enabled, it's valuable to be able to tell the
difference between a field that is truly (semantically) nullable, and one
that's only nullable because errors may occur. GraphQL-TOE can be used in such
situations so that codegen can safely use non-nullable types in semantically
non-nullable positions.

| [1][solution-1] | [2][solution-2] | [3][solution-3] | [4][solution-4] | [5][solution-5] | [6][solution-6] | [7][solution-7] |
|-----------------|-----------------|-----------------|-----------------|-----------------|-----------------|-------------|
| ✅               | ✅              | ✅               | ✅               | 🚫               | ✅          | ✅            |

Criteria score: 🥉

## 🎯 O. Should not have breaking changes for existing executable documents

[criteria-o]: #-o-should-not-have-breaking-changes-for-existing-executable-documents

It should be possible to enable the solution without negatively impacting
existing deployed clients.

Per Lee:

> A breaking change is a client observable change in behavior. The decade old
> GraphQL query should work in the same way as it always has.  (We sometimes
> allow inconsequential changes in behavior, but bubbling the error up isn't
> inconsequential.)

| [1][solution-1] | [2][solution-2] | [3][solution-3] | [4][solution-4] | [5][solution-5] | [6][solution-6] | [7][solution-7] |
|-----------------|-----------------|-----------------|-----------------|-----------------|-----------------|-------------|
| ✅               | ❔              | ✅               | ✅               | 🚫               | ✅          | ✅            |


Note: though this criteria is currently not considered due to overlap with B
and G, it acts as a reminder to look for other forms of breaking change, and
helps to reason _why_ B and G are important.

Criteria score: X (not considered - covered by B and G)


## 🎯 P. The solution should result in users marking all semantically non-null fields as such

[criteria-p]: #-p-the-solution-should-result-in-users-marking-all-semantically-non-null-fields-as-such

When a field returns data that the business logic dictates does not and will
never return a legitimate (non-error) null, the schema authors should have no
hesitation over marking it as semantically non-nullable - and thus all
semantically non-nullable fields should be marked as such.

Per Benoit:

> Not sure how to express it well, but I feel there should be a criteria to
> mean something like “the solution encourages that eventually most fields in
> most schemas are semantically non null”. As a client developer that’s kind of
> an outcome of this whole effort I’d like to see happening.


| [1][solution-1] | [2][solution-2] | [3][solution-3] | [4][solution-4] | [5][solution-5] | [6][solution-6] | [7][solution-7] |
|-----------------|-----------------|-----------------|-----------------|-----------------|-----------------|-------------|
| ✅               | ✅              | ✅               | ✅               | 🚫               | ⚠️           | ✅            |

Criteria score: 🥇

## 🎯 Q. Migrating the unadorned output type to other forms of nullability should be non-breaking

[criteria-q]: #-q-migrating-the-unadorned-output-type-to-other-forms-of-nullability-should-be-non-breaking

The default (unadorned) type should be a type that you can migrate away from,
once nullability expectations become more concrete, without breaking existing
client queries.

| [1][solution-1] | [2][solution-2] | [3][solution-3] | [4][solution-4] | [5][solution-5] | [6][solution-6] | [7][solution-7] |
|-----------------|-----------------|-----------------|-----------------|-----------------|-----------------|-------------|
| ✅               | 🚫              | ✅               | 🚫               | ✅               | ✅          | ✅            |

Note: this is not necessarily a duplicate of C as it doesn't specifically
require the unadorned type be nullable, however no proposal currently proposes
a mechanism for moving from any non-nullable type to a nullable type in a
non-breaking way, and thus this criteria is _currently_ discounted.

Criteria score: X (not considered)

## 🎯 R. Semantic nullability should only impact outputs, not inputs

[criteria-r]: #-r-semantic-nullability-should-only-impact-outputs-not-inputs

There's no meaningful difference between semantic non-null and strict non-null
on input, since inputs do not handle errors (and thus "null only on error"
describes a situation that cannot occur).

Inputs include: field arguments, directive arguments, and input fields.

As such:

- the syntax used to represent input nullability in SDL (`Int` = nullable, and
`Int!` = non-nullable) should be unchanged
- the representation in introspection for inputs (namely the `NON_NULL` type
wrapper) should be unchanged

| [1][solution-1] | [2][solution-2] | [3][solution-3] | [4][solution-4] | [5][solution-5] | [6][solution-6] | [7][solution-7] |
|-----------------|-----------------|-----------------|-----------------|-----------------|-----------------|-------------|
| ✅               | ❔              | ✅               | 🚫               | ✅               | ✅          | ✅            |

Criteria score: 🥈

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

Some of the solutions have been ruled out and are kept here for historical 
reasons. Those solutions are folded in a `<details>` tag.

Semantic nullability is only relevant to output positions, so when comparing
syntax we will look for changes versus the current syntax used to represent
these types:

|                           | Input syntax | Output syntax |
| ------------------------- | ------------ | ------------- |
| Semantically nullable     | `Int`        | `Int`         |
| Semantically non-nullable | -            | `Int`         |
| Strictly non-nullable     | `Int!`       | `Int!`        |


## 💡 1. New "Semantic Non-Null" type, represented by `*`

[solution-1]: #-1-new-semantic-non-null-type-represented-by-

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

|                           | Input syntax    | Output syntax       |
| ------------------------- | --------------- | ------------------- |
| Semantically nullable     | `Int`           | `Int`               |
| Semantically non-nullable | -               | `Int` &rArr; `Int*` |
| Strictly non-nullable     | `Int!`          | `Int!`              |

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
- [G][criteria-g]
  - ✅ Error capture positions unchanged when error propagation enabled
- [H][criteria-h]
  - ✅ Implementation and spec simplicity.
- [I][criteria-i]
  - ✅ `*` doesn't apply on input, so syntax is unchanged.
- [J][criteria-j]
  - ✅ Local syntax only
- [K][criteria-k]
  - ✅ Introspection backwards compatible via `__Field.type(includeSemanticNonNull: Boolean! = false)`
- [L][criteria-l]
  - ✅ Proposal encourages consumers to use client-produced SDL which only uses traditional nullability (`Type`/`Type!`)
- [M][criteria-m]
  - ⚠️ You can use the same SDL everywhere, but that's not what this solution
    encourages.
- [N][criteria-n]
  - ✅ Indicates semantically non-null and strictly non-null types separately
- [O][criteria-o]
  - ✅ Client syntax unchanged
- [P][criteria-p]
  - ✅ There are no drawbacks to adding semantically non-nullable fields
- [Q][criteria-q]
  - ✅
- [R][criteria-r]
  - ✅ `*` only needed in output positions, input positions unchanged

## 💡 2. "Strict Semantic Nullability"

<details>

<summary>Rejected - click for details</summary>

[solution-2]: #-2-strict-semantic-nullability

**Champion**: @leebyron

- Discussion: https://github.com/graphql/graphql-wg/discussions/1410

This proposal introduces a `@strictNullability` directive on the schema. Types
in schemas using this directive would now be semantically non-nullable by
default, and a new semantically nullable type is introduced (using the `?`
symbol) to indicate that a position may semantically be null.

|                           | Input syntax         | Output syntax       |
| ------------------------- | -------------------- | ------------------- |
| Semantically nullable     | `Int` &rArr; ???     | `Int` &rArr; `Int?` |
| Semantically non-nullable | -                    | `Int`               |
| Strictly non-nullable     | `Int!` &rArr; ???    | `Int!`              |

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
- [G][criteria-g]
  - ✅ Error capture positions unchanged when error propagation enabled
- [H][criteria-h]
  - 🚫 Implementation and spec simplicity.
- [I][criteria-i]
  - ❔
- [J][criteria-j]
  - ❔
- [K][criteria-k]
  - ❔
- [L][criteria-l]
  - ❔
- [M][criteria-m]
  - ❔
- [N][criteria-n]
  - ✅ Indicates semantically non-null and strictly non-null types separately
- [O][criteria-o]
  - ❔
- [P][criteria-p]
  - ❔
- [Q][criteria-q]
  - 🚫 `Int` &rarr; `Int?` is breaking
- [R][criteria-r]
  - ❔

</details>

## 💡 3. New "Semantic Non-Null" type, usurping `!` syntax

<details>

<summary>Rejected - click for details</summary>

[solution-3]: #-3-new-semantic-non-null-type-usurping--syntax

**Champion**: @benjie

This proposal is similar to proposal 1, but:

It introduces a document-level directive, `@semanticNullability`, which when
present on a document allows the `!` suffix to be used to represent
semantically non-nullable output types, and a new `!!` suffix to be used to
represent strictly non-nullable output types.

The `Int!` syntax simply means "non-nullable" on input, as it always has.
(Note: input types are always either semantically nullable or strictly
non-nullable.)

Syntax only changes when `@semanticNullability` directive is present:

|                           | Input syntax | Output syntax         |
| ------------------------- | ------------ | --------------------- |
| Semantically nullable     | `Int`        | `Int`                 |
| Semantically non-nullable | -            | `Int` &rArr; `Int!`   |
| Strictly non-nullable     | `Int!`       | `Int!` &rArr; `Int!!` |

All documents (both SDL and executable documents) retain their current meaning,
and the semantically non-null type can be adopted in output positions on a
per-document basis by adding the document directive.

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
  - ✅ `Int` means nullable still.
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
- [G][criteria-g]
  - ✅ Error capture positions unchanged when error propagation enabled
- [H][criteria-h]
  - 🚫 Implementation and spec simplicity.
- [I][criteria-i]
  - ✅ Semantic non-null not relevant to inputs, so no reason to use directive in executable documents -> syntax unchanged.
- [J][criteria-j]
  - ⚠️  Local reasoning holds for all but the schema authors; this is enabled
    through the use of client-generated SDL reflecting client extensions and
    error propagation behavior. For schema authors, local reasoning in the
    source SDL returns whether a field is nullable or non-nullable, but does
    not differentiate between _semantically_ non-nullable and _strictly_
    non-nullable.
- [K][criteria-k]
  - ✅ Introspection backwards compatible via `__Field.type(includeSemanticNonNull: Boolean! = false)`
- [L][criteria-l]
  - ✅ Proposal encourages consumers to use client-produced SDL which only uses traditional nullability (`Type`/`Type!`)
- [M][criteria-m]
  - ⚠️ You can use the same SDL everywhere, but that's not what this solution
    encourages.
- [N][criteria-n]
  - ✅ Indicates semantically non-null and strictly non-null types separately
- [O][criteria-o]
  - ✅ Client syntax unchanged
- [P][criteria-p]
  - ✅ There are no drawbacks to adding semantically non-nullable fields
- [Q][criteria-q]
  - ✅
- [R][criteria-r]
  - ✅ Syntax used for inputs is unchanged with or without the directive.

</details>

## 💡 4. New "Semantic Non-Null" type, with `?` used for nullable types

[solution-4]: #-4-new-semantic-non-null-type-with--used-for-nullable-types

<details>

<summary>Rejected - click for details</summary>

**Champion**: none (put your name here to become the champion!)

This proposal builds on solution 3, but with a syntactic shuffle such that the
unadorned type may be used as the semantically non-nullable type when the
directive is present, and a `?` symbol is used to indicate a nullable position.

Syntax only changes when `@semanticNullability` directive is present:

|                           | Input syntax        | Output syntax       |
| ------------------------- | ------------------- | ------------------- |
| Semantically nullable     | `Int` &rArr; `Int?` | `Int` &rArr; `Int?` |
| Semantically non-nullable | -                   | `Int`               |
| Strictly non-nullable     | `Int!` &rArr; `Int` | `Int!`              |


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
- [G][criteria-g]
  - ✅ Error capture positions unchanged when error propagation enabled
- [H][criteria-h]
  - 🚫 Implementation and spec simplicity.
- [I][criteria-i]
  - 🚫 Clients will need to move to using new syntax (`Type?`/`Type`) or have syntax incongruent with schema SDL
- [J][criteria-j]
  - 🚫 The nullability of `Type` cannot be determined without checking for a document directive
- [K][criteria-k]
  - ✅ Introspection backwards compatible via `__Field.type(includeSemanticNonNull: Boolean! = false)`
- [L][criteria-l]
  - ❔
- [M][criteria-m]
  - ❔
- [N][criteria-n]
  - ✅ Indicates semantically non-null and strictly non-null types separately
- [O][criteria-o]
  - ✅ Clients must opt in to new syntax with document directive
- [P][criteria-p]
  - ✅ There are no drawbacks to adding semantically non-nullable fields
- [Q][criteria-q]
  - 🚫 `Int` &rarr; `Int?` is breaking
- [R][criteria-r]
  - 🚫 Input positions have changed `Int` &rArr; `Int?`, `Int!` &rArr; `Int`

</details>


## 💡 5. Use non-null in semantically non-nullable places and encourage disabling error propagation

<details>

<summary>Rejected - click for details</summary>

[solution-5]: #-5-use-non-null-in-semantically-non-nullable-places-and-encourage-disabling-error-propagation

**Champion**: @martinbonnin

- Discussion: https://github.com/graphql/nullability-wg/discussions/85

This proposal relies on the ability of clients to opt out of error propagation; instead of introducing a new type it instructs schema authors to optimize for error-handling clients and use the traditional non-null type (`!`) on all semantically non-null fields.

|                           | Input syntax | Output syntax       |
| ------------------------- | ------------ | ------------------- |
| Semantically nullable     | `Int`        | `Int`               |
| Semantically non-nullable | -            | `Int` &rArr; `Int!` |
| Strictly non-nullable     | `Int!`       | `Int!`              |

### ⚖️ Evaluation

- [A][criteria-a]
  - 🚫👍 The nullability used in both error-propagation and no-error-propagation modes are the same. This is a feature, not a bug!
- [B][criteria-b]
  - ✅ The change from nullable to non-nullable on output is backwards compatible from a type perspective; for impact on error boundaries see G.
- [C][criteria-c]
  - ✅ `Int` means nullable still.
- [D][criteria-d]
  - ⚠️ Adding `@onError` to operations is not immediately intuitive but most error-handling clients should add it automatically, making it transparent to end users.
- [E][criteria-e]
  - ✅ Same syntax.
- [F][criteria-f]
  - ✅ Same syntax.
- [G][criteria-g]
  - 🚫 Using non-null in more positions will change the error boundary positions when error propagation is enabled.
- [H][criteria-h]
  - ✅ Implementation and spec simplicity.
- [I][criteria-i]
  - ✅ No change
- [J][criteria-j]
  - ✅ No change
- [K][criteria-k]
  - ✅ No change
- [L][criteria-l]
  - ✅ No change
- [M][criteria-m]
  - ✅ No change
- [N][criteria-n]
  - 🚫 Solution actually decreases value when error propagation is enabled due to lowered resilience to errors.
- [O][criteria-o]
  - 🚫 Changing fields to strictly non-null causes errors to propagate further, a breaking change. (Duplicate of G.)
- [P][criteria-p]
  - 🚫 Though the solution states it encourages the adoption of non-null, doing so is a breaking change for existing clients and so adopters are likely to hesitate when marking some semantically non-nullable positions as such
- [Q][criteria-q]
  - ✅ Same syntax.
- [R][criteria-r]
  - ✅ Same syntax.

</details>

## 💡 6. `@semanticNonNull` directive

[solution-6]: #-6-semanticnonnull-directive

**Champion**: -

Outline: https://specs.apollo.dev/nullability/v0.4/#@semanticNonNull

This proposal (which is already adopted in a few places!) introduces a
directive that can be added to fields to indicate their semantic nullability
(and that of their nested list positions).

```graphql
directive @semanticNonNull(levels: [Int!]! = [0]) on FIELD_DEFINITION

type Query {
  nonNullListOfNonNullInt: [Int] @semanticNonNull(levels: [0, 1])
}
```

The proposal is broadly similar to [solution 1][solution-1], but avoids
introducing new syntax. Interestingly, since the directive only applies on
`FIELD_DEFINITION` it explicitly limits semantic nullability to output
positions.

|                           | Input syntax | Output syntax                       |
| ------------------------- | ------------ | ----------------------------------- |
| Semantically nullable     | `Int`        | `Int`                               |
| Semantically non-nullable | -            | `Int` &rArr; `Int @semanticNotNull` |
| Strictly non-nullable     | `Int!`       | `Int!`                              |

### ⚖️ Evaluation

- [A][criteria-a]
  - ✅
- [B][criteria-b]
  - ✅ Existing symbology unchanged.
- [C][criteria-c]
  - ✅ Existing symbology unchanged.
- [D][criteria-d]
  - ✅ No syntax change (directive syntax already exists).
- [E][criteria-e]
  - ✅ Same syntax.
- [F][criteria-f]
  - ✅ Same syntax.
- [G][criteria-g]
  - ✅ Error capture positions unchanged when error propagation enabled
- [H][criteria-h]
  - ✅ Implementation and spec simplicity.
- [I][criteria-i]
  - ✅ Directive does not apply to input positions.
- [J][criteria-j]
  - ⚠️ Though the directives are local to the field, the reader must still correlate the directive and the passed indexes with the types specified to conclude what the final type is.
- [K][criteria-k]
  - ✅ Introspection backwards compatible via `__Field.type(includeSemanticNonNull: Boolean! = false)`
- [L][criteria-l]
  - ⚠️  Depends whether we advise using client-generated SDL or not.
- [M][criteria-m]
  - ✅ Same SDL everywhere.
- [N][criteria-n]
  - ✅ Indicates semantically non-null and strictly non-null types separately.
- [O][criteria-o]
  - ✅
- [P][criteria-p]
  - ⚠️ Though there's no technical reason not to do so, the mechanics of adding the directive (particularly when referencing positions inside lists) are tiresome in SDL-first schemas, decreasing likeliness that positions will be updated. (Code-first schemas are unaffected.) Further, the directives are likely to have a significant impact on the formatting of the SDL (`@semanticNonNull` is 16 characters, almost quarter of a line if wrap at 80), so designers may wish to only add them in the most critical of locations.
- [Q][criteria-q]
  - ✅
- [R][criteria-r]
  - ✅ Directive is only valid on output positions.

## 💡 7. `@propagateError` directive

[solution-7]: #-7-propagateerror-directive

**Champion**: @leebyron

Discussion: https://github.com/graphql/graphql-wg/discussions/1700

This proposal changes the `!` symbol and the `NON_NULL` introspection kind both to mean "semantic non null" (allowing for `null` on error). It introduces the `@propagateError` directive that can be added to fields to indicate that they should propagate errors in order to provide backwards compatibility with existing deployed clients.

```graphql
 type Person {
   id: ID! @propagateError
   name: String
   age: Int
   picture: Url
}
```


### ⚖️ Evaluation

- [A][criteria-a]
  - ✅ semantically non-null without propagateError
- [B][criteria-b]
  - ~✅ This is true when existing services must ensure propagateError is set when adopting this behavior.
- [C][criteria-c]
  - ✅ Existing symbology unchanged.
- [D][criteria-d]
  - ✅ No new symbols. No new types. Error bubbling was previously implicit behavior, now it is explicit.
- [E][criteria-e]
  - ✅ No change to input types
- [F][criteria-f]
  - ✅ 
- [G][criteria-g]
  - ✅ 
- [H][criteria-h]
  - ~✅ One new directive/introspection field. Behavior change is straightforward. Managing adoption/migration requires careful consideration.
- [I][criteria-i]
  - ✅ This proposes no change to executable documents
- [J][criteria-j]
  - ✅ The propagateError introspection/directive is local to the field (the optional propagateErrorOnAllNonNullFields config just does this for you).
- [K][criteria-k]
  - ✅ Adds one new field. Migration path supports existing semantics for shipped clients.
- [L][criteria-l]
  - ✅ There are only two types and they remain the same as they are today. This proposal is about changing error bubbling behavior, not nullability.
- [M][criteria-m]
  - ✅ First party APIs have a clear path to introduce propagateError for all consumers.
  - ⚠️ Third party APIs have a more challenging migration path, and may wish to expose different Schema to different clients.
- [N][criteria-n]
  - ✅ Separating nullability from error bubbling allows for more control. Clients should preferably disable error bubbling, but even if they do not - this unlocks the ability for a semantically non-null type which does not error propagate.
- [O][criteria-o]
  - ✅
- [P][criteria-p]
  - ✅ This is technically not breaking, however note that changing field: Type to field: Type! does introduce a new source of errors (which may be preferable!) Doing this without adding @propagateError is preferred, since changing field: Type to field: Type! @propagateError, could lose data - and is exactly why this kind change is discouraged today.
- [Q][criteria-q]
  - ✅
- [R][criteria-r]
  - ✅ No proposed change to inputs
