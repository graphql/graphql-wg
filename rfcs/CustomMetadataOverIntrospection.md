RFC: Custom Metadata Over Introspection
----------

TBD: Description

### Contributing

To help bring this idea to reality, you can contribute [PRs to this RFC document.](https://github.com/graphql/graphql-wg/edit/main/rfcs/CustomMetadataOverIntrospection.md)

# Problem Statement

TBD

# Prior Art

Please feel free to submit example of how other technologies provides such functionality.

# Solution Criteria

This section sketches out the potential goals that a solution might attempt to fulfill.
These goals will be evaluated with the [GraphQL Spec Guiding Principles](https://github.com/graphql/graphql-spec/blob/main/CONTRIBUTING.md#guiding-principles) in mind.
Passing or failing a specific criteria is NOT the final word. Both the Criteria _and_ the Solutions are up for debate.

## A. It should be possible subselect metadata values

Following general GraphQL principle clients should ask only data that they are interested in.
Note: it should work both for top-level metadata values and also different fields inside this value.
Good example of why it needed is a top-level "translation" value that can includes dozens of sub-fields one for each language.

## B. It should be possible to dump all metadata

Some clients (e.g. GraphQL proxies, schema stores, etc.) should have ability to dump all data required to generate exactly the same introspection result as original server.

## C. It should be possible to deprecate specific metadata value using existing deprecation mechanism

Note: It should be possible to deprecate both "metadata usage" and "metadata definition" separately.

## D. Metadata value should be typed and introspecatable

## E. It should be possible to attach semantic meaning to a "metadata" using existing "specifyByURL" mechanism

## F. Metadata values should have descriptions as part of introspection

## G. It should be possible to attach metadata to metadata defintions

## H. Implementation details shouldn't be exposed as metadata
