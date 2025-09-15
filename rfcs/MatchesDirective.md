# RFC: Matches Directive

**Proposed by:** [Mark Larah](https://twitter.com/mark_larah) - Yelp

**Implementation PR**: todo

This RFC proposes adding a new directive `@matches` and associated validation
rules to enforce the safe selection of "supported" types when using fragment
spreads on a field that returns an array of unions of polymorphic types:

```graphql
directive @matches(
  """
  Optional dotted field path (relative to the field’s return value) that
  identifies where the polymorphic element(s) appear.
  """
  path: String,

  """
  Whether or not argument ordering is enforced. This may be set to False if the
  order is meaingful and used by the application logic.
  """
  sort: Boolean = True
) repeatable on ARGUMENT_DEFINITION
```

## 📜 Problem Statement

We need to be able to communicate to the server what possible return types are
supported in an array of unions or interfaces.

**Example**

A client application may wish to display a fixed number of media items:

```graphql
query GetMedia {
  getMedia { # returns a fixed array of `Book | Movie`
    ... on Book { title author }
    ... on Movie { title director }
  }
}
```

...but when we introduce the new media type `Opera` into the union, an old
client using the above query will not be able to display any returned results
for `Opera`, leaving empty "slots" in the UI.

## Current Solutions

A number of alternative approaches exist:

### 1. `supports` argument

We could manually introduce an argument (`only`, `supports`, etc) to the field
to communicate which types are supported:

```graphql
query GetMedia {
  getMedia(supports: [Book, Movie]) {
    ... on Book { title author }
    ... on Movie { title director }
  }
}
```

The resolver must then read the `supports` field argument to filter and only
return compatible types.

#### 1.a. With enums

**Example SDL**
```graphql
union Media = Book | Movie | Symphony

enum MediaFilter {
  Book
  Movie
  Symphony
}

type Query {
  getMedia(supported: [MediaFilter!]!): [Media]
}
```

**👎 Downsides**:

- Requires humans to manually create a mirror enum of the union
- Does not guarantee that the `supports` argument is respected at runtime

#### 1.b. With strings

**Example SDL**
```graphql
union Media = Book | Movie | Symphony

type Query {
  getMedia(supported: [String!]!): [Media]
}
```

**👎 Downsides**:

- Strings are more error prone - e.g. humans may get the capitalization wrong
- Does not guarantee that the `supports` argument is respected at runtime

#### 1.c. Compiled

Relay provides a `@match` directive:

https://relay.dev/docs/guides/data-driven-dependencies/server-3d/#match-design-principles

Queries are compiled, such that this:

```graphql
query GetMedia {
  getMedia {
    ... on Book { title author }
    ... on Movie { title director }
  }
}
```

...becomes this (at build time):

```graphql
query GetMedia {
  getMedia(supports: ["Book", "Movie"]) {
    ... on Book { title author }
    ... on Movie { title director }
  }
}
```

This improves on both `1.a.` and `1.b`:

**👍 Upsides**:

- There's no extra enum to maintain
- Avoid humans passing freeform strings

**👎 Downsides**:

- Requires a compiler step. Non compiling clients cannot support this (see #3
  below for why)
- Does not guarantee that the `supports` argument is respected at runtime

### 2. Server-side mapping

Let's assume that clients send a header on every request to identify their
version e.g. (`v1`, `v2`).

We could maintain a mapping on the server that encodes the knowledge of which
client supports the rendering of which types:

```json
{
  "v1": ["Book", "Movie"],
  "v2": ["Book", "Movie", "Opera"],
  "v3": ["Book", "Movie", "Opera", "Audiobook"],
  ...
}
```

The resolver checks this mapping to filter what types to return.

**👎 Downsides**:

- Extra source of truth / moving part / thing to maintain
- Stores freeform strings - no validation that the typenames are valid
- Does not guarantee that this is respected at runtime

### 3. Runtime AST inspection

> [!WARNING]
> This example is not actually safe, do not use.

In theory, the names of the fragments in the selection set is available in the
AST of the query passed to resolvers at runtime. A resolver could attempt
something like this:

```js
const resolvers = {
  Query: {
    getMedia: (_, __, ___, info) => {
      // ignore https://github.com/graphql/graphql-js/issues/605
      const node = info.fieldNodes[0];

      // gets something like ["Book", "Movie"]
      const supportedTypes = node.selectionSet.selections.map(
        ({ typeCondition }) => typeCondition.name.value
      );
```

However, this would cause (many) issues at runtime.

One such problem: if a client writes this:

```graphql
query GetMedia {
  ...BooksTab
  ...MoviesTab
}

fragment BooksTab on Query {
  getMedia {
    ... on Book { title author }
  }
}

fragment MoviesTab on Query {
  getMedia {
    ... on Movie { title director }
  }
}
```

The selection sets in fragments get merged, and the `getMedia` resolver is only
executed once. With the above implementation, we'd *only* return Books (the
first to be evaluated). Since the resolver is only executed once, this is
impossible to implement correctly.

#### 3.b. Add the `supports` argument at runtime

We could use this approach to instead add the `supports` argument at runtime
(similar to 1.c.).

By default however, this would cause type checking on the client to fail (since
the "required" argument isn't provided).

In addition, noramlized cache layers wouldn't be aware of this runtime
transform.

If a client issues this query:

```graphql
query GetMedia {
  getMedia {
    ... on Book { title author }
  }
}
```

...and later on, this query:

```graphql
query GetMedia {
  getMedia {
    ... on Movie { title author }
  }
}
```

Oops! That's a cache hit! And overriding the cache policy to fetch anyway would
overwrite the previous cache value for `Query.getMedia`, causing the previously
rendered UI to have empty slots.


## 🧑‍💻 Proposed Solution

The `@matches` directive can be applied to a field argument when returning an
array of unions of polymorphic types. It declares the set of valid response
types, and is enforced by the server.

#### Example

**SDL**

```graphql
directive @matches(sorted: Boolean = True) on ARGUMENT_DEFINITION

union Media = Book | Movie | Opera

type Query {
  getMedia(supports: [String!] @matches): [Media]
}
```

**Query**

```graphql
query GetMedia {
  getMedia(supports: ["Book", "Movie"]) {
    ... on Book { title author }
    ... on Movie { title director }
  }
}
```

### `sort` argument

If `sort` is true (default), the argument’s values are required to appear in
sorted (alphabetical) order:

- `getMedia(supports: ["Book", "Movie"]) # OK` 
- `getMedia(supports: ["Movie", "Book"]) # ❌ Error: not sorted`

This is desirable as a default behaviour. If not enforced, this would imply
cache denormalization and cache misses in clients.

If `sort` is false, this is not enforced, and both examples above are allowed.
This may be desirable if the application logic depends on the ordering of the
argument values - e.g. to signal a desired priority or ordering of result types.

### `path` argument

`path` is an optional argument that accepts a dot-seperated
[response path][response position] relative to the field.

[response position]: https://spec.graphql.org/September2025/#sec-Response-Position

This primarily in in order to support nested responses inside connection objects
when using pagination:

**Example**

```graphql
type Query {
  getPaginatedMedia(
    first: Int
    after: String
    only: [String!] @matches(path: "nodes")
  ): MediaConnection
}

type MediaConnection {
  nodes: [Media!]
  pageInfo: PageInfo
}
```

### `repeatable`

`@matches` may be applied multiple times in order to support multiple nested
fields:

**Example**

```graphql
type Query {
  getMedia(
    first: Int
    after: String
    only: [String!] @matches(path: "nodes") @matches(path: "all")
  ): MediaConnection
}

type MediaConnection {
  nodes: [Media!]
  pageInfo: PageInfo

  """Clients may use this if they don't want to use pagination."""
  all: [Media!]
}
```

### Validation

The following new validation rules are applied:

#### Request Validation

1. All selected types must match an entry in `supports`:

    ```graphql
    query {
      getMedia(supports: ["Book"]) {
        ... on Book { title author }
        ... on Movie { title director } # ❌ Error: `supports` did not specify `Movie`.
      }
    }
    ```

2. All specified type names must be valid return types:

    ```graphql
    query {
      getMedia(supports: ["VideoGame"]) { # ❌ Error: `Media` union does not contain `VideoGame`
    ```

#### Response Validation

Throw an error if the resolver returns a type that is not present in the
`supports` array:

```js
const resolvers = {
  Query: {
    getMedia: (_, { supports }) => {
      // supports = ['Book', 'Movie']

      // ❌ Error: `supports` did not specify `Opera`.
      return [{ __typename: 'Opera', title: 'La Boheme'}]
    }
  }
}
```

## Appendix

### Controlling if ordering matters

There is a meaningful difference between these two queries:

```graphql
query PrefersBooks {
  getMedia(supports: ["Book", "Movie"]) {
    ... on Book { title author }
    ... on Movie { title director }
  }
}
```

```graphql
query PrefersMovies {
  getMedia(supports: ["Movie", "Book"]) {
    ... on Book { title author }
    ... on Movie { title director }
  }
}
```

A client may rely on the ordering of `supports` fields to indicate the
preference and rank order in which to return objects.

However, this may cause confusion and unintentional cache misses.

The client must decide if they wish to make the ordering of `supports`
meaningful or not - and it not, we should enforce that the ordering is
consistent (alphabetically sorted).

A `sort` argument is provided to support this:

- If `sorted` is True (default), `supports` argument ordering is enforced via a
  request validation rule.
- If `sorted` is False, `supports` argument ordering is not enforced, allowing
  different fragments to specify different orderings (and be cached
  independently).

**Example**

```graphql
type Query {
  # different parts of the app want different media items with different ordering - we're ok with this field being cached multiple times 
  getMedia(supports: [String!] @matches(sorted: False)): [Media]
}
```

### Alternative names

`@matches` is proposed in order to avoid conflicting with Relay's `@match`.

Also considered:

- `@filter`
- `@filterTypes`
- `@matchFragments`
- `@matchTypes`
- `@only`
- `@supports`
- `@supportsTypes`
- `@typeFilter`
