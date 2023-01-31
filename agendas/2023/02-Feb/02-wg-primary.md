<!--

# How to join (copied directly from /JoiningAMeeting.md)

Hello! You're welcome to join our working group meeting and add to the agenda
by following these three steps:

1.  Add your name to the list of attendees (in alphabetical order).

    - To respect meeting size, attendees should be relevant to the agenda.
      That means we expect most who join the meeting to participate in
      discussion. If you'd rather just watch, check out our [YouTube][].

    - Please include the organization (or project) you represent, and the
      location (including [country code][]) you expect to be located in during
      the meeting.

    - If you're willing to help take notes, add "✏️" after your name
      (eg. Ada Lovelace ✏). This is hugely helpful!

2.  If relevant, add your topic to the agenda (sorted by expected time).

    - Every agenda item has four parts: 1) the topic, 2) an expected time
      constraint, 3) who's leading the discussion, and 4) a list of any
      relevant links (RFC docs, issues, PRs, presentations, etc). Follow the
      format of existing agenda items.

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

    - If this is your first time, our bot will comment on your Pull Request
      with a link to our Spec Membership & CLA. Please follow along and agree
      before your PR is merged.

      Your organization may sign this for all of its members. To set this up,
      please ask operations@graphql.org.

PLEASE TAKE NOTE:

- By joining this meeting you must agree to the Specification Membership
  Agreement and Code of Conduct.

- Meetings are recorded and made available on [YouTube][], by joining you
  consent to being recorded.

[youtube]: https://www.youtube.com/channel/UCERcwLeheOXp_u61jEXxHMA
[country code]: https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes#Current_ISO_3166_country_codes
[rfc stages]: https://github.com/graphql/graphql-spec/blob/main/CONTRIBUTING.md#rfc-contribution-stages

-->

| This is an open meeting: To attend, read [JoiningAMeeting.md](https://github.com/graphql/graphql-wg/blob/main/JoiningAMeeting.md) then edit and PR this file. (Edit ✎ 🡕) |
| ---------------------------------------------------------------------------------------- |

# GraphQL WG – February 2023 (Primary)

The GraphQL Working Group meets regularly to discuss changes to the
[GraphQL Specification][] and other core GraphQL projects. This is an open
meeting in which anyone in the GraphQL community may attend.

This is our primary monthly meeting, which typically meets on the first Thursday
of the month. In the case we have additional agenda items or follow ups, we also
hold additional secondary meetings later in the month.

- **Date & Time**: [February 2nd 2023 10:30am - 12:00noon PT](https://www.timeanddate.com/worldclock/converter.html?iso=20230202T183000&p1=224&p2=179&p3=136&p4=268&p5=367&p6=438&p7=248&p8=240)
  - View the [calendar][], or subscribe ([Google Calendar][], [ical file][]).
  - _Please Note:_ The date or time may change. Please check this agenda the
    week of the meeting to confirm. While we try to keep all calendars accurate,
    this agenda document is the source of truth.
- **Video Conference Link**: https://zoom.us/j/593263740
  - _Password:_ graphqlwg
- **Live Notes**: [Google Doc]()

[graphql specification]: https://github.com/graphql/graphql-spec
[calendar]: https://calendar.google.com/calendar/embed?src=linuxfoundation.org_ik79t9uuj2p32i3r203dgv5mo8%40group.calendar.google.com
[google calendar]: https://calendar.google.com/calendar?cid=bGludXhmb3VuZGF0aW9uLm9yZ19pazc5dDl1dWoycDMyaTNyMjAzZGd2NW1vOEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t
[ical file]: https://calendar.google.com/calendar/ical/linuxfoundation.org_ik79t9uuj2p32i3r203dgv5mo8%40group.calendar.google.com/public/basic.ics

## Attendees

| Name             | GitHub        | Organization       | Location              |
| :--------------- | :------------ | :----------------- | :-------------------- |
| Lee Byron (Host) | @leebyron     | GraphQL Foundation | San Francisco, CA, US |
| Benjie Gillam    | @benjie       | Graphile           | Chandler's Ford, UK   |
| Denis Badurina   | @enisdenjo    | The Guild          | Vienna, AT            |
| Ivan Goncharov   | @IvanGoncharov | Apollo            | Lviv, UA              |
| Matt Mahoney     | @mjmahone      | Meta              | New York, NY, US      |

## Agenda

1. Agree to Membership Agreement, Participation & Contribution Guidelines and Code of Conduct (1m, Lee)
   - [Specification Membership Agreement](https://github.com/graphql/foundation)
   - [Participation Guidelines](https://github.com/graphql/graphql-wg#participation-guidelines)
   - [Contribution Guide](https://github.com/graphql/graphql-spec/blob/main/CONTRIBUTING.md)
   - [Code of Conduct](https://github.com/graphql/foundation/blob/master/CODE-OF-CONDUCT.md)
1. Introduction of attendees (5m, Lee)
1. Determine volunteers for note taking (1m, Lee)
1. Review agenda (2m, Lee)
1. Review prior secondary meetings (5m, Lee)
   - [WG secondary APAC](https://github.com/graphql/graphql-wg/blob/main/agendas/2023/01-Jan/11-wg-secondary-apac.md)
   - [WG secondary EU](https://github.com/graphql/graphql-wg/blob/main/agendas/2023/01-Jan/19-wg-secondary-eu.md)
1. Review previous meeting's action items (5m, Lee)
   - [Ready for review](https://github.com/graphql/graphql-wg/issues?q=is%3Aissue+is%3Aopen+label%3A%22Ready+for+review+%F0%9F%99%8C%22+sort%3Aupdated-desc)
   - [All open action items (by last update)](https://github.com/graphql/graphql-wg/issues?q=is%3Aissue+is%3Aopen+label%3A%22Action+item+%3Aclapper%3A%22+sort%3Aupdated-desc)
   - [All open action items (by meeting)](https://github.com/graphql/graphql-wg/projects?query=is%3Aopen+sort%3Aname-asc)
1. **TSC**: Election Results (5m, TSC)
1. **TSC**: Management of build and publish infrastructure, secrets, etc (20m, Benjie / Rikki)
   - This meeting is being recorded, so be mindful of the audience - we can take some of these communications private if need be
   - GraphiQL's last publish was partially unsuccessful due to token issues: https://github.com/graphql/graphiql/issues/2997
   - GraphQL Foundation should have a more robust process for handling planned or emergency token revokation for individuals
   - [Rikki has proposed a solution](https://gist.github.com/benjie/739e119b68422a14864486a9ff0b2a8c)
1. Fix ambiguity around when schema definition may be omitted (10m, Benjie)
   - [RFC](https://github.com/graphql/graphql-spec/pull/987); previously discussed in September
   - Aim: merge this (mostly) editorial change
1. Advance argument name uniqueness to Stage 3 (10m, Benjie)
   - [RFC](https://github.com/graphql/graphql-spec/pull/891)
   - [GraphQL.js implementation is merged](https://github.com/graphql/graphql-js/pull/3208)
1. `@defer`: fully deduplicate response (30m, Ivan)
   - [RFC] (https://github.com/robrichard/defer-stream-wg/discussions/65#discussioncomment-4757697)
   - GraphQL.js implementation: TBD
