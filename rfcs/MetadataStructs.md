# Metadata Structs

Schema metadata has long been desired, please see this long discussion:

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

## Problems

Some of the main problems that need to be solved with schema metadata are:

- representing all desired metadata (including polymorphic metadata)
- the need for granularity (partial introspection)
- the need for support in tooling (e.g. GraphiQL) to give visibility into the
  metadata
- being able to fully introspect the GraphQL schema in a small number of
  roundtrips
- avoiding the need for complex parsing on the client
- allowing for future expansion of the metadata/introspection schema (without
  namespace clashes)

### Granularity

It can be useful for clients to include small introspection queries as part of
their applications - for example you might introspect a particular named enum to
make available sorting options in a dropdown. If the schema adds support for a
new sort method, the client could add this option to the dropdown without
needing to be updated thanks to introspection. However, enum values don't
currently contain enough information for this.

Consider that we add a "label" property to the metadata for each enum value -
then we would have all we need to display it to the user, so long as they spoke
that language. To cater to an international audience, we could add many
translations to each enum value - but now the size of the introspection has
grown. A better solution might be to allow the client to select just the
translation that it needs from the enum value. (We also don't need any of the
other metadata for the enum values, only the labels.)

## Solution

This RFC proposes what I feel is a more capable and elegant solution than any of
the previously proposed solutions covered by my talk, but it's predicated on the
existence of a polymorphic-capable composite type that can be used symmetrically
for both input and output. As it happens there's [an RFC for that](./Struct.md),
so you can see this metadata RFC as an extension of that Struct RFC.

### SDL

`meta` keyword, very similar to `directive`, defines the meta types and fields.
The type of each field can be any type that is suitable on both input and output
(i.e. scalar, enum, struct, struct union, and wrapping types thereof).

```graphql
meta +source(table: String, column: String, service: ServiceSource) on OBJECT | FIELD_DEFINITION
meta +visibility(only: [VisibilityScope!]!) required on OBJECT
meta +label(en: String, fr: String, de: String) on ENUM_VALUE

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
  PUBLIC +label(en: "Anyone", fr: "Tout les monde", de: "Alle")
}

type User +source(table: "public.users") +visibility(only: [ORGANIZATION]) {
  id: ID!
  organization: Organization!
  username: String! +source(column: "handle")
  avatar: String! +source(service: {
    serviceName: "S3"
    identifier: "/avatars/27.png"
  })
}
```

Note: `+visibility` is marked as `required`; in user space it must be defined
explicitly for each object, but for introspection types it is omitted.

### Introspection

Introspection query example:

```graphql
{
  User: __type(name: "User") {
    meta
    # Or:
    meta {
      source {
        table
      }
      visibility {
        only
      }
    }
  }
  VisibilityScope: __type(name: "VisibilityScope") {
    enumValues {
      name
      meta {
        label {
          en
        }
      }
    }
  }
}
```

Changes to the schema introspection types:

```graphql
type __Schema {
  metas: [__Meta!]!
}

# Similar to __Directive
type __Meta {
  name: String!
  description: String
  locations: [__MetaLocation!]!
  isRequired: Boolean!
  # Always a struct; the fields of the struct are the parameters of the meta
  type: __Type
}

type __Type {
  #...
  meta: __TypeMeta
}

struct __TypeMeta {
  source: __Meta_source

  # Though +visibility was defined as 'required', it is only required on
  # user-space object types, and thus it is nullable here.
  visibility: __Meta_visibility
}

# Auto-generated via `__Meta_` + meta name?
struct __Meta_source {
  table: String
  service: ServiceSource
}

struct __Meta_visibility {
  only: [VisibilityScope!]!
}

type __Field {
  meta: __FieldMeta
}
type __EnumValue {
  meta: __EnumValueMeta
}
# etc
```
