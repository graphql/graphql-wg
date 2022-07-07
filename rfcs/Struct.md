# Polymorphic-capable composite symmetric input/output type (`struct`)

> _a.k.a "Symmetric-Transput Replete Unadulterated Composite Type" S.T.R.U.C.T._

GraphQL currently has two types that are suitable for both input and output:
scalar and enum. These are both "leaf" types that generally[1] possess no
structure.

[1]: Custom scalars may possess internal structure, a common example of this is
the 'JSON' scalar, however this structure is not defined by nor can it be
queried via GraphQL (`specifiedBy` notwithstanding).

GraphQL currently has one _composite_ type that is suitable for input: the input
object type. This type possesses structure, but is only available on input (and
does not support polymorphism).

This proposal is for a composite type (a type with structure) which is available
on both input and output, and which supports polymorphism.

## Why?

A polymorphic-capable composite type that's available on both input and output
would address a number of use cases, so lets dig into them individually:

### Scalar with structure

Sometimes the data that a leaf field resolver returns may have structure,
represented via something like a custom scalar (e.g. 'JSON'). It would be nice
to share the schema of this data with the client to enable the client to
understand it better; this may be solved in part with `@specifiedBy`, but it
would be beneficial to leverage the capabilities that GraphQL already has.

- https://www.npmjs.com/package/graphql-type-json
- https://github.com/graphql/graphql-spec/issues/688

### Composite type capable of input polymorphism

The search for an "input union" type has been around for a long time; many of
the use cases and proposed solutions to this problem are discussed in the
[InputUnion RFC](https://github.com/graphql/graphql-wg/blob/main/rfcs/InputUnion.md).
The author of this RFC was also the author of three other RFCs to address the
input union problem, the leading one at this time being the `@oneOf` type.
Please see the InputUnion RFC for more details of why this feature is desired in
GraphQL.

### Symmetric polymorphism

One of the "high priority" desires for an InputUnion solution is "input
polymorphism matches output polymorphism." A union of structs would be suitable
for use on both input and output, since structs themselves are.

https://github.com/graphql/graphql-wg/blob/main/rfcs/InputUnion.md#-b-input-polymorphism-matches-output-polymorphism

### Non-infinite recursion

There have been a good few times that non-infinite recursion has been asked for
in GraphQL. Here's just a couple of the conversations on this topic:

- https://github.com/graphql/graphql-spec/issues/237
- https://github.com/graphql/graphql-spec/issues/929

Even introspection would benefit from non-infinite recursion - it would allow to
request the full type of a field no matter how many list wrappers the type
contained. Currently the best we have is to repeat a structure in the query:

https://github.com/graphql/graphql-js/blob/cfbc023296a1a596429a6312abede040c9353644/src/utilities/getIntrospectionQuery.ts#L131-L162

```graphql
fragment TypeRef on __Type {
  kind
  name
  ofType {
    kind
    name
    ofType {
      kind
      name
      ofType {
        # repeated 5 more times...
```

A use case that I've had for this non-infinite recursion is trying to generate a
"table of contents" for a tree structure (a DAG in my case). I resorted to the
`JSON` type, another solution is to turn the tree into a list, and turn the list
back into a tree on the client. A better solution would be to stick to the
tenets of GraphQL and return the data in the shape that the client needs, fully
type-safe.

### Symmetric transput composite type

Currently when a user wants to be able to input and output the exact same data
in a future-proof way, they must use a scalar or enum. This is one of the things
that has made solutions like the 'JSON' scalar quite popular, but it lacks
strong type safety guarantees.

In the GraphQL spec we use `String` to represent things like the `defaultValue`
of an argument or input field. Having to parse a string is not ideal; a type
that is symmetric over input and output would allow us to represent
`defaultValue` in a much easier to consume way.

When thinking about schema metadata, a type that can both be input (e.g. via
directives or similar) and output identically would be quite desirable.

If your GraphQL API supports complex filtering or aggregate queries (for example
if you're building a reporting dashboard or similar), you may want to be able to
both issue queries using these advanced parameters, and to store them to/load
saved versions of them from the backend. Having the data for this be symmetric
would be beneficial. Doing this with object type and input type is currently
unsafe as your API evolves as older clients will not request properties they did
not know about, potentially resulting in data loss; if we adopt wildcard
selection over structs (as discussed below) we may solve this issue.

### Wildcard selection

This has been discussed many times:

- https://github.com/graphql/graphql-spec/issues/127
- https://github.com/graphql/graphql-spec/issues/147
- https://github.com/graphql/graphql-spec/issues/942

GraphQL's reasoning for not performing wildcard selection with object types is
very sensible, and I do not argue against that in any way (I fully support it).

However, imagine that you're dealing with a concrete piece of data that has
structure, such as a time interval. In this case, you might have something like:
`{months: 2, days: 8, hours: 23}`. Since this is pure data, it does not have
arguments, it does not have relations to other types (the entire type is
effectively a "leaf" of our graph), and it only makes sense when you have the
whole value. If you were to add `decades: Int` to this type, it would be
essential that old clients pulled this field down, and baulked if they did not
know how to handle it - it would be unsafe for them to only process the
`months`, `days` and `hours` if there was also a `decades` field that they could
not have known about. Currently your best bet to deal with this is a custom
scalar for the entire `Interval` type, but that loses details about this
structure.

It's possible to imagine deeper structures than `Interval` that have these same
concerns, perhaps things like the save formats for WYSIWYG editors or similar,
all of which want to act like a `scalar` (i.e. no resolvers within them, no
arguments, just pure data), and yet have composite structure represented by the
schema.

On top of this, there are situations where you might _want_ to make explicit
sub-selections. For example, consider a [`GeoJSON`](https://geojson.org/)
value - you may wish to only query the `type` and `geometry` so that you can
plot it on a map, and not concern yourself with the (potentially multi-megabyte)
additional properties.

Allowing for wildcard selection along with explicit selection for these
structured scalar-like pure data types is desirable.

Another example of where this is useful is with traditional RESTful APIs which
use the `PUT` (rather than `PATCH`) mechanic - i.e. they replace the entire
object rather than "patching" it. To allow us to do this in a future compatible
way (allowing for the object to gain more properties over time) we must be
careful not to accidentally drop properties that we do not understand, so we
should pull down the entire object, modify the parts that we want to (leaving
parts we don't understand alone) and then send the entire (modified) object back
to the server.

## What could it look like?

There are two types that are close to solving this problem already:

- Input objects are already a structured input that handle many of our concerns,
  but they're only valid on input
- Scalars are already available on both input and output, and users can define
  their own

I see three approaches that we could take that would all be broadly similar in
terms of achieving our goals, but have slightly different trade-offs:

1. give `scalar` optional fields, turning it intro a `struct`
2. enable `input` to be used in output too, turning it into a `struct`
3. introduce a new `struct` type

I've gone full circle on this, and am currently thinking that option 2 is our
best bet. The main reason for this is that in the other scenarios `struct` and
`input` will overlap significantly and it will be less than clear when to use
one rather than the other.

**NOTE**: this syntax, these keywords, etc. are not set in stone. Discussion is
very welcome!

### `struct`

No matter which of the three approaches we take (scalar, input, new type), the
resulting type (`struct`) will be composed of fields, each field has a type, and
the type of a `struct` field can be a `struct`, scalar, enum, struct union, or a
wrapping type over any of these. (i.e. it is only composed of types that are
valid in both input and output.)

Importantly, when querying a `struct` you can never reach an object type, union
or interface from within a `struct` - the entire `struct` acts like a leaf (a
leaf with structure).

Similarly, for input, a `struct` may never contain an input object (unless that
input object is, itself, a struct).

Similar to input objects, a `struct` may not contain an unbreakable cycle.

A struct might look something like this:

```graphql
struct Biography {
  title: String!
  socials: BiographySocials
  paragraphs: [Paragraph!]!
}
```

(Note how this is basically identical to an `input` definition.)

### Pure structured data

Like scalars, structs represent pure data that is the same on input as on
output. Unlike scalars, however, structs have structure (and thus fields) - but
since they're just pure data their fields do not have resolvers, and do not
accept arguments. They are **NOT** a replacement for Objects!

### `__typename`

`__typename` is available to query on all `struct`s. This ensures that clients
that automatically and silently add the `__typename` meta-field to every
selection set will not break, and is could also be useful for resolving the type
of a struct union.

On input of a `struct`, `__typename` is optional but recommended.

Champion's note: if we were to make `__typename` required on all `struct` inputs
then changing an input type from `struct` to struct union (see below) would be
non-breaking; this is a nice advantage, but is currently outweighed by the
desire to make input pleasant for users, and to make `struct` compatible with
existing input objects.

### Struct union

A struct union is an abstract type representing that the value may be one of
many possible `struct`s. Rather than requiring a new type, we can define a
struct union as a union that only contains structs:

```graphql
union Paragraph =
    TextParagraph
  | PullquoteParagraph
  | BlockquoteParagraph
  | TweetParagraph
  | GalleryParagraph
```

(A `union` must only consist of object types, or only of structs, never a mix of
the two.)

Champion's note: We could use a different keyword, such as `structUnion`, to
enforce this, but I'm not convinced this is necessary.)

Champion's note: I'm very open to dropping struct union and using a oneOf
approach instead, or adding a oneOf approach in addition. I've gone with struct
union for now for greater similarity with the existing GraphQL types.

A struct union is valid in both input and output.

On input of a struct union, `__typename` is required in order to determine the
type of the `struct` supplied.

### Example schema

Here's an example schema where a user can customise their biography by composing
together paragraphs of different types. You could imagine that these paragraphs
were managed by an editor such as ProseMirror.

```graphql
type Query {
  user(id: ID!): User
}

type Mutation {
  setUserBio(userId: ID!, bio: Biography!): User
}

type User {
  id: ID!
  username: String!
  bio: Biography!
}

struct Biography {
  title: String!
  socials: BiographySocials
  paragraphs: [Paragraph!]!
}

struct BiographySocials {
  github: String
  twitter: String
  linkedIn: String
  facebook: String
}

union Paragraph =
  | TextParagraph
  | PullquoteParagraph
  | BlockquoteParagraph
  | TweetParagraph
  | GalleryParagraph

struct TextParagraph {
  text: String!
}
struct PullquoteParagraph {
  pullquote: String!
  source: String
}
struct BlockquoteParagraph {
  paragraphs: [Paragraph!]!
  source: String
}
struct TweetParagraph {
  message: String!
  url: String!
}
struct GalleryParagraph {
  images: [Image!]!
}

struct Image {
  url: String!
  caption: String
}
```

### Selection sets

Controversially, structs could be the first type in GraphQL that can act as both
a leaf _and_ a non-leaf type - i.e. a selection set over them is optional. If
you do not provide a selection set then the entire value is returned. If you do
provide a selection set then those fields will be selected and returned.

Struct selection sets are similar to, but not the same as, regular selection
sets. In particular:

- struct fields are not `FIELD`s, i.e. they cannot have `FIELD` directives
  attached (suggest we call them `STRUCT_FIELD`)
- aliases are not allowed, otherwise the simple field merging (see below) does
  not work (also there's no need for aliasing because struct fields are pure
  data and do not accept arguments, so they cannot produce multiple values for
  the same field)

Both inline and named fragments are supported on `struct`s and struct unions.

Field merging is very straightforward; for the example schema above, the
following query:

```graphql
{
  user(id: "1") {
    bio {
      title
    }
    bio {
      socials {
        twitter
      }
    }
  }
}
```

would be equivalent to:

```graphql
{
  user(id: "1") {
    bio {
      title
      socials {
        twitter
      }
    }
  }
}
```

(Note that the object with both `title` and `socials{twitter}` satisfies both
selection sets.)

And similarly, the following:

```graphql
{
  user(id: "1") {
    ...A
    ...B
    ...C
  }
}

fragment A on User {
  bio {
    title
  }
}

fragment B on User {
  bio {
    socials {
      twitter
    }
  }
}

fragment C on User {
  # Select the entire field
  bio
}
```

would be equivalent to:

```graphql
{
  user(id: "1") {
    bio
  }
}
```

(Note that because we're selecting the entire `bio` field in `C`, all possible
subselections are satisfied, and thus A and B are happy.)

### Why doesn't GraphQL support wildcards over object types?

In general GraphQL, wildcards have a lot of questions:

- Which fields do we select?
- What do we do for fields with arguments?
- What do we do about deprecated fields?
- Do we automatically add subselections to non-leaf fields?
  - How deep do we go?
  - What happens if there's an infinite loop?
- Etc.

They also impede the "versionless schema" desire of GraphQL - if a client uses
wildcards then when new fields are added the client will start receiving these
too, sending them data that they may not understand or desire and causing
versioning problems.

However, if we constrain the problem space down to that of pure structured data
(treating it like an atom - like a `scalar` is currently) then many of these
concerns lessen.

## Should `struct` replace input objects?

Maybe... They do seem to solve many of the same problems. However one major
difference is intent; because `struct` is intended to be used for input/output
it's intended that you pull it down, modify it as need be, and then send it back
again. As such, adding a non-nullable field to a struct used in this way may not
be a breaking change - existing clients should automatically receive the
additional fields, and send them back unmodified.

The semantics of `struct` and input objects are very similar, so it could be
that we repurpose input objects for struct usage. This will need careful
thought, discussion and investigation. Not least because the term `input` would
make it confusing ;)
