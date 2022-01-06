# RFC: Fragment Modularity

**Proposed by:**
- [Matt Mahoney](https://github.com/mjmahone) - Facebook

**Contributors:**
- [Joe Savona](https://github.com/josephsavona) - Facebook
- [Jordan Eldredge](https://github.com/captbaritone) - Facebook
- You?

GraphQL was originally designed to support building mobile applications, where for performance reasons applications need to fetch the minimum amount of data needed for a given UI surface and aggregate requests into fewer network requests. In parallel with GraphQL’s evolution, component-oriented UI frameworks (ie React) gained traction, supporting a style in which applications could be broken down into modular, reusable components. GraphQL fragments were a natural way for components to describe their data dependencies in a *mostly* modular and reusable way, and Relay and other GraphQL clients have taken this approach to its logical extreme and use fragments as a fundamental unit in their APIs and architectures.

## Problem Statement

Unfortunately the “fragments are like components but for data” analogy breaks down because — unlike UI components in typical frameworks — **fragments are not truly reusable or modular**. We discuss reusability in other RFCs, but this RFC focuses specifically on fragment’s lack of **modularity**. The core challenge is that in GraphQL-the-spec, fragments are facades: `...Foo` is no different than having copy-pasted the selections of `Foo` (and its type condition) at the same location. This “spread” or inlining behavior breaks encapsulation of fragments and causes several concrete challenges to designing robust GraphQL clients, and in turn to application developers:

* Developers cannot reason about fragments in isolation. Because the results of a fragment are spread/inlined at their usage site, GraphQL requires global validations such as preventing conflicting fields/arguments at a given path in the response. Developers frequently have to come up with arbitrary aliases for fields as a way to avoid accidental collisions with unrelated code — breaking encapsulation.
* Similarly, build tools must implement these whole-program validations, making the cost to changes O(codebase) rather than O(changed fragment). Because any change to a fragment could break the no-conflicting-aliases rule, any change to any fragment has to be checked against all the operations that transitively reference that fragment. Developers see this in the form of slower builds and slower tools, and rightfully attribute this as GraphQL introducing friction in their develpment process.
* At runtime, code cannot easily inspect query results to determine whether a fragment spread or inline fragment was fulfilled or not (for fragments that may be conditionally fulfilled based on their type). There is also no way to refer to the data for a specific fragment in a response: in a response for `{a, ...Foo}` there is no way for code to reference the value that contains the results for `Foo` other than to point to the entire response value, which happens to also contain `a`.

For the latter, the best workaround we have found is to inject a meta-field for each fragment spread (ie querying `__isFragmentName: __typename` for each fragment) and then checking the existence of this key in the response. However, this does not provide a clear way to refer to the results of a particular fragment (ie to pass that result to a child UI component) and has limitations with typical type systems when trying to determine which fragments were or were not evaluated.

For example, given the following fragments:

```
fragment Foo on Actor {
  ...Bar
  ... on HasName {
    name
  }
  id
}

fragment Bar on HasPhoto {
  photo { uri }
}
```

There is no obvious way to determine whether the `...Bar` or `... on HasName` selections were evaluated or not. Ideally, developers could do something like `if (foo.HasName) { let name = foo.HasName.name }` or `if (foo.Bar) { /* render Bar component with foo.Bar */ }`, but this is only currently possible if a GraphQL client adds an intermediate API and does not directly match the GraphQL response shape. In other words, clients face an ongoing tension in which accurately modeling GraphQL features such as fragments and type refinements requires abandoning GraphQL’s “what you query is what you get” query/response correspondence.

## Goal

Our goal with this proposal is to address fragment modularity and the three main challenges above. Specifically:

* GraphQL should provide a first-class syntax for using fragments in a modular way, such that developers can reason locally about fragments as they do with UI components. It should be easy to write code such that by design it cannot violate no-conflicting-alias rule.
* Similarly, build tools should be able to exploit this property to avoid whole-program checks when fragments are spread using the modular syntax.
* Finally, the new syntax would offer developers a way to easily check which fragments are fulfilled, and refer precisely to the results of a fragment without any unrelated sibling field data.

## Prior Art

This is not the first time people have argued that a truly modular approach to fragments would improve the language:

* During GraphQL’s conception, there was debate on whether fragments should be included in the response via copy-paste/merge operations or via independent keys/composition: https://github.com/graphql/graphql-spec/issues/137#issuecomment-170184907
* Fragment merging concretely required a complex update to our field-merging validation: https://github.com/graphql/graphql-spec/commit/d481d173749a03e342434070d14fb47116272dfa

## Related Issues

* Fragment Arguments: https://github.com/graphql/graphql-spec/pull/865
* Client Controlled Nullability: https://github.com/graphql/graphql-spec/pull/895
* Error Boundaries (see discussion in Client Defined Nullability)

## Solution Space: Modularity via fragment response keys

TL;DR: We want to move selection sets towards a model of composing child fragments, as Relay and other native clients already provide.

There are a few different ways we could tackle this problem. One thing people have reached for many times is adding a key into the response that “splits” a fragment’s sub-response into an explicitly keyed sub-tree.

So if we have GraphQL like:

```
fragment Foo on Actor {
  # replace these spreads with various syntax proposals below
  ...Bar
  ... on HasName {
    name
  }
  id
}
fragment Bar on HasAccount {
  account_name
}
```

We should get a response like:

```
{
  "Bar": {
    "account_name": "mjmahone"
  },
  "HasName": {
    "name": "Matt"
  },
  "id": 0
}
```

### Syntax #0: key all fragment “spreads”

This proposal basically says that responses by default would now add in a key for each fragment spread and inline fragment spread. So the document described above would have the response with keyed fragments, with no syntax changes needed.

This is very clearly not backwards compatible, but if we were redesigning a new version of GraphQL, might be something we’d want to consider.

**Option #0B: Use a directive to turn key-ness on/off**

If we’re convinced that by *default* fragments should be keyed, we could have some directive that changes the shape of the response, a la `...Foo @alias`. Lee Byron has noted that specification directives should probably not change the response shape: this is not a great option if we want to abide by that logic.

### Syntax #1: aliased spreads `Foo: ...Foo`

Allow people to opt-in to getting a keyed fragment sub-response by enabling fragment spreads (inline and named) to be aliased. This makes fragment spreads an alias-able value.

Example Executable:

```
fragment Foo on Actor {
  Bar: ...Bar
  HasName: ... on HasName {
    name
  }
  id
}
fragment Bar on HasAccount {
  account_name
}
```

If **every** fragment spread was aliased with the above syntax, then we’d have some neat request/response symmetry: every fragment, inline or not, would have their selection set’s response brackets exactly line up with **one** set of `{}` within the executable document.

Personally, this is @mjmahone's current favored potential solution to adding fragment keys to the response.

### Syntax #2: aliased object `Foo: { ...Foo }`

For this option, we’d allow arbitrary object aliasing. Dan Schafer found this syntax pleasant, as it provides a way to keep brackets matched between the executable document and response. On the other hand, that symmetry ignores that we *already* have mismatched brackets with inline fragment spreads.

Example Executable:

```
fragment Foo on Actor {
  Bar: {
    ...Bar
  }
  HasName: {
    ... on HasName {
      name
    }
  }
  name
}
fragment Bar on HasAccount {
 account_name
}
```

With this syntax, we could encapsulate arbitrary fields under an alias. However, we *already* can do that with untyped inline fragment spreads, a la `... { some_fields }`. It might be cleaner to start considering fragment definitions and inline fragments as "bracket creators" in the response to get the symmetry Dan found pleasing.

Solution #2 could be combined with the Solution #1 to allow arbitrary aliasing of both spreads and arbitrary selection sets, though that might cause more confusion than it would clear up.

### Syntax #3: special syntax instead of `...`

Given `...` right now has semantic meaning, essentially, of “copy paste conditionally based on type”, it might muddy meaning if we allowed that copy-paste semantic to be used in an aliased way. Therefore, it may be better to have a new syntax to mean “create a key for the inline fragment or fragment spread”. If we used the `&` symbol, we could have:


```
fragment Foo on Actor {
  &Bar
  & on HasName {
    name
  }
  id
}
```



Some options:

* **#Foo**: hashtag sort of means “link” on the web, but in GraphQL is overloaded already to mean “Comment this line”
* **@Foo**: similarly, `@` sort of means “link to this other thing”, but again is overloaded, this time for directive usage.
*  **&Foo**: `&` usually means reference in programming, and that’s kind of what we’re doing here: we’re saying “in this spot in the response, add a reference to the following fragment”. Unfortunately, in both JS and PHP ref values are usually associated with spaghetti code, so it might come off as looking bad
* Other options?

## Solution Space: Modularity via metadata

Another potential option would be to add metadata into the response to indicate which fragments were actually included. One shape of solution is via something like the [`__fulfilled` meta-field RFC](https://github.com/graphql/graphql-spec/pull/879). Any of these options have the downside of being essentially client compile-time only information, that means what the client needs in order to properly fulfill a product UI starts to stray from what the user actually writes.

### Metadata Option 1: Add a field that indicates whether a selection set was fulfilled

This is essentially the `__fulfilled` proposal in https://github.com/graphql/graphql-spec/pull/879

We could support pretty much any of the fragment-spread-syntax changes above by transforming a selection set like

```
{
  Foo: ...Foo
}
```

To something like


```
{
  ... on HasAccount {
    fulfilledFoo: __fulfilled
    ...Foo
  }
}
```

### Metadata Option 2: Add information into the response’s `extensions`

This adds metadata around which fragments were included in a response in `extensions`. It could be used in conjunction with a fragment-spread directive. A downside here is that we’ve just made a non-modular design (all fragments end up in the `extensions` key, not colocated with their other fragment fields within the response) in order to achieve some semblance of client-facing modularity.

## Solution Space: New Response Format

A core reason we originally chose not to have a fragment spread represented via a key in the response was due to a worry about duplicating fields many times in the response.

However, it’s possible that GraphQL the Ecosystem would improve if we had some alternative response designs. These responses could encapsulate **more** information than the existing Specification-described JSON response format. Basically, the requirement is likely just that we can go from this new response format to a perfectly valid Specification-described response without losing any Specification-described information, but we may not need to support the inverse (i.e. we could only go from a Spec-response to the New-response in a lossy way).


### Response Format Option 1: Graph Response

We might be able to have a more efficient design if the response came back in a Graph form, as opposed to in JSON tree form. You would probably still **access** the graph via tree-shaped structures in client code, but this would format the response similar to how most normalized GraphQL stores that keep data consistent across responses are formatted.

An example of a psuedo-syntax for a response from the query below:

```
query {
  me {
    id
    ...Bar
  }
}

fragment Bar on HasAccount {
  account_name
}
```

might look something like:


```
Query {
  me -> User:0
}

User:0 {
  id: 0
  account_name: "mjmahone"
  Bar -> User:0
}
```

In this world, the `Query.me` field points to a specific entity, `User` with `id` `0`.  `...Bar` is a fragment spread that also points to that same `User`. If for some reason `Bar` was unfulfilled in the query (i.e. `me` does not fulfill `HasAccount`), the fragment spread pointer could be null.

The above response format would require the server understanding how to merge two fields that logically represent the same value, but are present in two completely different places in the request tree. There are many potential ways to solve this problem: above, we're solving it by keying each entity by its type and some server-defined “primary key”, but we could make this entity key more explicit or even less formalized within the specification.

We could also combine the new graph response with a new fragment “key” syntax, such that regular fragment spreads still act as inheritance, and only the new keys end up in the graph response. However, given the lower cost for duplicated fields in a graph format, this may not be a major issue.
