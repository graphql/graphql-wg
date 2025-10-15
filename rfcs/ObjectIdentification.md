# RFC: Object Identification

**Proposed by:** [Lenz Weber-Tronic](https://github.com/phryneas) - Apollo

## Problem statement

Currently, there is no way for clients to know if an object can be uniquely identified. This makes it hard for clients to implement caching strategies that rely on object identity for normalization, or for AI agents that need to communicate with other systems, referencing objects returned from a GraphQL API.

This is in part solved by patterns like [Global Object Identification](https://graphql.org/learn/global-object-identification/), but this is nothing clients can generally rely on, since there is no guarantee that a server actually follows this pattern or just accidentally overlaps with it, without actually fully implementing it.

Also, the Global Object Identification pattern is not enough for the use case of a Client without schema knowledge - such a client couldn't inject a selection for `id` into all object selections (as they usually do with `__typename`), since it doesn't know which objects actually have an `id` field and the resulting query might be invalid.

## Proposal

### Introduction of an `__id` introspection field

This proposal introduces a new introspection field `__id`, which can be queried on any object, interface or union type.
The field is of type `ID` and for each individual type, the field must either always return a non-null value or always return null.

If an `__id` field returns a non-null value for a type, this value must be guaranteed to uniquely identify the object when combined with the value of the `__typename` field.

This would allow clients without schema knowledge to query for `__id` on selection set and use the returned value for caching or referencing the object in other systems, if it is not `null`.
As a result, this would remove the need for manual configuration like Apollo Client's [`keyFields` type policies](https://www.apollographql.com/docs/react/caching/cache-configuration#customizing-cache-ids) or urqls's [Custom Keys](https://nearform.com/open-source/urql/docs/graphcache/normalized-caching/#custom-keys-and-non-keyable-entities), which are currently needed to tell the client which fields to use for identifying an object.
These configurations are often a source of bugs, since they can be forgotten or misconfigured, or simply may not keep up with an evolving schema.

### Intoduction of an `__Entity` interface

In addition to the `__id` field, this proposal also introduces a new introspection interface `__Entity`, which is defined as follows:

```graphql
interface __Entity {
    __id: ID!
}
```

This interface could be used by clients with schema knowledge (such as Apollo Kotlin or Apollo iOS) at build time to decide if a certain type can be uniquely identified (and thus, stored in a normalized way) or not.

This interface may be implicitly added to objects that implement a way to resolve the `__id` field to a non-null value, depending on the server implementation.
Alternatively, implementers might also choose to explicitly add the interface to types that can be uniquely identified.

### Presence of globally identifiable types in the schema

To allow clients to detect if a server supports this feature, the value of the `__id` field on the `Query` type should be specified as well:

* If a server does not have any types with a non-null `__id` field, the `__id` field on the `Query` type should return `null`.
* If a server has at least one type with a non-null `__id` field, the `__id` field on the `Query` type should return a non-null value (the suggestion would be `"ROOT_QUERY"`, if we are to specify the exact value).

This could be used by clients to detect if the server supports the feature at all, and if it doesn't, they could choose to omit querying for the `__id` field in future requests to save bandwidth.


## Suggested Spec addition

To be inserted after the "Type Name Introspection" section in `spec/Section 4 -- Introspection.md`

````md
## Object Identification

GraphQL supports Object Identification via the meta-field `__id: ID` on any 
Object, Interface, or Union.

This field returns:
* `null`, if the object does not have a unique identifier in the context of its 
type, or if the schema doesn't support Object Identification in general.
* a non-null ID that in combination with the object's type name is globally unique.

For every type, `__id` must either always return `null` or never return `null`.

As a meta-field, `__id` is implicit and does not appear in the fields list in
any defined type.

The value of `__id` on the `Query` type is defined to either be `ROOT_QUERY` if 
the schema supports Object Identification, or `null` if it does not. This guarantee 
can be used to introspect whether a schema supports Object Identification in general.

Note: `__id` may not be included as a root field in a subscription operation.

## Identifiable types

Identifiable types may also implement the `__Entity` interface, which is defined as follows:

```graphql
interface __Entity {
    __id: ID!
}
```

A server might choose to implicitly add this interface to types that implement a way to resolve the `__id` field to a non-null value.
````
