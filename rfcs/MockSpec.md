# GraphQL Response Mocking Specification

*Working Draft - January 2026*

```graphql
directive @mock(name: String) on QUERY | MUTATION | SUBSCRIPTION
```

# Overview

This specification defines a mechanism for GraphQL clients to return mock
responses for operations without making network requests.

## Motivation

Frontend development often outpaces backend implementation. Developers may need
to build UI components against GraphQL operations before the server schema is
complete or before resolvers are implemented. This specification enables
developers to write and use queries immediately, with the client generating
plausible mock responses automatically.

This approach allows:

- Rapid prototyping without server dependencies
- Parallel frontend and backend development
- Testing edge cases and error states
- Demonstrations and design reviews with realistic data

A query using the `@mock` directive:

```graphql example
query GetBusinessInfo @mock {
  business(id: "123") {
    name
    rating
  }
}
```

Must return a mock response **without** making a network request:

```json example
{
  "data": {
    "business": {
      "name": "The Great British Bakery",
      "rating": 4.8
    }
  }
}
```

# Conformance

A conforming client implementation of GraphQL Response Mocking must fulfill all
normative requirements. Conformance requirements are described in this document
via both descriptive assertions and key words with clearly defined meanings.

## Schema-Aware vs Schema-Unaware Clients

Schema-unaware clients can adopt this specification with minimal friction, as
they do not need to reconcile mock operations against a schema.

Schema-aware clients face additional complexity: operations using the `@mock`
directive may reference types and fields not yet present in the server schema.
Such clients must patch their local schema to include these definitions, or
disable validation for mocked operations. The mechanism for schema patching is
outside the scope of this specification; contributions addressing this are
welcome for inclusion in a future version.

# The @mock Directive

The `@mock` directive indicates that an operation should return a mock
response instead of executing against a server.

```graphql example
query GetBusinessInfo @mock {
  business(id: "123") {
    name
  }
}
```

The optional `name` argument specifies which *mock name* to use from the
*mock file*. If omitted, the *default mock* is used.

```graphql example
query GetBusinessInfo @mock(name: "fetch_error") {
  business(id: "123") {
    name
  }
}
```

When a client encounters an operation with the `@mock` directive, it must not
send a network request. Instead, it must resolve the operation using the
corresponding *mock file*.

# Mock Files

## Mock File Location

Mock files must be stored in a `__graphql_mocks__` directory adjacent to the
source file containing the operation definition.

:: A *mock directory* is a directory named `__graphql_mocks__` located in the
same directory as the source file containing the operation.

For an operation named `GetBusinessInfo` defined in `BusinessDetails.js`:

```
.
├── __graphql_mocks__
│   └── GetBusinessInfo.json
└── BusinessDetails.js
```

## Mock File Naming

:: A *mock file* is a JSON file within the *mock directory* whose name
corresponds to an operation name.

The mock file for an operation must be named `{OperationName}.json`, where
`{OperationName}` is the name of the GraphQL operation.

## Mock File Structure

A mock file must contain a JSON object. Each key-value pair in this object
defines a named mock response.

:: A *mock name* is a key in the mock file's root JSON object. Mock names
beginning with two underscores (`__`) are reserved for this specification.

:: A *mock response* is the value associated with a *mock name*. It must be a
valid GraphQL response object as defined by the GraphQL specification.

:: The *default mock* is the mock response with the mock name `"__default__"`.

A mock response must conform to the
[GraphQL Response Format](https://spec.graphql.org/draft/#sec-Response-Format):

- It must contain a `"data"` key (which may be `null`)
- It may contain an `"errors"` key with an array of error objects
- It may contain an `"extensions"` key

Additionally, it may contain a `"__description__"` key which stores a
description of the response. This may be used when regenerating the
*mock response*.

```json example
{
  "__default__": {
    "data": {
      "business": {
        "name": "FakeBusiness",
        "rating": 4.2
      }
    }
  },
  "unrated": {
    "data": {
      "business": {
        "name": "FakeBusiness",
        "rating": null
      }
    },
    "__description__": "The business exists but has no rating."
  },
  "business_fetch_error": {
    "data": null,
    "errors": [{
      "path": ["business"],
      "message": "internal server error"
    }],
    "__description__": "There was a server error when fetching the business; return null at the root and an error."
  }
}
```

# Mock Resolution

When executing an operation with the `@mock` directive, a conforming client
must use the following algorithm.

ResolveMockedOperation(operation, mockName):

- Let {operationName} be the name of {operation}.
- Let {sourceFile} be the source file containing {operation}.
- Let {mockDir} be the path formed by appending {"/__graphql_mocks__"} to the
  directory of {sourceFile}.
- Let {mockFilePath} be {mockDir} joined with {operationName} and {".json"}.
- If the file at {mockFilePath} does not exist:
   - If automatic mock generation is enabled, call
     {GenerateDefaultMockFile(mockFilePath, operation)}.
   - Otherwise, raise a client error indicating the mock file is missing.
- Let {mocks} be the parsed JSON content of the file at {mockFilePath}.
- If {mocks} does not contain a key matching {mockName}:
   - Raise a client error indicating the requested mock name was not found.
- Return the *mock response* for {mockName} in {mocks}.

# Automatic Mock Generation

When a *mock file* does not exist for an operation, conforming clients must
generate one automatically. This is the primary workflow: developers write
queries and the client produces plausible responses without manual intervention.

GenerateDefaultMockFile(mockFilePath, operation):

- Let {mockDir} be the parent directory of {mockFilePath}.
- If {mockDir} does not exist, create it.
- Let {defaultResponse} be a generated mock response for {operation}.
- Let {mockContent} be a JSON object with a single key {"__default__"} whose
  value is {defaultResponse}.
- Write {mockContent} to {mockFilePath}.
- Return {mockContent}.

## Generation Strategies

The mechanism for adding mock responses is implementation-defined.

It is recommended that implementers provide a workflow for developers to use
a Large Language Model (LLM) to generate contextually appropriate mock data based
on field names, types, and surrounding context. Detail is provided on this in the
[Agent Tooling](#sec-Agent-Tooling) section below.

# Mock Validation

## Query Changes

As development progresses, the shape of a query may change — fields may be added,
removed, or renamed. When this happens, an existing *mock response* may no
longer be a valid response for the query. Conforming clients must detect when a
*mock response* is incompatible with its operation and force corrective action.

Mocks must be validated as part of the application test suite.

Note: It is possible to detect if a JSON payload is valid for a given operation
by constructing an in-memory GraphQL server that has no resolvers, and uses the
JSON payload as its {rootValue} - and ensuring no errors are thrown for execution
of the operation against the test server.

GraphQL clients may warn or throw for an invalid *mock response*. Implementors
must detect this, and similarly force corrective action (e.g. by forcing the
user to regenerate or the fix the *mock repsonse* in the *mock file*).

## Missing Mock Name

If the requested *mock name* does not exist in the *mock file*, the client must
raise an error indicating the available mock names.

## Invalid Mock Response

If a *mock response* does not conform to the GraphQL response format, client
behavior is implementation-defined. Clients should validate mock responses and
provide helpful error messages during development.

# Client Integration

A conforming client must intercept operations containing the `@mock` directive
before any network layer processing. The mock response must be returned through
the same interface as a real server response, ensuring transparent substitution.

Note: This allows existing application code to work identically whether using
mocked or real responses, facilitating testing and development workflows.

## Static Test Usage

Mock files may also be imported directly for use in static test environments.
For example, test utilities that accept pre-defined mock responses can import
from the *mock file* to ensure consistency between runtime mocking and test
fixtures.

```javascript example
import GetBusinessInfoMocks from './__graphql_mocks__/GetBusinessInfo.json';

// Use in a test provider
<MockedProvider mocks={[
  {
    request: { query: GET_BUSINESS_INFO, variables: { id: "123" } },
    result: GetBusinessInfoMocks.__default__
  }
]}>
  <BusinessDetails id="123" />
</MockedProvider>
```

This pattern keeps mock data centralized and avoids duplication between
development-time mocking and test-time mocking.

# Agent Tooling

This specification is designed to work well with LLM-based coding agents.
Developers using agents can request new mock variants conversationally.

For example, a developer may add a mock with the following prompt:

```example
"add a mock response for GetBusinessInfo where the rating field returns an
error"
```

## Agent Skills

Implementers of this specification should provide an
[Agent Skill](https://agentskills.io/home) conforming to the Agent Skills
Specification. This allows coding agents to discover and use mock management
capabilities.

**Non-Normative: Suggested Agent Skill**

The following is a suggested `SKILL.md`. Implementers are welcome to replace or
adapt this prompt to suit their implementation.

```markdown
---
name: gql-mock-manager
description: Create and edit mock responses for GraphQL operations using the @mock directive
---

This skill manages mock responses for GraphQL operations using the `@mock`
directive.

## Capabilities

- **Add mock variant**: Create a new named mock response for an existing
  operation
- **Modify mock**: Update an existing mock response
- **List mocks**: Show available mock names for an operation

## File Structure

Mock files are located in `__graphql_mocks__/{OperationName}.json` adjacent to
the source file containing the operation.

Each mock file is a JSON object where keys are mock names and values are
GraphQL response objects with `data`, `errors`, and/or `extensions` fields.

Additionally, there is an optional `__description__` field which you must add
for all non-default mock responses.

The `__default__` key is the default mock used when `@mock` is called without
a `name` argument.

\`\`\`json
{
  "__default__": {
    "data": {
      "business": {
        "name": "The Great British Bakery",
        "rating": 4.8"
      },
    },
    "__description__": "A fully complete response for the query."
  },
  "not_found": { "data": ... },
  "no_rating": { "data": ... },
}
\`\`\`

## Instructions

When asked to add a mock variant:

1. Locate the operation's mock file
2. Read the existing mock file to understand the response shape
3. Create a new entry with a descriptive mock name
4. Ensure the response includes appropriate `data` and/or `errors` fields
5. Add a summary of the user's prompt to the `__description__` field
6. Write the updated mock file

When the mock should represent an error state, use the GraphQL errors format -
unless you know that the schema uses a union to represent error state. You must
check against the schema.

Example error:

\`\`\`json
{
  "data": { "fieldName": null },
  "errors": [{
    "path": ["fieldName"],
    "message": "field error"
  }]
}
\`\`\`

## Schema

Look for the GrpahQL schema in <root>/schema.graphql to understand what
shape of data should be returned. Use plausible and realistic values (i.e.
avoid "foo", "bar", "myBusiness", "string" as values.)

## Example

User: "Add a mock for GetBusinessInfo where the business is not found"

Action: Add to (or create) `./__graphql_mocks__/GetBusinessInfo.json`:

\`\`\`json
"not_found": {
  "data": { "business": null },
  "errors": [{
    "path": ["business"],
    "message": "Business not found"
  }],
  "__description__": "the business did not exist - return null for business and a corresponding error in the errors array"
}
\`\`\`
```
