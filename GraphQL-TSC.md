
# GraphQL Technical Steering Committee (TSC)

The GraphQL TSC will be responsible for all technical oversight of the open source projects. In particular, the TSC is responsible for approving official GraphQL specification releases and coordinating between projects.

## Technical Charter and Code of Conduct

The GraphQL TSC is governed by the [Charter](https://github.com/graphql/foundation/blob/master/GraphQL%20Specification%20Membership%20Agreement%20February%202019.pdf), which establishes the Committee and its basic principles and procedures.  The charter is designed to provide the TSC the freedom to govern itself in an efficient manner. This document establishes TSC policies and procedures.

In addition, as provided under the Technical Charter, GraphQL has adopted a [Code of Conduct](https://code-of-conduct.graphql.org) that applies to all GraphQL activities and spaces. If you believe there has been a violation of the GraphQL Code of Conduct, please contact [report@graphql.org](mailto:report@graphql.org).

## About the GraphQL Specification project

[GraphQL](https://graphql.org) is a query language for APIs and a runtime for fulfilling those queries with your existing data. GraphQL provides a complete and understandable description of the data in your API, gives clients the power to ask for exactly what they need and nothing more, makes it easier to evolve APIs over time, and enables powerful developer tools.

Development of the [GraphQL Specification](https://spec.graphql.org) is managed by the [GraphQL Spec Working Group](https://github.com/graphql/graphql-wg). This is the primary place where work is done on the GraphQL specification.

The GraphQL Specification hosts other projects, in addition to the main specification. Specification licensed under OWF 1.0 include:

* [GraphQL](https://spec.graphql.org)
* [GraphQL over HTTP](https://github.com/graphql/graphql-over-http)
* [GraphQL Scalars](https://github.com/graphql/graphql-scalars)

We also host implementations, which are licensed under MIT:

* [DataLoader](https://github.com/graphql/dataloader)
* [GraphiQL IDE](https://github.com/graphql/graphiql)
* [GraphQL HTTP Server Middleware (Express GraphQL)](https://github.com/graphql/express-graphql)
* [GraphQL Playground](https://github.com/graphql/graphql-playground)
* [GraphQL.js](https://github.com/graphql/graphql-js)
* [libgraphqlparser](https://github.com/graphql/libgraphqlparser)
* [Relay Library for GraphQL.js](https://github.com/graphql/graphql-relay-js)
* [SWAPI GraphQL Wrapper](https://github.com/graphql/swapi-graphql)
* [VSCode GraphQL extension](https://github.com/graphql/vscode-graphql)

Developers who are covered under a signed spec membership agreement are able to contribute to any GraphQL spec or project.

## TSC meetings

The GraphQL TSC will meet monthly, at the beginning of the [GraphQL Working Group meeting](https://github.com/graphql/graphql-wg). Our goal is to meet regularly to address any agenda items quickly and openly. By combining the TSC meeting with the open attendance Working Group meetings, we are ensuring that the broader community has visibility into the operations of the TSC, and vice versa.

To attend a GraphQL TSC meeting, you must follow the same process as other GraphQL meetings and open a PR to add your name to the list of attendees in the [meeting agenda](https://github.com/graphql/graphql-wg/tree/master/agendas). If you have not signed the GraphQL Specification Membership Agreement you will be prompted to do so. You cannot attend until you have completed this document, although you are welcome to listen to the replay on [YouTube](https://www.youtube.com/playlist?list=PLP1igyLx8foH30_sDnEZnxV_8pYW3SDtb).

### Scope

The TSC provides technical oversight for all GraphQL development efforts within the scope of the project. This includes:

* Approving formal releases of the [GraphQL Specification](https://spec.graphql.org).
* Approving new projects and working groups.
* Creating, transferring, organizing, and renaming GitHub repos under the [GraphQL org](https://github.com/graphql).
* Resolving technical or community issues that span multiple projects, or are deadlocked within a project.
* Delegating decisions on publishing releases.

The scope of the TSC should not include decisions that can be made within one of the projects, unless there is a specific issue that cannot be resolved and requires mediation. In general, the TSC prefers that decisions be made at the lowest possible level.

#### Decision-making authority

The following table is a rough outline of who is responsible for decisions. In keeping with the principle that decisions should be made at the lowest possible level and as efficiently as possible, unless there is a specific escalation to the TSC.

| Decision | Who decides | Can it be delegated? |
|---|---|---|
| Approve a GraphQL Specification release | TSC | No |
| Approve a sub-specification release | TSC or working group | Yes |
| Release a reference implementation | TSC or maintainers | Yes |
| Adding a new repo in the GraphQL organization | TSC | No |
| Changes to this document | TSC | No |



## Collaboration Tools

### Mailing List

The GraphQL TSC can be reached at [tsc@lists.foundation.graphql.org](https://lists.foundation.graphql.org/g/tsc). The mailing list is open to anyone who has signed the GraphQL Specification membership agreement (for [individual](https://individual-spec-membership.graphql.org/) or [corporate](https://corporate-spec-membership.graphql.org/) members), but anybody can view the archives.

### Slack

GraphQL maintains a [Slack](https://slack.graphql.org) for communication and collaboration, which is open for anyone to join. Once you join [Slack](https://slack.graphql.org), you can participate in any public channels.

### Calendars

GraphQL maintains a [public calendar](https://calendar.graphql.org) for TSC meetings. These meetings are open for anyone to join who has completed the GraphQL Specification Membership. To sign the agreement, simply open a pull request against the meeting agenda and add your name. The EasyCLA bot will direct you to the signature tool.

Because we work in a highly distributed environment and will rarely meet in person, participants are encouraged to use video as appropriate.

### Zoom

GraphQL has a Zoom account which can be used by projects and working groups. Projects and working groups are encouraged to meet regularly and record their meetings for posting on the [GraphQL YouTube channel](https://youtube.graphql.org). To avoid collisions, please request that your meeting be added to the [GraphQL Calendar](https://calendar.graphql.org) by emailing [operations@graphql.org](mailto:operations@graphql.org). If two meetings are scheduled at the same time, the meeting on the calendar takes precedence.

### Meetings

In order to hold a GraphQL meeting for the TSC, a project, or a working group, you must do the following:

* **Post an agenda** on GitHub before the meeting. For an example, please see the [GraphQL WG agendas](https://github.com/graphql/graphql-wg/tree/master/agendas).
* **Record attendance** by ensuring every attendee PRs themselves onto the meeting agenda. This ensures that everybody has signed the right membership agreements. This process is free and fast, and is kicked off automatically when you open your first PR.
* **Re-verify** at the start of each meeting that all participants have signed the membership document. If they haven't they can either add themselves to the meeting agenda and complete the forms, or disconnect and listen to the replay.
* **Announce** at the beginning of the call that it is being recorded.
* **Keep minutes** of the discussion (the recording can help with this). For an exmaple, please see the [GraphQL WG minutes](https://github.com/graphql/graphql-wg/tree/master/notes).

Our Zoom account supports recording and livestreaming. We strongly encourage you to use the cloud recording feature. Staff can then download and post the videos to the [GraphQL YouTube channel](https://youtube.graphql.org). Alternately, if you want to livestream a meeting directly to YouTube, you can request access by emailing [operations@graphql.org](mailto:operations@graphql.org).

If you have questions about these processes, please contact [operations@graphql.org](mailto:operations@graphql.org) and we can help provide context for why they are in place.

## TSC Members

### Who can participate on the TSC

TSC meeting are open to anybody who wishes to participate. Aside from items which require a formal vote (such as approving specification verions or elections), anyone who has signed a Specification Membership Agreement may participate in discussions and decisions. As defined in the charter, the TSC will use the consensus decision-making process as often as possible.

The TSC will also include a number of individuals who have been elected as voting members. These individuals are expected to be active participants on the TSC, and to be engaged and responsive on matters that require a formal vote.

You must add yourself to the meeting agenda via PR in order to be able to join a GraphQL specification meeting.

### TSC Voting Members

The current voting members of the GraphQL TSC are:

| Name                                               | Affiliation           | Term begins | Term ends    |
| -------------------------------------------------- | --------------------- | ----------- | ------------ |
| [Lee Byron (chair)](https://github.com/leebyron)   | GraphQL Specification | N/A         | N/A          |
| [Andi Marek](https://github.com/andimarek)         | GraphQL Java          | Nov 1, 2020 | Dec 31, 2022 |
| [Benjie Gillam](https://github.com/benjie)         | Graphile              | Nov 1, 2020 | Dec 31, 2021 |
| [Brielle Harrison](https://github.com/nyteshade)   | PayPal                | Nov 1, 2020 | Dec 31, 2021 |
| [Dan Schafer](https://github.com/dschafer)         | Facebook              | Nov 1, 2020 | Dec 31, 2022 |
| [Ivan Goncharov](https://github.com/IvanGoncharov) | Self                  | Nov 1, 2020 | Dec 31, 2021 |
| [Matt Mahoney](https://github.com/mjmahone)        | Facebook              | Nov 1, 2020 | Dec 31, 2021 |
| [James Baxley](https://github.com/jbaxleyiii)      | Apollo GraphQL        | Nov 1, 2020 | Dec 31, 2021 |
| [Nick Schrock](https://github.com/schrockn)        | Elementl              | Nov 1, 2020 | Dec 31, 2022 |
| [Rob Zhu](https://github.com/robzhu)               | AWS                   | Nov 1, 2020 | Dec 31, 2022 |
| [Sasha Solomon](https://github.com/sachee)         | Twitter               | Nov 1, 2020 | Dec 31, 2022 |

### Becoming a TSC Voting Member

The [Technical Charter](https://github.com/graphql/foundation/blob/master/GraphQL%20Specification%20Membership%20Agreement%20February%202019.pdf) describes the composition of the TSC. The GraphQL TSC has 10 elected members, plus the Executive Director. TSC members serve a two-year term. Each year, half of the TSC voting seats will be up for election. There are no term limits.

### Election process

After November 1st, the TSC will collect self-nominations from the community. After December 1st, the TSC members who are not up for election will vote on the candidates using a multiple-candidate method. The elected reps will begin their term on January 1st.

#### Initial period

To provide consistency TSC elections will begin in 2021 for the 2022 term. Prior to the first election, half of the existing members will be selected via ["coin toss"](https://gist.github.com/leebyron/cbda7f0c604915d9200af5626b1fcf1b) to serve an initial one-year term.

#### Election dates

| Term        | Nominations open | Voting open | Term begins | Term ends    |
| ----------- | ---------------- | ----------- | ----------- | ------------ |
| 2022 - 2023 | Nov 1, 2021      | Dec 1, 2021 | Jan 1, 2022 | Dec 31, 2023 |
| 2023 - 2024 | Nov 1, 2022      | Dec 1, 2022 | Jan 1, 2023 | Dec 31, 2024 |
| 2024 - 2025 | Nov 1, 2023      | Dec 1, 2023 | Jan 1, 2024 | Dec 31, 2025 |

### Voting process

When something cannot be decided by consensus or a formal vote is required, the TSC will use a method appropriate to the situation:

* Simple majority for single-winner votes.
* Condorcet method for multiple-winner votes.

The ballots may be public or private depending upon the situation, but the aggregate results should always be published.

#### Minimum threshold for votes

Because we work in a distributed environment, the voting process must account for a range of time zones and schedules. At least half of the voting members of the TSC must cast a ballot in order for the vote to be valid. Once the voting threshold has been met, one of these two critera must be satisfied to conclude the vote:

* A notice is sent via email that the vote will conclude in three business days, reminding those who haven't voted that they should do so. The vote will conclude at the end of this time.
* The election results will not change if additional TSC members vote.

#### Ensuring efficient votes

Should a TSC member miss three or more of the prior five meetings, they will no longer vote or be counted toward the total number of voting members. This is to ensure broad participation as well as to avoid voting deadlocks.

A voting member may regain their status by attending two consecutive meetings. They may participate in votes in the second meeting.

#### Resignation of voting members

If a rep resigns before the end of their term, the TSC may collect nominations and vote on a replacement representative to complete the term. The self-nomination period should be at least two weeks before holding a vote.

#### Removing a voting member

TSC members may be removed by a supermajority (2/3) vote by eligible voting members less any with a conflict of interest. The seat may then be filled for the remainder of the term.

## Policies and procedures

The GraphQL TSC is governed by the [Technical Charter](https://github.com/graphql/foundation/blob/master/GraphQL%20Specification%20Membership%20Agreement%20February%202019.pdf).  The Charter provides a foundational structure for the TSC on topics such as its scope, how to make decisions, and how to make changes to itself.  At the same time, it grants the TSC a high degree of freedom when determining how to implement the policies of GraphQL.

The following policies and procedures have been adopted by the TSC.

### Making changes to this document

Pull requests against this document that do not conflict with the [Technical Charter](https://github.com/graphql/foundation/blob/master/GraphQL%20Specification%20Membership%20Agreement%20February%202019.pdf) can be merged provided the following conditions have been met:

* There are no outstanding objections
* There are two approvals by TSC members (not including the author)
* The PR has been open for at least 72 hours

Pull requests that change governance of the TSC (excluding the charter) must be open for at least 14 days, unless consensus is reached in a meeting with quorum of voting members.

If consensus cannot be reached, a pull request may still be landed after a vote by the Voting members to override outstanding objections.

An exception is made for errata or to update meeting logistics. These may be landed immediately, provided all EasyCLA checks have passed.

### Adding and archiving projects under the GraphQL Specification

The TSC may add and archive specifications, projects, and their corresponding repositories by a majority vote.

The TSC is responsible for defining a policy and a naming convention for any repositories created or transferred into the https://github.com/graphql organization.

Each repository will be managed by the EasyCLA signature tool, ensuring that all contributors have agreed to the GraphQL Specification Membership Agreement.

### Speaking on behalf of the GraphQL Project

GraphQL Contributors as individuals are welcome to express opinions and messages of political advocacy in any of their personal spaces (e.g. personal Twitter, blog) as well as within GitHub issues and PR discussions, provided it adheres to our [Code of Conduct](https://github.com/graphql/foundation/blob/main/CODE-OF-CONDUCT.md). When speaking on behalf of the GraphQL project (e.g. technical docs, project websites, project Twitter, READMEs, or anything merged into a git repository under the GraphQL organization) we only allow posting opinions or messages of political advocacy using the voice of the project with prior approval via GraphQL TSC vote.

In addition to prior approval from the TSC, all expressed opinions or messages of political advocacy from the GraphQL project should be clear about their purpose and intent, use the appropriate surfaces and channels, be paired with tangible action from the project, and provide a clear call-to-action for community members.

### IP Policy

The GraphQL IP policy is contained in the [charter](https://github.com/graphql/foundation/blob/master/GraphQL%20Specification%20Membership%20Agreement%20February%202019.pdf), and it applies to all GraphQL projects unless an exception is explicitly approved by the TSC.

#### Copyright notices

GraphQL follows the [community best practice](https://www.linuxfoundation.org/blog/2020/01/copyright-notices-in-open-source-software-projects/) of not requiring contributors to add a notice to each file.

#### SPDX

Projects are encouraged (but not required) to adopt the practice of including [SPDX short form identifiers](https://spdx.org/ids-how) in their files.

#### Website footers

GraphQL projects should use one of the following notices on their websites, as appropriate:

##### For HTML sites

> ```
> <hr>
> Copyright Joint Development Foundation Projects, LLC, GraphQL Series.<br>
> <a href="https://graphql.org">graphql.org</a> | <a href="https://spec.graphql.org">Spec</a> | <a href="https://github.com/graphql">GitHub</a> | <a href="https://foundation.graphql.org">GraphQL Foundation</a> | <a href="https://code-of-conduct.graphql.org">Code of Conduct</a> | <a href="https://slack.graphql.org">Slack</a> | <a href="https://store.graphql.org">Store</a>
> ```

##### For markdown sites, including GitHub READMEs

> ```
> ---
> Copyright Joint Development Foundation Projects, LLC, GraphQL Series.<br>
> [graphql.org](https://graphql.org) | [Spec](https://spec.graphql.org) | [GitHub](https://github.com/graphql) | [GraphQL Foundation](https://foundation.graphql.org) | [Code of Conduct](https://code-of-conduct.graphql.org) | [Slack](https://slack.graphql.org) | [Store](https://store.graphql.org)
> ```

---
Copyright Joint Development Foundation Projects, LLC, GraphQL Series.<br>
[graphql.org](https://graphql.org) | [Spec](https://spec.graphql.org) | [GitHub](https://github.com/graphql) | [GraphQL Foundation](https://foundation.graphql.org) | [Code of Conduct](https://code-of-conduct.graphql.org) | [Slack](https://slack.graphql.org) | [Store](https://store.graphql.org)

<!-- LF Projects -->
