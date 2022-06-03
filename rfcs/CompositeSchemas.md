# RFC: GraphQL Composite Schemas

There's a _lot_ of different ways of combining multiple GraphQL schemas together to form a larger composite schema, and the wide variety of options can make it challenging to design schemas in a way that will be easy to compose later. To name but a few approaches:

- Schema merging and stitching (various implementations in many languages)
- GraphQL modules and other "extend type"-based approaches
- Federation (Apollo's v1 and v2, Mercurius, WunderGraph, Hot Chocolate, etc)
- Hasura's GraphQL Joins
- Atlassian's Nadel

Though these are all separate solutions to similar problems, there are various concerns that most of them have to consider:

- Identifying the schemas to join
- Discovering/defining the relationships between the types/schemas
- Schema manipulation to avoid conflicts (e.g. renaming types/fields)
- Resolving questions around type "ownership", redundancy and/or sharing; detecting conflicts
- Detecting breaking changes
- Actually fetching the relevant data, and combining it to fulfil the GraphQL request
- Managing composition metadata with respect to handling the above concerns
- etc

It feels like it would be of benefit to the ecosystem at large if there were a shared specification that covers a few of these needs.

If this is of interest to you, please enter your name, GitHub handle, and organization below:

| Name              | GitHub        | Organization     | Location            |
| :---------------- | :------------ | :--------------- | :------------------ |
| Benjie Gillam     | @Benjie       | Graphile         | Chandler's Ford, UK |
| Yaacov Rydzinski  | @yaacovCR     | Individual       | Neve Daniel, IL     |
| Roman Ivantsov    | @rivantsov    | Microsoft        | Redmond, WA, US     |
| Tim Suchanek      | @timsuchanek  | GraphCDN         | Berlin, DE          |
| Saihajpreet Singh | @saihaj       | The Guild        | Ottawa, ON, CA      |
| Matteo Collina    | @mcollina     | NearForm         | Forlì, IT           |
| Uri Goldshtein    | @urigo        | The Guild        | Tel Aviv, IL        |
| Marc-Andre Giroux | @xuorig       | Netflix          | Montreal, Canada    |
| Praveen Durairaju | @praveenweb   | Hasura           | Bangalore, India    |
| Hugh Willson      | @hwillson     | Apollo           | Ottawa, ON, CA      |
| Michael Staib     | @michaelstaib | ChilliCream Inc. | Zurich, CH          |
| Nicholas DeJaco   | @ndejaco2     | Amazon           | Seattle, WA, US     |
| Julian Mayorga    | @okjulian     | GraphQLApps      | RS, Brazil          |
