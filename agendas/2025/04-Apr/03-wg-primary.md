<!--

# How to join (copied directly from /JoiningAMeeting.md)

Hello! You're welcome to join our working group meeting and add to the agenda by
following these three steps:

1.  Add your name to the list of attendees (in alphabetical order).

    - To respect meeting size, attendees should be relevant to the agenda. That
      means we expect most who join the meeting to participate in discussion. If
      you'd rather just watch, check out our [YouTube][].

    - Please include the organization (or project) you represent, and the
      location (including [country code][]) you expect to be located in during
      the meeting.

    - If you're willing to help take notes, add "✏️" after your name (eg. Ada
      Lovelace ✏). This is hugely helpful!

2.  If relevant, add your topic to the agenda (sorted by expected time).

    - Every agenda item has four parts: 1) the topic, 2) an expected time
      constraint, 3) who's leading the discussion, and 4) a list of any relevant
      links (RFC docs, issues, PRs, presentations, etc). Follow the format of
      existing agenda items.

    - Know what you want to get out of the agenda topic - what feedback do you
      need? What questions do you need answered? Are you looking for consensus
      or just directional feedback?

    - If your topic is a new proposal it's likely an ["RFC 0"][rfc stages]. The
      barrier of entry for documenting new proposals is intentionally low,
      writing a few sentences about the problem you're trying to solve and the
      rough shape of your proposed solution is normally sufficient.

      You can create a link for this:

      - As an issue against the graphql-wg repo.
      - As a GitHub discussion in the graphql-wg repo.
      - As an RFC document into the rfcs/ folder of the graphql-wg repo.

3.  Review our guidelines and agree to our Spec Membership & CLA.

    - Review and understand our Spec Membership Agreement, Participation &
      Contribution Guidelines, and Code of Conduct. You'll find links to these
      in the first agenda item of every meeting.

    - If this is your first time, our bot will comment on your Pull Request with
      a link to our Spec Membership & CLA. Please follow along and agree before
      your PR is merged.

      Your organization may sign this for all of its members. To set this up,
      please ask operations@graphql.org.

PLEASE TAKE NOTE:

- By joining this meeting you must agree to the Specification Membership
  Agreement and Code of Conduct.

- Meetings are recorded and made available on [YouTube][], by joining you
  consent to being recorded.

[youtube]: https://www.youtube.com/channel/UCERcwLeheOXp_u61jEXxHMA
[country code]:
  https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes#Current_ISO_3166_country_codes
[rfc stages]:
  https://github.com/graphql/graphql-spec/blob/main/CONTRIBUTING.md#rfc-contribution-stages


-->

| This is an open meeting: To attend, read [JoiningAMeeting.md][] then edit and PR this file. (Edit: ✎ above, or press "e") |
| ---------------------------------------------------------------------------------------- |

# GraphQL WG — April 2025 (Primary)

The GraphQL Working Group meets regularly to discuss changes to the
[GraphQL Specification][] and other core GraphQL projects. This is an open
meeting in which anyone in the GraphQL community may attend.

This is the primary monthly meeting, which typically meets on the first Thursday
of the month. In the case we have additional agenda items or follow ups, we also
hold additional secondary meetings later in the month.

- **Date & Time**: [April 3, 2025, 10:30 AM – 12:00 PM PDT](https://www.timeanddate.com/worldclock/converter.html?iso=20250403T173000&p1=224&p2=179&p3=136&p4=268&p5=367&p6=438&p7=248&p8=240)
  - View the [calendar][], or subscribe ([Google Calendar][], [ical file][]).
  - _Please Note:_ The date or time may change. Please check this agenda the
    week of the meeting to confirm. While we try to keep all calendars accurate,
    this agenda document is the source of truth.
- **Video Conference Link**: https://zoom.us/j/593263740
  - _Password:_ graphqlwg
- **Live Notes**: [Live Notes][]

[calendar]: https://calendar.google.com/calendar/embed?src=linuxfoundation.org_ik79t9uuj2p32i3r203dgv5mo8%40group.calendar.google.com
[google calendar]: https://calendar.google.com/calendar?cid=bGludXhmb3VuZGF0aW9uLm9yZ19pazc5dDl1dWoycDMyaTNyMjAzZGd2NW1vOEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t
[ical file]: https://calendar.google.com/calendar/ical/linuxfoundation.org_ik79t9uuj2p32i3r203dgv5mo8%40group.calendar.google.com/public/basic.ics
[graphql specification]: https://github.com/graphql/graphql-spec
[JoiningAMeeting.md]: https://github.com/graphql/graphql-wg/blob/main/JoiningAMeeting.md
[live notes]: https://docs.google.com/document/d/1q-sT4k8-c0tcDYJ8CxPZkJ8UY4Nhk3HbKsRxosu_7YE/edit?usp=sharing

## Attendees

<!-- prettier-ignore -->
| Name             | GitHub        | Organization       | Location              |
| :--------------- | :------------ | :----------------- | :-------------------- |
| Lee Byron (Host) | @leebyron     | GraphQL Foundation | San Francisco, CA, US |
| Benjie Gillam    | @benjie       | Graphile           | Chandler's Ford, UK   |
| Martin Bonnin    | @martinbonnin | Apollo             | Paris, FR             |
| Alex Reilly      | @twof         | DoorDash           | San Francisco, CA, US |


## Agenda

1. Agree to Membership Agreement, Participation & Contribution Guidelines and Code of Conduct (1m, Host)
   - [Specification Membership Agreement](https://github.com/graphql/foundation)
   - [Participation Guidelines](https://github.com/graphql/graphql-wg#participation-guidelines)
   - [Contribution Guide](https://github.com/graphql/graphql-spec/blob/main/CONTRIBUTING.md)
   - [Code of Conduct](https://github.com/graphql/foundation/blob/master/CODE-OF-CONDUCT.md)
   - Meetings are [published to YouTube](https://www.youtube.com/@GraphQLFoundation/videos) and we may use LLM/AI summary tools
1. Introduction of attendees (5m, Host)
1. Determine volunteers for note taking (1m, Host)
1. Review agenda (2m, Host)
1. Check for [ready for review agenda items](https://github.com/graphql/graphql-wg/issues?q=is%3Aissue+is%3Aopen+label%3A%22Ready+for+review+%F0%9F%99%8C%22+sort%3Aupdated-desc) (5m, Host)
1. [Let's set a July 1st deadline for spec release](https://github.com/graphql/graphql-wg/issues/1692) (5m, Benjie)
1. [Replace ExecuteSelectionSet with ExecuteGroupedFieldSet](https://github.com/graphql/graphql-spec/pull/1039) (5m, Benjie)
   - Editorial needed by fragment arguments and incremental delivery; let's get it merged!
1. [Rename "field error" to "execution error" and fix various bugs and ambiguities](https://github.com/graphql/graphql-spec/pull/1152) (5m, Benjie)
1. Make `includeDeprecated` non-null (10m, Martin)
    - https://github.com/graphql/graphql-spec/pull/1142
    - advance to RFC2/RFC3?
1. [Consistently use "response name" over "response key"](https://github.com/graphql/graphql-spec/pull/1147) (5m, Benjie)
1. [Clarify 'before execution begins'](https://github.com/graphql/graphql-spec/pull/894) (5m, Benjie)
   - Editorial, aim: merge.
1. [Add 'extensions' to request](https://github.com/graphql/graphql-spec/pull/976) (2m, Benjie)
   - RFC2, no GraphQL.js changes needed. 4 TSC approvals. Plan: RFC3.
1. [Implementations may not deprecate a field that the interface hasn't deprecated](https://github.com/graphql/graphql-spec/pull/1053) (2m, Benjie)
   - RFC2, 4 TSC approvals, [GraphQL.js PR merged](https://github.com/graphql/graphql-js/pull/3986). Plan: RFC3.
1. [Prevent @skip and @include on root subscription selection set](https://github.com/graphql/graphql-spec/pull/860) (5m, Benjie)
   - RFC2, GraphQL.js merged. Aim: RFC3.
1. [Clarify 'Values of Correct Type' rule relates to literals](https://github.com/graphql/graphql-spec/pull/1118) (5m, Benjie)
   - Editorial. Aim: merge. Needed by oneOf.
1. [OneOf Input Objects](https://github.com/graphql/graphql-spec/pull/825) (10m, Benjie)
   - RFC2. Implemented unflagged in GraphQL.js 15, 16; GraphQL.NET v8; GraphQL Java v21.2. Aim: RFC3.
1. [Default value coercion rules](https://github.com/graphql/graphql-spec/pull/793) (15m, Benjie)
   - RFC2, [GraphQL.js PR merged](https://github.com/graphql/graphql-js/pull/3814). Aim: RFC3.
1. [Define Data Collections used in the spec](https://github.com/graphql/graphql-spec/pull/1102) (20m, Benjie)
   - RFC2, aim: RFC3.
   - Then: [Recommend that order of unordered collections is maintained where possible](https://github.com/graphql/graphql-spec/pull/1092)
     - RFC2, aim: RFC3.
     - Then: [Type system ordering of: object interfaces, directive arguments, input object fields, enum values](https://github.com/graphql/graphql-spec/pull/1063)
       - RFC2, aim: RFC3.
1. Reaching a consensus on Semantic Nullability (25m, Alex)
1. Disabling error propagation proposal (10m, Alex)
1. Appendix C: Type System Definitions (5m, Martin)
  - https://github.com/graphql/graphql-spec/pull/1037
