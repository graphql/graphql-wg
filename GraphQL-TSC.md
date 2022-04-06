
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

### Github

The [graphql-wg](https://github.com/graphql/graphql-wg/) repository hosts issues, discussions, and working files used by the TSC and the rest of the working group.

### Discord

GraphQL maintains a [Discord](https://discord.graphql.org) for communication and collaboration, which is open for anyone to join. Once you join [Discord](https://discord.graphql.org), you can participate in any public channels.

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

The TSC will also include a number of individuals who have been elected as members. These individuals are expected to be active participants on the TSC, and to be engaged and responsive on matters that require a formal vote.

You must add yourself to the meeting agenda via PR in order to be able to join a GraphQL specification meeting.

### TSC Members

The current members of the GraphQL TSC are:

| Name                                               | Affiliation           | Term begins | Term ends    |
| -------------------------------------------------- | --------------------- | ----------- | ------------ |
| [Lee Byron (chair)](https://github.com/leebyron)   | GraphQL Specification | N/A         | N/A          |
| [Andi Marek](https://github.com/andimarek)         | GraphQL Java          | Nov 1, 2020 | Dec 31, 2022 |
| [Benjie Gillam](https://github.com/benjie)         | Graphile              | Nov 1, 2020 | Dec 31, 2023 |
| [Dan Schafer](https://github.com/dschafer)         | Facebook              | Nov 1, 2020 | Dec 31, 2022 |
| [Ivan Goncharov](https://github.com/IvanGoncharov) | Apollo                | Nov 1, 2020 | Dec 31, 2023 |
| [Marc-Andre Giroux](https://github.com/xuorig)     | Netflix               | Jan 1, 2022 | Dec 31, 2023 |
| [Matt Mahoney](https://github.com/mjmahone)        | Facebook              | Nov 1, 2020 | Dec 31, 2023 |
| [Michael Staib](https://github.com/michaelstaib)   | ChilliCream           | Jan 1, 2022 | Dec 31, 2023 |
| [Nick Schrock](https://github.com/schrockn)        | Elementl              | Nov 1, 2020 | Dec 31, 2022 |
| [Rob Zhu](https://github.com/robzhu)               | AWS                   | Nov 1, 2020 | Dec 31, 2022 |
| [Sasha Solomon](https://github.com/sachee)         | Twitter               | Nov 1, 2020 | Dec 31, 2022 |

#### Emeriti

We thank all our prior TSC members for their contribution:

| Name                                               | Affiliation           | Term began  | Term ended   |
| -------------------------------------------------- | --------------------- | ----------- | ------------ |
| [Brielle Harrison](https://github.com/nyteshade)   | PayPal                | Nov 1, 2020 | Dec 31, 2021 |
| [James Baxley](https://github.com/jbaxleyiii)      | Carbon Health         | Nov 1, 2020 | Dec 31, 2021 |

### Becoming a TSC Member

The [Technical Charter](https://github.com/graphql/foundation/blob/master/GraphQL%20Specification%20Membership%20Agreement%20February%202019.pdf) describes the composition of the TSC. The GraphQL TSC has 10 elected members, plus the Executive Director. TSC members serve a two-year term, and there is no limit to the number of terms a member can serve. Each year, half of the TSC member seats will be up for election.

### Election process

After November 1st, the TSC will collect self-nominations from the community. After December 1st, the TSC members with terms not up for election will vote on the candidates using a multiple-winner method, members with expiring terms are recused from this vote due to conflict of interest. The elected TSC members will begin their term on January 1st.

#### Initial period

To provide consistency TSC elections will begin in 2021 for the 2022 term. Prior to the first election, half of the existing members will be selected via ["coin toss"](https://gist.github.com/leebyron/cbda7f0c604915d9200af5626b1fcf1b) to serve an initial one-year term.

#### Election dates

| Term        | Nominations open | Voting open | Term begins | Term ends    |
| ----------- | ---------------- | ----------- | ----------- | ------------ |
| 2022 - 2023 | Nov 1, 2021      | Dec 1, 2021 | Jan 1, 2022 | Dec 31, 2023 |
| 2023 - 2024 | Nov 1, 2022      | Dec 1, 2022 | Jan 1, 2023 | Dec 31, 2024 |
| 2024 - 2025 | Nov 1, 2023      | Dec 1, 2023 | Jan 1, 2024 | Dec 31, 2025 |

#### Resignation or removal of TSC members

A TSC member may voluntarily resign at any time before the end of their term by notifying the TSC chair. A TSC member may also be involuntarily removed by a supermajority (2/3) vote by TSC members.

After a TSC seat vacancy the remaining TSC will collect self-nominations and vote on a replacement member to complete the term. The nomination period should be open for at least two weeks, after which a vote shall be held.

## Voting process

When something cannot be decided by consensus or a formal vote is required, the TSC will use a method appropriate to the situation:

* Simple majority for single-winner votes.
* Condorcet method for multiple-winner votes.

The ballots may be public or private depending upon the situation, but the aggregate results should always be published.

### Defining a quorum of "attending" members

To balance preserving the voting ability of all TSC members with the desire for the voting process to remain efficient and avoid deadlocks, we define a valid quorum based on members' recent attendance of GraphQL Working Group meetings.

A quorum is a majority (more than half, or 2/3 for a supermajority vote) of the TSC *attending members*. A quorum must cast a ballot in order for a vote to be valid.

A TSC *attending member* is a member who has attended one of the previous three meetings. Should a TSC member miss three consecutive meetings, they will no longer be counted when determining quorum (but may still vote). A member starts counting towards quorum as of attending a meeting.

Note: A member may be recused (i.e. for a member election) in which case they do not count as an *attending member* for the purpose of that vote.

### Voting process

Because we work in a distributed environment, the voting process must account for a range of time zones and schedules. Once the threshold of a quorum has been met and a vote is valid, one of these two critera must be satisfied to conclude a vote:

* A notice is sent via email that the vote will conclude in three business days, reminding those who haven't voted that they should do so. The vote will conclude at the end of this time.
* The election results would not change if all remaining members were to vote.

Once a valid vote is concluded, the result is determined by the number of votes received at that time (as opposed to the total number of TSC members):

* For a single-winner simple majority (or supermajority), the votes in favor must exceed half (or 2/3) of the total number of votes.
* For a multiple-winner method, all votes received at the time the vote is concluded are considered.

### Non-votes

TSC members are not required to vote. There are three ways an *attending* member may reply to choose not to vote, each with a different intent and impact on the voting process:

* **Present:** A reply of "present" causes an *attending* member to count towards quorum, but does not count towards the number of votes. This has the practical impact of allowing progress towards reaching quorum while lowering the number of "yes" votes required for a motion to pass. A member may reply "present" if they support a motion reaching a result, but do not have a preference if it passes or fails.
* **Absent/Abstain:** A reply of "abstention" causes an *attending* member to neither count towards quorum, nor towards the number of votes. This is implied for any absent *attending* member which does not reply to a vote. This has the practical impact of hindering progress towards reaching quorum. A member may reply "abstain" if they do not support a motion reaching either result.
* **Recused:** A reply of "recusal" causes a member to not count as an *attending* member for the purposes of this vote. This has the practical impact of both lowering the number of *attending* members required to reach quorum, and the number of "yes" votes required for a motion to pass. A member may reply "recused" if they want to remove themselves to minimize their impact on a vote, often due to a conflict of interest.

Note: Non-attending members do not count towards quorum, and should they not vote are effectively recused.

### Voting procedure

Bringing this all together, here's a step-by-step procedure for administering a TSC vote:

1. Formally open a vote for a motion by opening a GitHub issue.
   * Most votes are held publicly, for those held privately, open an issue in a private forum.
1. Take attendence of all TSC members over the prior three meetings to determine *attending members* minus any recused.
   * If a vote is raised during a meeting, count the live meeting as the most recent of the three.
   * For an election vote, members with expiring terms are recused and not counted towards *attending members*.
1. Determine the *quorum threshold* as the next number larger than half of *attending members*, or 2/3 for a supermajority.
   * Examples: For 8 attending, a quorum threshold is 5. For 11 attending, quorum threshold is 6. For 9 attending, a supermajority quorum threshold is 7.
1. Gather votes from *all non-recused members* until the number of votes from *attending members* reaches *quorum threshold*.
   * A reply of "recused" requires recalculating *attending members* and *quorum threshold*.
   * A reply of "abstain" or "recused" does not count towards *quorum threshold*.
   * Send recurring reminders to remaining *attending members*.
1. Message that the vote will be closed in 3 business days, make good faith attempt at reaching out to all remaining members.
   * Conclude the vote early if no additional set of votes could change the outcome: e.g. for single-winner votes, 6 *yes votes* or 5 *no votes* are received for a majority vote, or 8 *yes votes* or 3 *no votes* for a supermajority.
   * Any "non-vote" replies lower the thresholds for early conclusion.
1. The resulting motion passes if the number of *yes votes* is a majority (or 2/3 supermajority) of *vote count*.
   * For a multiple-winner vote, the stack-ranked votes are prepared and fed to a multiple-winner algorithm.
1. Should a vote take place in a private forum, post the result in a public forum.

<details>
<summary>Typical example</summary>

Consider this scenario for a simple majority vote:

* 6 of 11 TSC members are considered *attending* members by having attended one of the last three WG meetings.
* Being a simple majority, more than half of this 6 must cast votes to reach quorum and consider the vote valid.
* 4 votes by *attending* members are cast, reaching quorum. The vote's outcome will be valid.
* An notice is sent out reminding all remaining members to cast a vote within three business days.
* 1 additional TSC *attending* member casts a vote.
* 3 non-attending members also cast a vote.
* Three days pass, the vote is concluded.
* A total of 8 votes have been cast.
* The votes in favor must exceed half of the 8 total votes.
* There must be at least 5 "yes" votes for the motion to pass.
</details>

<details>
<summary>Election example</summary>

Consider this scenario for a member election:

* 6 of 11 TSC members are considered *attending* members by having attended one of the last three WG meetings.
* However, 2 of those members have expiring terms and are recused for the member election.
* Thus 4 remain *attending* members for the purpose of this vote.
* More than half of this 4 (thus, 3) must cast votes to reach quorum and consider the vote valid.
* 3 votes by non-recused *attending* members are cast, reaching quorum. The vote's outcome will be valid.
* An notice is sent out reminding all remaining non-recused members to cast a vote within three business days.
* 1 additional TSC *attending* member casts a vote.
* 1 non-attending member also casts a vote.
* Three days pass, the vote is concluded.
* A total of 5 votes have been cast.
* The multiple-winner votes are input to a Condorcet algorithm to determine the outcome.
</details>

## Policies and procedures

The GraphQL TSC is governed by the [Technical Charter](https://github.com/graphql/foundation/blob/master/GraphQL%20Specification%20Membership%20Agreement%20February%202019.pdf).  The Charter provides a foundational structure for the TSC on topics such as its scope, how to make decisions, and how to make changes to itself.  At the same time, it grants the TSC a high degree of freedom when determining how to implement the policies of GraphQL.

The following policies and procedures have been adopted by the TSC.

### Making changes to this document

Pull requests against this document that do not conflict with the [Technical Charter](https://github.com/graphql/foundation/blob/master/GraphQL%20Specification%20Membership%20Agreement%20February%202019.pdf) can be merged provided the following conditions have been met:

* There are no outstanding objections
* There are two approvals by TSC members (not including the author)
* The PR has been open for at least 72 hours

Pull requests that change governance of the TSC (excluding the charter) must be open for at least 14 days, unless consensus is reached in a meeting with quorum of TSC *attending* members.

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
