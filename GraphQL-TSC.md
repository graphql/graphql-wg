# GraphQL Technical Steering Committee (TSC)

The GraphQL TSC is responsible for management and technical oversight for all efforts within the scope of the GraphQL Specification Project. In particular, the TSC is responsible for approving official GraphQL specification releases and managing open source projects.

- [TSC Members](#tsc-members)
- [TSC Responsibilities](#tsc-responsibilities)
- [Becoming a TSC Member](#becoming-a-tsc-member)
- [TSC Meetings](#tsc-meetings)
- [Collaboration tools](#collaboration-tools)
- [Voting process](#voting-process)
- [Policies and procedures](#policies-and-procedures)

## TSC Members

The current members of the GraphQL TSC are (in chair, name order):

| Name                                               | Affiliation           | Term begins | Term ends    |
| -------------------------------------------------- | --------------------- | ----------- | ------------ |
| [Lee Byron (chair)](https://github.com/leebyron)   | GraphQL Specification | N/A         | N/A          |
| [Benjie Gillam](https://github.com/benjie)         | Graphile              | Nov 1, 2020 | Jan 31, 2026 |
| [Denis Badurina](https://github.com/enisdenjo)     | The Guild             | Feb 1, 2024 | Jan 31, 2026 |
| [Ivan Goncharov](https://github.com/IvanGoncharov) | Apollo                | Nov 1, 2020 | Jan 31, 2026 |
| [Kewei Qu](https://github.com/Keweiqu)             | Meta                  | Jan 1, 2023 | Jan 31, 2027 |
| [Matt Mahoney](https://github.com/mjmahone)        | Meta                  | Nov 1, 2020 | Jan 31, 2026 |
| [Michael Staib](https://github.com/michaelstaib)   | ChilliCream           | Jan 1, 2022 | Jan 31, 2026 |
| [Rob Richard](https://github.com/robrichard)       | 1stDibs               | Jan 1, 2023 | Jan 31, 2027 |
| [Uri Goldshtein](https://github.com/urigo)         | The Guild             | Jan 1, 2023 | Jan 31, 2027 |
| [Martin Bonnin](https://github.com/martinbonnin)   | Apollo                | Feb 1, 2025 | Jan 31, 2027 |
| [Pascal Senn](https://github.com/PascalSenn)       | ChilliCream           | Feb 1, 2025 | Jan 31, 2027 |

### Emeriti

We thank all our prior TSC members for their contribution (in time order):

| Name                                             | Affiliation   | Term began  | Term ended   |
| ------------------------------------------------ | ------------- | ----------- | ------------ |
| [Brielle Harrison](https://github.com/nyteshade) | PayPal        | Nov 1, 2020 | Dec 31, 2021 |
| [James Baxley](https://github.com/jbaxleyiii)    | Carbon Health | Nov 1, 2020 | Dec 31, 2021 |
| [Dan Schafer](https://github.com/dschafer)       | Facebook      | Nov 1, 2020 | Dec 31, 2022 |
| [Nick Schrock](https://github.com/schrockn)      | Elementl      | Nov 1, 2020 | Dec 31, 2022 |
| [Rob Zhu](https://github.com/robzhu)             | AWS           | Nov 1, 2020 | Dec 31, 2022 |
| [Sasha Solomon](https://github.com/sachee)       | Twitter       | Nov 1, 2020 | Dec 31, 2022 |
| [Marc-Andre Giroux](https://github.com/xuorig)   | Netflix       | Jan 1, 2022 | Jan 31, 2024 |
| [Andi Marek](https://github.com/andimarek)       | Atlassian     | Nov 1, 2020 | Jan 31, 2025 |
| [Stephen Spalding](https://github.com/fotoetienne) | Netflix     | Jan 1, 2023 | Jan 31, 2025 |

## TSC Responsibilities

The TSC provides management and technical oversight for all efforts within the scope of the GraphQL Specification Project. This includes:

- Approving formal releases of the [GraphQL Specification](https://spec.graphql.org).
- Approving new projects and working groups.
- Creating, transferring, organizing, and renaming GitHub repos under the [GraphQL org](https://github.com/graphql).
- Resolving technical or community issues that span multiple projects, or are deadlocked within a project.
- Delegating decisions on publishing releases.
- Rating talks for the GraphQL conf CFP.

The scope of the TSC should not include decisions that can be made within one of the projects, unless there is a specific issue that cannot be resolved and requires mediation. In general, the TSC prefers to delegaet decisions to be made at the lowest possible level.

### Technical Charter and Code of Conduct

The GraphQL TSC is governed by the [Charter](https://github.com/graphql/foundation/blob/master/GraphQL%20Specification%20Membership%20Agreement%20February%202019.pdf), which establishes the Committee and its basic principles and procedures. The charter is designed to provide the TSC the freedom to govern itself in an efficient manner. This document establishes TSC policies and procedures.

In addition, as provided under the Technical Charter, GraphQL has adopted a [Code of Conduct](https://code-of-conduct.graphql.org) that applies to all GraphQL activities and spaces. If you believe there has been a violation of the GraphQL Code of Conduct, please contact [report@graphql.org](mailto:report@graphql.org).

### About the GraphQL Specification project

[GraphQL](https://graphql.org) is a query language for APIs and a runtime for fulfilling those queries with your existing data. GraphQL provides a complete and understandable description of the data in your API, gives clients the power to ask for exactly what they need and nothing more, makes it easier to evolve APIs over time, and enables powerful developer tools.

Development of the [GraphQL Specification](https://spec.graphql.org) is managed by the [GraphQL Spec Working Group](https://github.com/graphql/graphql-wg). This is the primary place where work is done on the GraphQL specification.

The GraphQL Specification hosts other projects, in addition to the main specification. Specification licensed under OWF 1.0 include:

- [GraphQL](https://spec.graphql.org)
- [GraphQL over HTTP](https://github.com/graphql/graphql-over-http)
- [GraphQL Scalars](https://github.com/graphql/graphql-scalars)

We also host implementations, which are licensed under MIT:

- [DataLoader](https://github.com/graphql/dataloader)
- [GraphiQL IDE](https://github.com/graphql/graphiql)
- [GraphQL HTTP Server Middleware (Express GraphQL)](https://github.com/graphql/express-graphql)
- [GraphQL Playground](https://github.com/graphql/graphql-playground)
- [GraphQL.js](https://github.com/graphql/graphql-js)
- [libgraphqlparser](https://github.com/graphql/libgraphqlparser)
- [Relay Library for GraphQL.js](https://github.com/graphql/graphql-relay-js)
- [SWAPI GraphQL Wrapper](https://github.com/graphql/swapi-graphql)
- [VSCode GraphQL extension](https://github.com/graphql/vscode-graphql)

Developers who are covered under a signed spec membership agreement are able to contribute to any GraphQL spec or project.

### Decision-making authority

The following table is a rough outline of who is responsible for decisions. In keeping with the principle that decisions should be made at the lowest possible level and as efficiently as possible, unless there is a specific escalation to the TSC.

| Decision                                      | Who decides          | Can it be delegated? |
| --------------------------------------------- | -------------------- | -------------------- |
| Approve a GraphQL Specification release       | TSC                  | No                   |
| Approve a sub-specification release           | TSC or working group | Yes                  |
| Release a reference implementation            | TSC or maintainers   | Yes                  |
| Adding a new repo in the GraphQL organization | TSC                  | No                   |
| Changes to this document                      | TSC                  | No                   |

## Becoming a TSC Member

The [Technical Charter](https://github.com/graphql/foundation/blob/master/GraphQL%20Specification%20Membership%20Agreement%20February%202019.pdf) describes the composition of the TSC. The GraphQL TSC has 10 elected members, plus the Executive Director. TSC members serve a two-year term, and there is no limit to the number of terms a member can serve. Each year, half of the TSC member seats will be up for election.

### Election process

Towards the end of each year, the TSC will collect self-nominations from the community. Anyone may self-nominate to be considered as a TSC member. Fill out the form at [tsc-nomination.graphql.org/](https://tsc-nomination.graphql.org/) to formally self-nominate. This form is always open, and submissions made during each election's nomination period (November 1st through the end of the year) are considered.

At the start of the year, the TSC members with terms not up for election will vote on the candidates using a multiple-winner method, members with expiring terms are recused from this vote due to conflict of interest. The elected TSC members will begin their term no later than February 1st.

#### Initial period

To provide consistency TSC elections will begin in 2021 for the 2022 term. Prior to the first election, half of the existing members will be selected via ["coin toss"](https://gist.github.com/leebyron/cbda7f0c604915d9200af5626b1fcf1b) to serve an initial one-year term.

#### Election dates

| Term          | Nominations open | Voting open   | Term begins   | Term ends      |
| ------------- | ---------------- | ------------- | ------------- | -------------- |
| ~2022 - 2023~ | ~Nov 1, 2021~    | ~Dec 1, 2021~ | ~Jan 1, 2022~ | ~Jan 31, 2024~ |
| ~2023 - 2024~ | ~Nov 1, 2022~    | ~Dec 1, 2022~ | ~Jan 1, 2023~ | ~Dec 31, 2024~ |
| ~2024 - 2025~ | ~Dec 1, 2023~    | ~Jan 1, 2024~ | ~Feb 1, 2024~ | Jan 31, 2026   |
| 2025 - 2026   | ~Nov 1, 2024~    | ~Dec 1, 2024~ | ~Feb 1, 2025~ | Jan 31, 2027   |
| 2026 - 2027   | Nov 1, 2025      | Jan 5, 2025   | Feb 1, 2026   | Jan 31, 2028   |
| 2027 - 2028   | Nov 1, 2026      | Jan 5, 2026   | Feb 1, 2027   | Jan 31, 2029   |

### Resignation or removal of TSC members

A TSC member may voluntarily resign at any time before the end of their term by notifying the TSC chair. A TSC member may also be involuntarily removed by a supermajority (2/3) vote by TSC members.

After a TSC seat vacancy the remaining TSC will collect self-nominations and vote on a replacement member to complete the term. The nomination period should be open for at least two weeks, after which a vote shall be held.

## TSC Meetings

The GraphQL TSC will meet monthly, at the beginning of the first [GraphQL Working Group meeting](https://github.com/graphql/graphql-wg) each month. Our goal is to meet regularly to address any agenda items quickly and openly. By combining the TSC meeting with the open attendance Working Group meetings, we are ensuring that the broader community has visibility into the operations of the TSC, and vice versa.

To attend a GraphQL TSC meeting, you must follow the same process as other GraphQL meetings and open a PR to add your name to the list of attendees in the [meeting agenda](https://github.com/graphql/graphql-wg/tree/master/agendas). If you have not signed the GraphQL Specification Membership Agreement you will be prompted to do so. You cannot attend until you have completed this document, although you are welcome to listen to the replay on [YouTube](https://www.youtube.com/playlist?list=PLP1igyLx8foH30_sDnEZnxV_8pYW3SDtb).

### Who can participate

Meetings are open to anybody who wishes to participate, you must add yourself to the meeting agenda via PR in order to be able to join a GraphQL specification meeting.

Aside from items which require a formal vote (such as approving specification verions or elections), anyone who has signed a Specification Membership Agreement may participate in discussions and decisions. As defined in the charter, the TSC members will use the consensus decision-making process as often as possible.

The elected TSC members are expected to be active participants in all meetings, and to be engaged and responsive on matters that require a formal vote.

### Agendas and operating procedures

In order to hold a GraphQL meeting for the TSC, a project, or a working group, you must do the following:

- **Post an agenda** on GitHub before the meeting. For an example, please see the [GraphQL WG agendas](https://github.com/graphql/graphql-wg/tree/master/agendas).
- **Record attendance** by ensuring every attendee PRs themselves onto the meeting agenda. This ensures that everybody has signed the right membership agreements. This process is free and fast, and is kicked off automatically when you open your first PR.
- **Re-verify** at the start of each meeting that all participants have signed the membership document. If they haven't they can either add themselves to the meeting agenda and complete the forms, or disconnect and listen to the replay.
- **Announce** at the beginning of the call that it is being recorded.
- **Keep minutes** of the discussion (the recording can help with this). For an exmaple, please see the [GraphQL WG minutes](https://github.com/graphql/graphql-wg/tree/master/notes).

Our Zoom account supports recording and livestreaming. We strongly encourage you to use the cloud recording feature. Staff can then download and post the videos to the [GraphQL YouTube channel](https://youtube.graphql.org). Alternately, if you want to livestream a meeting directly to YouTube, you can request access by emailing [operations@graphql.org](mailto:operations@graphql.org).

If you have questions about these processes, please contact [operations@graphql.org](mailto:operations@graphql.org) and we can help provide context for why they are in place.

## Collaboration tools

### Mailing List

The GraphQL TSC can be reached at [tsc@lists.foundation.graphql.org](https://lists.foundation.graphql.org/g/tsc). The mailing list is open to anyone who has signed the GraphQL Specification membership agreement (for [individual](https://individual-spec-membership.graphql.org/) or [corporate](https://corporate-spec-membership.graphql.org/) members), but anybody can view the archives.

### Github

The [graphql-wg](https://github.com/graphql/graphql-wg/) repository hosts issues, discussions, and working files used by the TSC and the rest of the working group.

### Discord

GraphQL maintains a [Discord](https://discord.graphql.org) for communication and collaboration, which is open for anyone to join. Once you join [Discord](https://discord.graphql.org), you can participate in any public channels.

### Calendars

GraphQL maintains a [public calendar](https://calendar.graphql.org) for TSC meetings. These meetings are open for anyone to join who has completed the GraphQL Specification Membership. To sign the agreement, simply open a pull request against the meeting agenda and add your name. The EasyCLA bot will direct you to the signature tool.

Because we work in a highly distributed environment and will rarely meet in person, participants are encouraged to use video as appropriate.

### Zoom

GraphQL has a Zoom account which can be used by projects and working groups. Projects and working groups are encouraged to meet regularly and record their meetings for posting on the [GraphQL YouTube channel](https://youtube.graphql.org). To avoid collisions, please request that your meeting be added to the [GraphQL Calendar](https://calendar.graphql.org) by emailing [operations@graphql.org](mailto:operations@graphql.org). If two meetings are scheduled at the same time, the meeting on the calendar takes precedence.

## Voting process

When something cannot be decided by consensus or a formal vote is required, the TSC will use a method appropriate to the situation:

| Situation                      | Response         | Method                                   |
| ------------------------------ | ---------------- | ---------------------------------------- |
| Binary choice                  | Single choice    | Simple majority as per [procedure][]     |
| Many choices, single winner    | Rank all choices | [Condorcet Beatpath/Schulze][]           |
| Many choices, multiple winners | Rank all choices | [Single Transferable Vote (STV), Meek][] |

[procedure]: #voting-procedure
[condorcet beatpath/schulze]: https://en.wikipedia.org/wiki/Schulze_method
[single transferable vote (stv), meek]: https://en.wikipedia.org/wiki/Counting_single_transferable_votes#Meek

The ballots may be public or private depending upon the situation, but the aggregate results should always be published.

### Defining a quorum of "attending" members

To balance preserving the voting ability of all TSC members with the desire for the voting process to remain efficient and avoid deadlocks, we define a valid quorum based on members' recent attendance of GraphQL Working Group meetings.

A quorum is a majority (more than half, or 2/3 for a supermajority vote) of the TSC _attending members_. A quorum must cast a ballot in order for a vote to be valid.

A TSC _attending member_ is a member who has attended a meeting in the past 100 days. Should a TSC member not attend a meeting for more than 100 days, they will no longer be counted when determining quorum (but may still vote). A member starts counting towards quorum as of attending a meeting.

Note: A member may be recused (i.e. for a member election) in which case they do not count as an _attending member_ for the purpose of that vote.

### Voting process

Because we work in a distributed environment, the voting process must account for a range of time zones and schedules. Once the threshold of a quorum has been met and a vote is valid, one of these two critera must be satisfied to conclude a vote:

- A notice is sent via email that the vote will conclude in three business days, reminding those who haven't voted that they should do so. The vote will conclude at the end of this time.
- The election results would not change if all remaining members were to vote.

Once a valid vote is concluded, the result is determined by the number of votes received at that time (as opposed to the total number of TSC members):

- For a binary choice, the votes in favor must exceed half for a majority (or 2/3 for a supermajority) of the total number of votes.
- For ranked choices, all votes received at the time the vote is concluded are considered.

### Non-votes

TSC members are not required to vote. There are three ways an _attending_ member may reply to choose not to vote, each with a different intent and impact on the voting process:

- **Present:** A reply of "present" causes an _attending_ member to count towards quorum, but does not count towards the number of votes. This has the practical impact of allowing progress towards reaching quorum while lowering the number of "yes" votes required for a motion to pass. A member may reply "present" if they support a motion reaching a result, but do not have a preference if it passes or fails.
- **Absent/Abstain:** A reply of "abstain" causes an _attending_ member to neither count towards quorum, nor towards the number of votes. This is implied for any absent _attending_ member which does not reply to a vote. This has the practical impact of hindering progress towards reaching quorum. A member may reply "abstain" if they do not support a motion reaching either result.
- **Recused:** A reply of "recused" causes a member to not count as an _attending_ member for the purposes of this vote. This has the practical impact of both lowering the number of _attending_ members required to reach quorum, and the number of "yes" votes required for a motion to pass. A member may reply "recused" if they want to remove themselves to minimize their impact on a vote, often due to a conflict of interest.

Note: Non-attending members do not count towards quorum, and should they not vote are effectively recused.

#### All possible vote scenarios

Given the two kinds of TSC members (_attending_ and _non-attending_, defined above) and the possible votes or non-votes (also defined above),
here is a table describing the impact of each vote scenario on the variables used in the voting procedure below.

| Vote                                    | Counts as _attending_ | Counts towards _quorum_ | Counts towards a choice |
| --------------------------------------- | :-------------------: | :---------------------: | :---------------------: |
| _Attending_ member choice (i.e. yes/no) |          ✅           |           ✅            |           ✅            |
| _Attending_ member "present"            |          ✅           |           ✅            |           ❌            |
| _Attending_ member is absent            |          ✅           |           ❌            |           ❌            |
| _Attending_ member abstains             |          ✅           |           ❌            |           ❌            |
| _Attending_ member recused              |          ❌           |           ❌            |           ❌            |
| _Non-attending_ member choice           |          ❌           |           ❌            |           ✅            |
| _Non-attending_ member non-vote         |          ❌           |           ❌            |           ❌            |

### Voting procedure

Bringing this all together, here's a step-by-step procedure for administering a TSC vote:

1. Formally open a vote for a motion by opening a GitHub issue.
   - Most votes are held publicly, for those held privately, open an issue in a private forum.
1. Take attendence of all TSC members over the prior three meetings to determine _attending members_ minus any recused.
   - If a vote is raised during a meeting, count the live meeting as the most recent of the three.
   - For an election vote, members with expiring terms are recused and not counted towards _attending members_.
1. Determine the _quorum threshold_ as the next number larger than half of _attending members_, or 2/3 for a supermajority.
   - Examples: For 8 attending, a quorum threshold is 5. For 11 attending, quorum threshold is 6. For 9 attending, a supermajority quorum threshold is 7.
1. Gather votes from _all non-recused members_ until the number of votes from _attending members_ reaches _quorum threshold_.
   - A reply of "recused" requires recalculating _attending members_ and _quorum threshold_.
   - A reply of "abstain" or "recused" does not count towards _quorum threshold_.
   - Send recurring reminders to remaining _attending members_.
1. Message that the vote will be closed in 3 business days, make good faith attempt at reaching out to all remaining members.
   - Conclude the vote early if no additional set of votes could change the outcome: e.g. for single-winner votes, 6 _yes votes_ or 5 _no votes_ are received for a majority vote, or 8 _yes votes_ or 3 _no votes_ for a supermajority.
   - Any "non-vote" replies lower the thresholds for early conclusion.
1. The resulting motion passes if the number of _yes votes_ is a majority (or 2/3 supermajority) of _vote count_.
   - For a multiple-winner vote, the stack-ranked votes are prepared and fed to a multiple-winner algorithm.
1. Should a vote take place in a private forum, post the result in a public forum.

<details>
<summary>Typical example</summary>

Consider this scenario for a simple majority vote:

- 6 of 11 TSC members are considered _attending_ members by having attended one of the last three WG meetings.
- Being a simple majority, more than half of this 6 must cast votes to reach quorum and consider the vote valid.
- 4 votes by _attending_ members are cast, reaching quorum. The vote's outcome will be valid.
- An notice is sent out reminding all remaining members to cast a vote within three business days.
- 1 additional TSC _attending_ member casts a vote.
- 3 non-attending members also cast a vote.
- Three days pass, the vote is concluded.
- A total of 8 votes have been cast.
- The votes in favor must exceed half of the 8 total votes.
- There must be at least 5 "yes" votes for the motion to pass.
</details>

<details>
<summary>Election example</summary>

Consider this scenario for a member election:

- 6 of 11 TSC members are considered _attending_ members by having attended one of the last three WG meetings.
- However, 2 of those members have expiring terms and are recused for the member election.
- Thus 4 remain _attending_ members for the purpose of this vote.
- More than half of this 4 (thus, 3) must cast votes to reach quorum and consider the vote valid.
- 3 votes by non-recused _attending_ members are cast, reaching quorum. The vote's outcome will be valid.
- An notice is sent out reminding all remaining non-recused members to cast a vote within three business days.
- 1 additional TSC _attending_ member casts a vote.
- 1 non-attending member also casts a vote.
- Three days pass, the vote is concluded.
- A total of 5 votes have been cast.
- The multiple-winner votes are input to a Condorcet algorithm to determine the outcome.
</details>

## Policies and procedures

The GraphQL TSC is governed by the [Technical Charter](https://github.com/graphql/foundation/blob/master/GraphQL%20Specification%20Membership%20Agreement%20February%202019.pdf). The Charter provides a foundational structure for the TSC on topics such as its scope, how to make decisions, and how to make changes to itself. At the same time, it grants the TSC a high degree of freedom when determining how to implement the policies of GraphQL.

The following policies and procedures have been adopted by the TSC.

### Making changes to this document

Pull requests against this document that do not conflict with the [Technical Charter](https://github.com/graphql/foundation/blob/master/GraphQL%20Specification%20Membership%20Agreement%20February%202019.pdf) can be merged provided the following conditions have been met:

- There are no outstanding objections
- There are two approvals by TSC members (not including the author)
- The PR has been open for at least 72 hours

Pull requests that change governance of the TSC (excluding the charter) must be open for at least 14 days, unless consensus is reached in a meeting with quorum of TSC _attending_ members.

If consensus cannot be reached, a pull request may still be landed after a vote by TSC members to override outstanding objections.

An exception is made for errata or to update meeting logistics. These may be landed immediately, provided all EasyCLA checks have passed.

### Security policy

The GraphQL TSC is in an elevated position of trust within the GraphQL community. Security concerns that impact repos under the [`graphql` GitHub org](https://github.com/graphql/) (including reference implementations and official tools) may be responsibly disclosed to the TSC via [any current TSC member](https://github.com/graphql/graphql-wg/blob/main/GraphQL-TSC.md#tsc-members-1), with the expectation that they will be discussed and triaged by the TSC as a whole. You may reach a subset of current TSC members via [security@graphql.org](mailto:security@graphql.org).

Our goal is to provide complete, accurate, and actionable disclosures once a reported issue has been sufficiently understood and there has been a reasonable opportunity to deploy fixes responsibly. At no time should a TSC member release information on a pre-disclosed vulnerability to anyone besides other TSC members, Foundation staff, legal counsel, or required authorities unless there is consensus to do so. A TSC member may call for a formal vote to determine an appropriate path forward at any time in the process, if needed.

In the case of responsible disclosures, the TSC is expected to work in good faith toward a resolution that is in the best interest of the community, including coordinating with maintainers on pre-disclosure patches and the CVE process. As responsible and knowledgable stewards of the GraphQL ecosystem, the TSC is empowered to negotiate the priority level and timelines for announcements and fixes.

In the case of irresponsible disclosure, regardless of the circumstances, the TSC is expected to make themselves available to convene urgently and to decide upon a communications and action plan.

### Adding and archiving projects under the GraphQL Specification

The TSC may add and archive specifications, projects, and their corresponding repositories by a majority vote.

The TSC is responsible for defining a policy and a naming convention for any repositories created or transferred into the https://github.com/graphql organization.

Each repository will be managed by the EasyCLA signature tool, ensuring that all contributors have agreed to the GraphQL Specification Membership Agreement.

### Speaking on behalf of the GraphQL Project

GraphQL Contributors as individuals are welcome to express opinions and messages of political advocacy in any of their personal spaces (e.g. personal Twitter, blog) as well as within GitHub issues and PR discussions, provided it adheres to our [Code of Conduct](https://github.com/graphql/foundation/blob/main/CODE-OF-CONDUCT.md). We require approval via GraphQL TSC vote prior to posting opinions or messages of political advocacy using the voice of the GraphQL project (e.g. within technical docs, project websites, project Twitter, READMEs, or anything merged into a git repository under the GraphQL organization).

In addition to prior approval from the TSC, all expressed opinions or messages of political advocacy from the GraphQL project should be clear about their purpose and intent, use the appropriate surfaces and channels, have a fixed time frame for when a message would be added to and removed from any surface, be paired with tangible action from the project, and provide a clear call-to-action for community members.

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
