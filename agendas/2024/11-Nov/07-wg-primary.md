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

# GraphQL WG — November 2024 (Primary)

The GraphQL Working Group meets regularly to discuss changes to the
[GraphQL Specification][] and other core GraphQL projects. This is an open
meeting in which anyone in the GraphQL community may attend.

This is the primary monthly meeting, which typically meets on the first Thursday
of the month. In the case we have additional agenda items or follow ups, we also
hold additional secondary meetings later in the month.

- **Date & Time**: [November 7, 2024, 10:30 AM – 12:00 PM PST](https://www.timeanddate.com/worldclock/converter.html?iso=20241107T183000&p1=224&p2=179&p3=136&p4=268&p5=367&p6=438&p7=248&p8=240)
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
| Martin Bonnin | @martinbonnin     | Apollo | Paris, FR |
| Greg Wardwell | @gwardwell     | Wayfair | Fort Wayne, IN, USA |
| Rob Richard   | @robrichard    | 1stDibs | New Jersey, US |
| Kewei Qu      | @Keweiqu       | Meta    | Menlo Park, CA, US |
| Benjie Gillam | @benjie        | Graphile | Chandler's Ford, UK |

## Agenda

1. Agree to Membership Agreement, Participation & Contribution Guidelines and Code of Conduct (1m, Host)
   - [Specification Membership Agreement](https://github.com/graphql/foundation)
   - [Participation Guidelines](https://github.com/graphql/graphql-wg#participation-guidelines)
   - [Contribution Guide](https://github.com/graphql/graphql-spec/blob/main/CONTRIBUTING.md)
   - [Code of Conduct](https://github.com/graphql/foundation/blob/master/CODE-OF-CONDUCT.md)
1. Introduction of attendees (5m, Host)
1. Determine volunteers for note taking (1m, Host)
1. Review agenda (2m, Host)
1. Review prior secondary meetings (5m, Host)
   - [GraphQL WG — October 2024 (Secondary, APAC)](https://github.com/graphql/graphql-wg/blob/main/agendas/2024/10-Oct/09-wg-secondary-apac.md)
   - [GraphQL WG — October 2024 (Secondary, EU)](https://github.com/graphql/graphql-wg/blob/main/agendas/2024/10-Oct/17-wg-secondary-eu.md)
1. Review previous meeting's action items (5m, Host)
   - [Ready for review](https://github.com/graphql/graphql-wg/issues?q=is%3Aissue+is%3Aopen+label%3A%22Ready+for+review+%F0%9F%99%8C%22+sort%3Aupdated-desc)
   - [All open action items (by last update)](https://github.com/graphql/graphql-wg/issues?q=is%3Aissue+is%3Aopen+label%3A%22Action+item+%3Aclapper%3A%22+sort%3Aupdated-desc)
   - [All open action items (by meeting)](https://github.com/graphql/graphql-wg/projects?query=is%3Aopen+sort%3Aname-asc)
1. Make `reason` non-nullable in `@deprecated` (@martinbonnin, 5 min)
   - https://github.com/graphql/graphql-spec/pull/1040
1. Discuss enhancing deprecation (@gwardwell, 15 min)
   - Align on next steps for expanded client use cases (union member and interface implementation deprecation)
   - Align on next steps for service/development use cases (deprecation as communication for distributed schema development)
   - Issue for context: https://github.com/graphql/graphql-spec/issues/1119
   - Open object type deprecation PR: https://github.com/graphql/graphql-spec/pull/997
1. Incremental Delivery update (@robrichard, 15 min)
   - Asking for review of spec edits
   - [PR open against integration branch, containing only sections 3 & 7](https://github.com/graphql/graphql-spec/pull/1124)
   - [Full PR](https://github.com/graphql/graphql-spec/pull/1110)
