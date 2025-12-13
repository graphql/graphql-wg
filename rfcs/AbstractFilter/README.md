# Abstract Filter

Champion: Mark Larah (@magicmark)

## Overview

A schema may offer a field that returns a list of an abstract type (an interface
or union), but the user may only want a subset of these types to be returned, or
the client may only support a subset of these types (or only current versions of
the types, not those that are added to the union or implement the interface in
the future). Typically, the user's preference will be that that filtering take
place _before_ pagination arguments are applied.

For example, a user is browsing a pet store, but is only interested in cats and
fish, they want dogs to be excluded:

```graphql
{
  allPets(first: 5, only: ["Cat", "Fish"]) {
    name
    price
    ... on Cat {
      breed
    }
    ... on Fish {
      species
    }
  }
}
```

Now consider widget-based user interfaces, where each concrete type has its own
widget. This is common in server-driven UI (SDUI); for example:

```graphql
{
  newsFeed(first: 5) {
    ...StatusFragment
    ...PhotoFragment
    ...EventFragment
  }
}
fragment StatusFragment on Status {
  author {
    name
    avatar
  }
  text
  comments(first: 2) {
    author {
      name
      avatar
    }
    text
  }
}
fragment PhotoFragment on Photo {
  url
  tags {
    user {
      name
      avatar
    }
    text
  }
  comments(first: 2) {
    author {
      name
      avatar
    }
    text
  }
}
fragment EventFragment on Event {
  title
  startTime
  duration
  description
  location
  entryFee
}
```

As the schema evolves, `newsFeed` might add a new type to the union: `Video`.
The existing deployed client now receives empty objects where a video would be,
and the UI no longer renders 5 tiles reliably. The client would like to filter
to only the types it supports:

```graphql
{
  newsFeed(first: 5, only: ["Status", "Photo", "Event"]) {
    ...StatusFragment
    ...PhotoFragment
    ...EventFragment
  }
}
```

This RFC comes in two parts:

1. An `ARGUMENT_DEFINITION` directive and associated behaviors that indicates
   that an argument will ensure only the given types are returned
2. A client-only `FIELD` directive that will cause this argument to be
   automatically populated based on the types of fragments used in this field's
   selection set

## Decisions

Here's a rough log of the things that we've determined so far.

### String, not enum

It was proposed that the `only` argument could accept an array of enum values,
where the enum contained a value for each type the abstract type supported.

Pros:

- Could be auto-detected by convention (field returns list of (or connection of)
  abstract type, argument name is `only`, argument is list of enum type, enum
  enum contains a value for each of the possible types of the abstract type and
  nothing else) - no need for spec changes
- Auto-complete in GraphiQL
- Automatically validated with errors surfaced with existing tooling already
- Looks neat and obvious, less visual noise:
  `{ newsFeed(only: [Status, Photo, Event]) {...} }`

Cons:

- Would add potentially long enums to schema (noisy)
- Keeping enums in sync would lean towards some kind of generation in SDL-first
  (e.g. `enum PetType @possibleTypes(typeName: "Pet")`) or dynamic construction
  in code-first.
- Using the type name verbatim (`GuineaPig`) would break the `UPPER_CAMEL_CASE`
  convention, causing lint failures in some schemas

The clincher that ruled out the enum type was the "Argument must accept both
abstract and concrete types" decision - an enum composed of all of the possible
types of an abstract type **plus** all of the abstract types that those types
implement or are a member of would be exceedingly verbose.

### Argument must accept both abstract and concrete types

A "know-nothing" client (one that does not know the schema definition) would not
know whether a fragment spread was on a concrete or abstract type, so the
argument should support both concrete and abstract types to avoid developer
pain.

### No custom syntax

Various custom syntaxes were proposed, such that the set of possible types could
be automatically determined; for example the double-brace syntax:

```graphql
{
  allPets {{ # e.g. resolver passed special argument `__only: ["Cat". "Dog"]`
    Cat { ... CatFragment }
    Dog { ... DogFragment }
  }}
}
```

This list of possible types would be used by the client as part of the cache key
in the normalized store, and also would be fed to the server's resolver to
ensure only the compatible types were returned (and GraphQL would throw an error
if this promise were broken).

All of these fell down when considering indirect relations between the selection
set and the argument position - how would the client/schema know to feed this
into a connection?

```graphql
{
  allPetsConnection { # How would we know to pass the special argument here?!
    edges {
      cursor
      node {{
        Cat { ... CatFragment }
        Dog { ... DogFragment }
      }}
    }
  }
}
```

It's essential that the client know that this filtering is applied such that its
normalized store does not become corrupted, and thus it was agreed that we
should stick with passing the list of allowed types as an argument (since
arguments already factor into npormalized cache keys).

### Two specifications

Originally this was considered as a single feature for SDUI usage; however it
was realised that the filter argument (and associated behavior) was useful even
without the auto-generation of the value - the definition of behavior of such an
argument would allow auto-completion in editors, and would be behavior the
client could rely upon even without requiring the query be formed in a
particular format.

### Directive, not convention

Clients relying on this functionality need strong guarantees. The GraphQL Cursor
Connections Specification can rely on conventions since the requirements are
sufficiently complex that we can be pretty sure someone is deliberately
implementing that pattern. However, with this proposal, short of using an enum
type (ruled out above), there's insufficient information to give us the
confidence that the argument definitely applies the behaviors we expect.

Given the above, the argument needs an annotation to indicate its special
behavior for automated tooling to be able to rely on it, and the way to add that
annotation currently is via a directive.

It is recognized that currently this directive will not be available via
introspection. This part of the spec therefore relies on the resolution of
[#300](https://github.com/graphql/graphql-spec/issues/300).

## Prior art

Relay `@match` directive:
https://relay.dev/docs/guides/data-driven-dependencies/server-3d/#match-design-principles

PostGraphile `only` argument:
https://github.com/graphile/crystal/blob/bcf8326bef7930b02c00b67e4ebda22a49e4f5fa/graphile-build/graphile-build-pg/src/plugins/PgPolymorphismOnlyArgumentPlugin.ts#L202-L204
