# Annotation Structs

Schema annotations has long been desired, please see this long discussion:

https://github.com/graphql/graphql-spec/issues/300

I digested many of the currently proposed (and in the wild) solutions to this
problem in my talk at the GraphQL Conference, you can see the talk here:

https://youtu.be/c1oa7p73rTw

It covers:

- custom introspection extensions
- 'SDL' field in schema, like Apollo Federation
- storing metadata in the description field
- adding metadata entirely in user-space
- 'applied directives'

It expands on the pros and cons of these approaches and asks "is there a better
solution".

Note that this topic has historically been referred to as "schema metadata", but
upon discussion with other WG members it has become clear that "annotations" is
a better term - we're annotating the types/fields/arguments/etc rather than the
data.

## Problems

Some of the main problems that need to be solved with schema annotations are:

- representing all desired annotations (including polymorphic annotations)
- the need for granularity (partial introspection)
- the need for support in tooling (e.g. GraphiQL) to give visibility into the
  annotations
- being able to fully introspect the GraphQL schema in a small number of
  roundtrips
- avoiding the need for complex parsing on the client
- allowing for future expansion of the annotations/introspection schema (without
  namespace clashes)

### Granularity

It can be useful for clients to include small introspection queries as part of
their applications - for example you might introspect a particular named enum to
make available sorting options in a dropdown. If the schema adds support for a
new sort method, the client could add this option to the dropdown without
needing to be updated thanks to introspection. However, enum values don't
currently contain enough information for this.

Consider that we add a "label" property to the annotations for each enum value -
then we would have all we need to display it to the user, so long as they spoke
that language. To cater to an international audience, we could add many
translations to each enum value - but now the size of the introspection has
grown. A better solution might be to allow the client to select just the
translation that it needs from the enum value. (We also don't need any of the
other annotations for the enum values, only the labels.)

## Solution

This RFC proposes what I feel is a more capable and elegant solution than any of
the previously proposed solutions covered by my talk, but it's predicated on the
existence of a polymorphic-capable composite type that can be used symmetrically
for both input and output. As it happens there's [an RFC for that](./Struct.md),
so you can see this annotations RFC as an extension of that Struct RFC.

Note that though we use the keyword `struct` to indicate this type, really we're
just extending the `input` object type to be available on output too, so you can
replace the keyword `struct` with `input` if you prefer.

### SDL

We could introduce annotations as a separate keyword (e.g.
`annotation +source(table: String, column: String, service: ServiceSource) on OBJECT | FIELD_DEFINITION`),
however the WG seem generally in favour of using directives to represent
annotations, so we'll show how to power
[Lee's Metadata Directives proposal](https://github.com/graphql/graphql-wg/discussions/1096)
syntax with structs. I've taken the liberty of replacing the keyword `metadata`
with `annotation`, but it's otherwise equivalent.

Here's an example schema a user might define:

```graphql
directive @source(table: String, column: String, service: ServiceSource) annotation on OBJECT | FIELD_DEFINITION
directive @visibility(only: [VisibilityScope!]!) annotation on OBJECT
directive @label(en: String, fr: String, de: String) annotation on ENUM_VALUE

struct ServiceSource {
  serviceName: string
  identifier: string
}

enum VisibilityScope {
  NONE
  PERSONAL
  TEAM
  ORGANIZATION
  ADMINS
  PUBLIC @label(en: "Everyone", fr: "Tout les monde", de: "Alle")
}

type User
  @source(table: "public.users")
  @visibility(only: [ORGANIZATION])
{
  id: ID!
  # Omitted for brevity:
  # organization: Organization!
  username: String! @source(column: "handle")
  avatar: String! @source(service: {
    serviceName: "S3"
    identifier: "/avatars/27.png"
  })
}

type Query {
  me: User
}
```

### Introspection

Introspection query example:

```graphql
{
  User: __type(name: "User") {
    annotations
    # Or:
    annotations {
      __typename
      ... on __Annotation_source {
        table
      }
      ... on __Annotation_visibility {
        only
      }
    }
  }
  VisibilityScope: __type(name: "VisibilityScope") {
    enumValues {
      name
      # Only show me the 'label' directives, and only the 'en' argument of those:
      annotations(directiveNames: ["label"]) {
        ... on __Annotation_label {
          en
        }
      }
    }
  }
}
```

Changes to the schema introspection types:

```graphql
# Each annotation directive will have a struct implicitly defined for it, named
# `__Annotation_${directiveName}` with a field for each argument the directive
# accepts. The type of these fields will be the same as the type of the
# directive arguments.

# The struct for the `@source(table: String, column: String, service: ServiceSource)` annotation directive:
struct __Annotation_source {
  table: String
  column: String
  service: ServiceSource
}

# The struct for the `@visibility(only: [VisibilityScope!]!)` annotation directive:
struct __Annotation_visibility {
  only: [VisibilityScope!]!
}

# The struct for the `@label(en: String, fr: String, de: String)` annotation directive:
struct __Annotation_label {
  en: String
  fr: String
  de: String
}

# Each of the introspection entrypoints will have an `annotations` field added,
# which will return a list of struct-unions of the directives that were applied
# in those locations in order. The field can optionally accept a list of
# directives you're interested in to allow for more granular metadata selection.

type __Type {
  # ...
  annotations(directiveNames: [String!]): [__TypeAnnotation]
}
type __Field {
  # ...
  annotations(directiveNames: [String!]): [__FieldAnnotation]
}
type __EnumValue {
  # ...
  annotations(directiveNames: [String!]): [__EnumValueAnnotation]
}
# etc

# For `__TypeAnnotation` we get a struct-union representing all annotation
# directives that are valid on a GraphQL type (`OBJECT`, `INPUT_OBJECT`,
# `UNION`, `INTERFACE`, `SCALAR`, `ENUM`). There are two directives
# (`@source` and `@visibility`) that are available on at least one of these
# locations:
union __TypeAnnotation =
  | __Annotation_source
  | __Annotation_visibility
```
