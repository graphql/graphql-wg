# RFC: Disable Error Propagation Directive

**Proposed by:** [Martin Bonnin](https://github.com/martinbonnin)

**See also:** [Original proposal/spec edits by Benjie](https://github.com/graphql/graphql-spec/pull/1050)

**Implementation PR**: https://github.com/graphql/graphql-js/pull/4348

This RFC proposes adding a new directive `@disableErrorPropagation` that allows clients to disable error propagation for specific operations in their GraphQL queries.

## 📜 Problem Statement

In GraphQL, nullability serves two distinct purposes:

1. **Semantic null**: Indicating that a field can have a legitimate "null" value (e.g., a user without an avatar)
2. **Error handling**: Allowing errors to propagate up through nullable parent fields

This coupling of nullability and errors makes it difficult for clients to distinguish between semantic nulls and error states by looking at the schema. When a field resolver throws an error and the field is non-nullable, the error propagates up through parent fields until it reaches a nullable field, potentially nullifying a large portion of the response.

While this behavior helps maintain data consistency guarantees, there are cases where clients may want more granular control over error propagation, particularly when partial data is preferable to no data.

### Current Behavior

Consider this schema:

```graphql
type User {
  id: ID!
  name: String
  posts: [Post!]!
  optionalPosts: [Post!]
}

type Post {
  id: ID!
  title: String!
  content: String
}
```

If a resolver for `Post.title` throws an error:
1. The error is added to the `errors` array in the response
2. Since `title` is non-nullable (`String!`), its parent `Post` object must be null
3. Since the array items are non-nullable (`[Post!]`), the entire `posts` array must be null
4. Since `posts` is non-nullable (`[Post!]!`), its parent `User` object must be null
5. This continues up the response tree until reaching a nullable field

For the `optionalPosts` field, which is nullable (`[Post!]`), the propagation would stop at that field, setting it to null.

This behavior ensures type safety but can lead to situations where a single error in a deeply nested non-nullable field causes a large portion of the response to be nullified, even when the remaining data might still be useful to the client.

### Use Cases

1. **Normalized Cache Protection**: When clients like Relay maintain a normalized cache, error propagation can cause cache corruption. For example, if two different queries fetch the same entity but one query errors on a non-nullable field, the error propagation can cause valid data from the other query to be nullified in the cache. Disabling error propagation allows clients to preserve valid data in their normalized caches while still handling errors appropriately.

2. **Partial Data Acceptance**: In some applications, receiving partial data with errors is preferable to receiving null. For example, in a feed-style application, if one post fails to load, the client might still want to display the other posts.

3. **Fine-grained Error Control**: Clients may want to specify different error handling behaviors for different parts of their queries based on their application requirements.

## ✅ RFC Goals

- Provide a way for clients to disable error propagation for specific operations
- Help uncouple nullability and error handling in GraphQL
- Support the transition to more semantically accurate nullability in schemas
- Maintain backward compatibility with existing GraphQL behavior
- Keep the implementation simple and focused

## 🚫 RFC Non-goals

- This is not intended to be a general-purpose error handling solution

## 🧑‍💻 Proposed Solution

Add a new directive `@disableErrorPropagation` that can be applied to operations in executable documents:

```graphql
directive @disableErrorPropagation on QUERY | MUTATION | SUBSCRIPTION

query GetUserPosts @disableErrorPropagation {
  user {
    id
    name
    posts {
      id
      title
      content
    }
  }
}
```

When this directive is present on an operation:
1. Errors thrown during execution will still be added to the `errors` array
2. The errors will not cause nullability violations to propagate up through parent fields

### Example

Given these types:

```graphql
type User {
  id: ID!
  name: String
  posts: [Post!]!
}

type Post {
  id: ID!
  title: String!
  content: String
}
```

And this query:

```graphql
query GetUserPosts @disableErrorPropagation {
  user {
    id
    name
    posts {
      id
      title
      content
    }
  }
}
```

If the `title` resolver for one of the posts throws an error:

**Current behavior** (without directive):
```json
{
  "data": null,
  "errors": [
    {
      "message": "Failed to load title",
      "path": ["user", "posts", 0, "title"]
    }
  ]
}
```

**With @disableErrorPropagation**:
```json
{
  "data": {
    "user": {
      "id": "123",
      "name": "Alice",
      "posts": [
        {
          "id": "post1",
          "title": null,
          "content": "Some content"
        }
      ]
    }
  },
  "errors": [
    {
      "message": "Failed to load title",
      "path": ["user", "posts", 0, "title"]
    }
  ]
}
```

## 🛠️ Implementation Considerations

The implementation requires changes to the execution algorithm in graphql-js:

1. During operation execution, check if the operation has the `@disableErrorPropagation` directive
2. If present, modify error handling to prevent propagation while still collecting errors
3. Return field values as-is, even if errors occurred

While this proposal focuses on a simple boolean directive, future extensions might consider additional error behaviors:

- `PROPAGATE`: Current default behavior (errors propagate up)
- `NULL`: Replace errored positions with null
- `ABORT`: Abort the entire request on any error

These additional behaviors are not part of this proposal but may be considered in future iterations.

## 🗺️ Migration Path

For client authors wishing to adopt this feature:

1. Ensure your GraphQL server implementation supports `@disableErrorPropagation`. Clients can check for directive support by looking for the existence of the directive on introspection.
2. Update client code to handle both nulls and errors appropriately.
3. Add the directive to operations where you want to prevent error propagation. Many clients, especially those with normalized caches, will wish to apply `@disableErrorPropagation` to all operations.

For schema authors wishing to adopt this feature:

1. Update servers to a version that has support for `@disableErrorPropagation`

Once upgraded, schema authors may feel more comfortable using non-nullable fields. We'll want to keep an eye on that and how it affects developers using older or simpler clients.

## 🤔 Alternatives Considered

### Configurable Error Behavior

Instead of a simple boolean directive, we could provide an enum of error behaviors:

```graphql
enum ErrorBehavior {
  """
  Non-nullable positions that error cause the error to propagate to the nearest nullable
  ancestor position. The error is added to the "errors" list.
  """
  PROPAGATE

  """
  Positions that error are replaced with a `null` and an error is added to the "errors"
  list.
  """
  NULL

  """
  If any error occurs, abort the entire request and just return the error in the "errors"
  list. (No partial success.)
  """
  ABORT
}

directive @errorBehavior(behavior: ErrorBehavior!) on QUERY | MUTATION | SUBSCRIPTION
```

The simple boolean `@disableErrorPropagation` directive was chosen as it:
- Addresses the most common use case (wanting partial data)
- Maintains GraphQL's existing error representation
- Is simple to implement and understand
- Leaves room for future extensions if more sophisticated error handling patterns prove necessary

## 📝 Conclusion

The `@disableErrorPropagation` directive provides a simple but powerful way for clients to control error propagation behavior. While it doesn't solve all error handling challenges, it represents an important step toward uncoupling nullability and errors in GraphQL. This allows for more precise schema design while maintaining backwards compatibility for existing clients.
