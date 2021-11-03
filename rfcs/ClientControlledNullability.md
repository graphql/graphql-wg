# RFC: Client Controlled Nullability

**Proposed by:**

- [Alex Reilly](<social or github link here>) - Yelp iOS
- [Liz Jakubowski](https://github.com/lizjakubowski) - Yelp iOS
- [Mark Larah](https://github.com/magicmark) - Yelp Web
- [Sanae Rosen](<social or github link here>) - Yelp Android
- [Stephen Spalding](https://github.com/fotoetienne) - Netflix GraphQL Server Infrastructure
- [Wei Xue](https://github.com/xuewei8910) - Yelp iOS
- [Young Min Kim](https://github.com/aprilrd) - Netflix UI

This RFC proposes a syntactical construct for GraphQL clients to express that fields in an operation are **non-null**.

## Definitions

- **Nullability**. A feature of many programming languages (eg [Swift](https://developer.apple.com/documentation/swift/optional),
  [Kotlin](https://kotlinlang.org/docs/null-safety.html#nullable-types-and-non-null-types), [SQL](https://www.w3schools.com/sql/sql_notnull.asp))
  that is used to indicate whether or not a value can be `null`.

  Nullability language constructs (e.g. `?` in Swift/Kotlin) have become popular due to their ability to solve ergonomic
  problems in programming languages, such as those surrounding `NullPointerException` in Java.

- **Codegen**. Short for "code generation", in this proposal refers to tools that generate code to facilitate using
GraphQL on the client. GraphQL codegen tooling exists for many platforms:
  - [Apollo](https://github.com/apollographql/apollo-tooling#code-generation) has a code generator for Android (Kotlin)
    and iOS (Swift) clients
  - [The Guild](https://www.graphql-code-generator.com/) has a TypeScript code generator for web clients

  GraphQL codegen tools typically accept a schema and a set of documents as input, and output code in a language of
  choice that represents the data returned by those operations.

  For example, the Apollo iOS codegen tool generates Swift types to represent each operation document, as well as model types
  representing the data returned from those queries. Notably, a nullable field in the schema becomes an `Optional`
  property on the generated Swift model type, represented by `?` following the type name.

  In the example below, the `Business` schema type has a nullable field called `name`.
  ```graphql
  # Schema
  type Business {
    # The unique identifier for the business (non-nullable)
    id: String!
  
    # The name of the business (nullable)
    name: String
  }

  # Document
  query GetBusinessName($id: String!) {
    business(id: $id) {
      name
    }
  }
  ```
  At build time, Apollo generates the following Swift code (note: the code has been shortened for clarity).
  ```swift
  struct GetBusinessNameQuery {
    let id: String

    struct Data {
      let business: Business?

      struct Business {
        /// Since the `Business.name` schema field is nullable, the corresponding codegen Swift property is `Optional`
        let name: String?
      }
    }
  }
  ```
  The query can then be fetched, and the resulting data handled, as follows:
  ```swift
  GraphQL.fetch(query: GetBusinessNameQuery(id: "foo"), completion: { result in
    guard case let .success(gqlResult) = result, let business = gqlResult.data?.business else { return }

    // Often, the client needs to provide a default value in case `name` is `null`.
    print(business?.name ?? "null")
  }
  ```

## 📜 Problem Statement

In our experience, client developers have been frustrated that the vast majority of fields are nullable.
We’ve done this in accordance with official best practice, and we largely agree that this is good practice. 
From the [official GraphQL best practice](https://graphql.org/learn/best-practices/#nullability):

> This is because there are many things that can go awry in a networked service backed by databases and other
> services. A database could go down, an asynchronous action could fail, an exception could be thrown. Beyond
> simply system failures, authorization can often be granular, where individual fields within a request can
> have different authorization rules.

The problem with the SDL nonNull (!) is that it eliminates the possibility of partial failure on a given type.
This forces the SDL author to decide for which fields partial failure is acceptable. A GraphQL schema author 
may not be in the best position to decide whether partial failure is acceptable for a given canvas.

While the schema can have nullable fields for valid reasons (such as federation), in some cases the client wants 
to decide if it accepts a `null` value for the result to simplify the client-side logic.

## 🧑‍💻 Proposed Solution

A client-controlled Non-Null designator.

## 🎬 Behavior

The proposed client-controlled Non-Null designator would have identical semantics to the current 
SDL-defined [Non-Null](https://spec.graphql.org/June2018/#sec-Errors-and-Non-Nullability). Specifically:

  - If the result of resolving a field is null (either because the function to resolve the field returned null
or because an error occurred), and that field is of a Non-Null type,
**or the operation specifies this field as Non-Null**,
then a field error is thrown. The error must be added to the "errors" list in the response.

  - Since Non-Null type fields cannot be null, field errors are propagated to be handled by the parent field. 
If the parent field may be null then it resolves to null, otherwise the field error
is further propagated to its parent field.

  - If all fields from the root of the request to the source of the field error return Non-Null types or are 
    specified as Non-Null in the operation, then the "data" entry in the response should be null.

## ✏️ Proposed syntax

The client can express that a schema field is required by using the `!` syntax in the operation definition:
```graphql
query GetBusinessName($id: String!) {
  business(id: $id) {
    name!
  }
}
```

### `!`

We have chosen `!` because `!` is already being used in the GraphQL spec to indicate that a field in the schema
is non-nullable, so it will feel familiar to GraphQL developers.

## Use cases

## ✅ RFC Goals

- Non-nullable syntax that is based off of syntax that developers will already be familiar with
- Enable GraphQL codegen tools to generate more ergonomic types

## 🚫 RFC Non-goals

## 🗳️ Alternatives considered

### A `@nonNull` official directive

This solution offers the same benefits as the proposed solution. Since many GraphQL codegen tools already support the `@skip` and `@include` directives, this solution likely has a faster turnaround.

### A `@nonNull` custom directive

This is an alternative being used at some of the companies represented in this proposal for the time being.

While this solution simplifies some client-side logic, it does not meaningfully improve the developer experience for clients.

* The cache implementations of GraphQL client libraries also need to understand the custom directive to behave correctly. Currently, when a client library caches a null field based on an operation without a directive, it will return the null field for another operation with this directive.
* For clients that rely on codegen, codegen types typically cannot be customized based on a custom directive. See https://github.com/dotansimha/graphql-code-generator/discussions/5676 for an example. As a result, the optional codegen properties still need to be unwrapped in the code.

This feels like a common enough need to call for a language feature. A single language feature would enable more unified public tooling around GraphQL.

### Make Schema Fields Non-Nullable Instead

It is intuitive that one should simply mark fields that are not intended to be null as non-null in the schema.
For example, in the following GraphQL schema:

```graphql
    type Business {
      name: String
      isStarred: Boolean
    }
```

If we intend to always have a name and isStarred for a Business, it may be tempting to mark these fields as Non-Null:

```graphql
    type Business {
      name: String!
      isStarred: Boolean!
    }
```

Marking Schema fields as non-null can introduce particular problems in a distributed environment where there is a possibility
of partial failure regardless of whether the field is intended to have null as a valid state.

When a non-nullable field results in null, the GraphQL server will recursively step through the field’s ancestors to find the next nullable field. In the following GraphQL response:

```json
{
  "data": {
    "business": {
      "name": "The French Laundry",
      "isStarred": false
    }
  }
}
```

If isStarred is non-nullable but returns null and business is nullable, the result will be:

```json
{
  "data": {
    "business": null
  }
}
```

Even if name returns valid results, the response would no longer provide this data. If business is non-nullable, the response will be:
```json
{
  "data": null
}
```

In the case that the service storing user stars is unavailable, the UI may want to go ahead and render the component 
without a star (effectively defaulting isStarred to false). Non-Null in the schema makes it impossible for the client 
to receive partial results from the server, and thus potentially forces the entire component to fail rendering.

More discussion on [when to use non-null can be found here](https://medium.com/@calebmer/when-to-use-graphql-non-null-fields-4059337f6fc8)

Additionally, marking a field non-null is not possible in every use case. For example, when a developer is using a 
3rd-party API such as [Github's GraphQL API](https://docs.github.com/en/graphql) they won't be able to alter Github's
schema, but they may still want to have certain fields be non-nullable in their application.

### Write wrapper types that null-check fields
This is the alternative being used at some of the companies represented in this proposal for the time being.
It's quite labor intensive and the work is quite rote. It more or less undermines the purpose of
having code generation.

### Alternatives to `!`
#### `!!`
This would follow the precedent set by Kotlin.

### Make non-nullability apply recursively
For example, everything in this tree would be non-nullable
```graphql
query! {
  business(id: 4) {
    name
  }
}
```

## 🙅 Syntax Non-goals

This syntax consciously does not cover the following use cases:

- **Default Values**
  The syntax being used in this proposal causes queries to error out in the case that
  a `null` is found. As an alternative, some languages provide syntax (eg `??` for Swift)
  that says "if a value would be `null` make it some other value instead". We are
  not interested in covering that in this proposal.
  
## Work Items
Patches that will need to be made if this proposal is accepted. The 
[RFC proposal process](https://github.com/graphql/graphql-spec/blob/main/CONTRIBUTING.md)
requires that a proof of concept is implemented in a GraphQL library. As work items are completed,
PRs will be linked here.
- Spec Changes
- Official Libraries
  - GraphQL.js: https://github.com/graphql/graphql-js/pull/2824
- 3rd Party Libraries
  - [Apollo Android](https://github.com/apollographql/apollo-android)
    - Code Gen
    - Cache
  - [Apollo iOS](https://github.com/apollographql/apollo-ios)
    - Code Gen
    - Cache
  - [Apollo JS](https://github.com/apollographql/apollo-client)
    - Code Gen
    - Cache
  - [GraphQL Code Generator by The Guild](https://github.com/dotansimha/graphql-code-generator)