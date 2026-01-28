# RFC: Full Schemas

**Proposed by:** [Martin Bonnin](https://mastodon.mbonnin.net/@mb) - Apollo

## Problem statement

In its current form the GraphQL specification contains language about the presence of built-in definitions in SDL schemas:

* scalars MUST be absent from SDL ([here](https://spec.graphql.org/October2021/#sel-GAHXJHABAB_D4G)) 
* directives SHOULD be absent([here](https://spec.graphql.org/October2021/#sel-FAHnBPLCAACCcooU)) 
* introspection types are not mentioned in the spec (See [here](https://github.com/graphql/graphql-spec/pull/1036) for a pull request to address this)

This is made for brevity and correctness reasons. When the SDL document is fed to a GraphQL implementation like graphql-js, there is no need to add the built-in definitions as the implementation will add them. Adding built-in definitions in the input schema could also be confusing: what definition is used? The one from the input schema or the one from the implementation? It makes sense overall to omit built-in definitions from SDL documents that are used by GraphQL implementations.

But the absence of built-in definitions can make it impossible for client tools to validate an operation without knowing more details about what is supported by the server. 

For an example, the below query is valid if the server uses the latest draft but is not valid if the server uses the [Oct2021 specification](https://spec.graphql.org/October2021/#sel-GAJXNFADgHAADkHABsrC):

```graphql
{
  __schema {
    types {
      name
      inputFields {
        name
        # isDeprecated is only present in latest versions of the specification
        isDeprecated
        deprecationReason
      }
    }
  }
}
```

In general, it would be nice to have a SDL format that would be a full representation of the server schema, even if it means it is more verbose.

With the advent of [service capabilities](https://github.com/graphql/graphql-spec/pull/1163), some SDL information is tied to the implementation and not to the type system. It makes sense to have "full schemas" contain this, but not too much in "source schemas"

This proposal is about allowing SDL documents that contain all the information required for tooling to validate any operation, later denominated as "full schema".

## Proposal: be explicit about "full schemas" vs "source schemas"

Introduce "full schemas" in addition to the existing SDL schemas. A "full schema" is a schema that also contains the built-in definitions and service capabilities added by the implementation.

## Questions

### Q: Why not always use introspection results?

Introspection is the tool that was designed for clients to consume schemas, so it could be argued that client should use that. However:

1. Some servers have introspection disabled making it hard for clients to get an introspection schema
2. In general, SDL is a much more readable and concise representation than the introspection JSON, making it more suited for workflows where the file is read by humans (IDEs, codegen, etc...)
3. SDL schemas can represent applied directives, which introspection can't (see [#300](https://github.com/graphql/graphql-spec/issues/300)). Tools could use that information to provide a better developer experience, add functionality, etc... 

### Q: Wouldn't that make inconsistent SDL documents containing unused definitions?

There is a (unwritten?) rule that SDL definitions must all be used (with an exception for built-in scalars and directive definitions). Hence, adding the introspection types to SDL would result in this schema being valid:

```graphql
type Query {
    random: String
}

type __Schema { ... }
type __Type { ... }
enum __TypeKind { ... }
type __Field { ... }
type __InputValue { ... }
type __EnumValue { ... }
type __Directive { ... }
enum __DirectiveLocation { ... }
```

Although technically nothing would use the `__Schema` type. For this, we would need to add the `__schema` meta-field:

```graphql
type Query {
    random: String
    __schema: __Schema
}

```

But then doing so for typename would become very noisy:

```graphql
type Foo {
    # add __typename here
    __typename: String!
}
type Bar {
    # and here as well
    __typename: String!
}
union SomeUnion = Foo | Bar {
    # Technically unions have __typename, should we do this? 
    __typename: String!
}

```
