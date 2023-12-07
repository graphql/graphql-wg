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

| This is an open meeting: To attend, read [JoiningAMeeting.md][] then edit and PR this file. (Edit: ✎ above, or press "e") |
| ---------------------------------------------------------------------------------------- |

# GraphQL WG – December 2023 (Primary)

The GraphQL Working Group meets regularly to discuss changes to the
[GraphQL Specification][] and other core GraphQL projects. This is an open
meeting in which anyone in the GraphQL community may attend.

This is the primary monthly meeting, which typically meets on the first Thursday
of the month. In the case we have additional agenda items or follow ups, we also
hold additional secondary meetings later in the month.

- **Date & Time**: [December 7, 2023, 10:30 AM – 12:00 PM PST](https://www.timeanddate.com/worldclock/converter.html?iso=20231207T183000&p1=224&p2=179&p3=136&p4=268&p5=367&p6=438&p7=248&p8=240)
  - View the [calendar][], or subscribe ([Google Calendar][], [ical file][]).
  - _Please Note:_ The date or time may change. Please check this agenda the
    week of the meeting to confirm. While we try to keep all calendars accurate,
    this agenda document is the source of truth.
- **Video Conference Link**: https://zoom.us/j/593263740
  - _Password:_ graphqlwg
- **Live Notes**: [Google Doc Notes][]

[joiningameeting.md]: https://github.com/graphql/graphql-wg/blob/main/JoiningAMeeting.md
[graphql specification]: https://github.com/graphql/graphql-spec
[calendar]: https://calendar.google.com/calendar/embed?src=linuxfoundation.org_ik79t9uuj2p32i3r203dgv5mo8%40group.calendar.google.com
[google calendar]: https://calendar.google.com/calendar?cid=bGludXhmb3VuZGF0aW9uLm9yZ19pazc5dDl1dWoycDMyaTNyMjAzZGd2NW1vOEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t
[ical file]: https://calendar.google.com/calendar/ical/linuxfoundation.org_ik79t9uuj2p32i3r203dgv5mo8%40group.calendar.google.com/public/basic.ics
[google doc notes]: https://docs.google.com/document/d/1q-sT4k8-c0tcDYJ8CxPZkJ8UY4Nhk3HbKsRxosu_7YE/edit?usp=sharing

## Attendees

<!-- prettier-ignore -->
| Name             | GitHub        | Organization       | Location              |
| :--------------- | :------------ | :----------------- | :-------------------- |
| Lee Byron (Host) | @leebyron     | GraphQL Foundation | San Francisco, CA, US |
| Benjie Gillam    | @benjie       | Graphile           | Chandler's Ford, UK   |
| Matt Mahoney     | @mjmahone     | Meta               | New York, NY, US      |
| Jeff Auriemma    | @bignimbus    | Apollo             | Monroe, CT, US        |
| Alex Reilly      | @twof         | Independent        | San Francisco, CA, US |
| Phil Prasek      | @prasek       | Apollo             | Seattle, WA, US       |
| Martijn Walraven | @martijnwalraven | Apollo          | Amsterdam, NL         |
| Michael Staib    | @michaelstaib | ChilliCream        | ChilliCream, CH       |
| Antoine Boyer    | @tinnou       | Netflix            | San Jose, CA, US      |

## Agenda

1. Agree to Membership Agreement, Participation & Contribution Guidelines and Code of Conduct (1m, Lee)
   - [Specification Membership Agreement](https://github.com/graphql/foundation)
   - [Participation Guidelines](https://github.com/graphql/graphql-wg#participation-guidelines)
   - [Contribution Guide](https://github.com/graphql/graphql-spec/blob/main/CONTRIBUTING.md)
   - [Code of Conduct](https://github.com/graphql/foundation/blob/master/CODE-OF-CONDUCT.md)
1. Introduction of attendees (5m, Lee)
1. Determine volunteers for note taking (1m, Lee)
1. Review agenda (2m, Lee)
1. Updates from the group formerly known as the Client Controlled Nullability WG (5m, Alex)
1. ~~Review prior secondary meetings (5m, Lee)~~
   - ~~[November WG Secondary, APAC](https://github.com/graphql/graphql-wg/blob/main/agendas/2023/11-Nov/08-wg-secondary-apac.md)~~
   - ~~[November WG Secondary, EU](https://github.com/graphql/graphql-wg/blob/main/agendas/2023/11-Nov/16-wg-secondary-eu.md)~~
1. Subcommittee to work on standardizing distributed schemas (15m, Jeff)
   - There has been a lot of new excitement across the community around standardizing on an approach for working with distributed schemas, ranging from Open Federation to Fusion
   - We (Apollo) are excited about these developments, and are looking forward to working with others on this standardization approach
   - We haven't seen the afore mentioned standardization efforts be brought to the Working Group yet, so we'd like to get the ball rolling and start discussions
   - Should we start the [composite schema](https://github.com/graphql/composite-schemas-wg) subcommittee back up, to collaborate more closely? Or would folks like to explore an alternative approach?
   - Regardless, let's get the discussions going - super exciting!
1. Review previous meeting's action items (30m, Benjie)
   - https://github.com/graphql/graphql-wg/issues/1345 - everyone review default
     value validation
     - Sufficient review time has elapsed; [RFC](https://github.com/graphql/graphql-spec/pull/793) is at stage 2 already - needs GraphQL.js merge for stage 3
   - https://github.com/graphql/graphql-wg/issues/695 - no `@skip`/`@include` on
     subscriptions - raise GraphQL.js PR
     - [GraphQL.js PR](https://github.com/graphql/graphql-js/pull/3974) raised
     - Can we bump [RFC](https://github.com/graphql/graphql-spec/pull/860) to RFC2?
   - https://github.com/graphql/graphql-wg/issues/1331 - if interface field
     deprecated, then object field should be deprecated
     - [Spec PR](https://github.com/graphql/graphql-spec/pull/1053) and
       [GraphQL.js PR](https://github.com/graphql/graphql-js/pull/3986) raised
     - Advance to RFC1?
   - https://github.com/graphql/graphql-wg/issues/1336 - coercing variable
     values in lists; clarify spec text
     - Discussed December 2022, but the issue was misinterpretted; it relates to
       variables inside _lists_, not in arguments directly
     - Spec editorial PR:
       [fix bug in list coercion example table](https://github.com/graphql/graphql-spec/pull/1057/files)
     - Agenda item below: "Detail variables in list input coercion rules"
   - https://github.com/graphql/graphql-wg/issues/1414 - example of executing
     _selection set_ serially, readers expect an operation; clarify
     - Spec editorial PR:
       [define "selection set" and clarify examples in section 6](https://github.com/graphql/graphql-spec/pull/1032)
   - https://github.com/graphql/graphql-wg/issues/1337 - forbid nullable
     variable with default in non-nullable position
     - Agenda item below: "Introduce Strict and Legacy All Variable Usages Are
       Allowed validation rules"
   - https://github.com/graphql/graphql-wg/issues/1413 - close all aging action
     items
     - [Stale closed items](https://github.com/graphql/graphql-wg/issues?q=is%3Aissue+is%3Aclosed+sort%3Aupdated-desc+label%3Astale+)
     - Note: not all items closed were "action items"
   - [All open action items (by last update)](https://github.com/graphql/graphql-wg/issues?q=is%3Aissue+is%3Aopen+label%3A%22Action+item+%3Aclapper%3A%22+sort%3Aupdated-desc)
   - [All open action items (by meeting)](https://github.com/graphql/graphql-wg/projects?type=classic&query=is%3Aopen+sort%3Aupdated-desc)
1. Fix bug in CoerceArgumentValues() algorithm (10m, Benjie)
   - [Spec PR](https://github.com/graphql/graphql-spec/pull/1056)
   - No GraphQL.js PR needed, GraphQL.js already implements the correct behavior
   - Spec bug: RFC process, or editorial?
1. Detail variables in list input coercion rules (15m, Benjie)
   - [Spec PR](https://github.com/graphql/graphql-spec/pull/1058)
   - GraphQL.js already implements the correct behavior?
   - Previously discussed (but incorrectly interpreted) in December 2022:
     https://github.com/graphql/graphql-wg/blob/main/notes/2022/2022-12.md?rgh-link-date=2023-07-08T08%3A09%3A10Z#field-error-resulting-from-insufficient-validation-of-variables-15m-benjie
   - Not really changing behavior, just _defining_ the status quo... Editorial, or RFC process?
1. Introduce Strict and Legacy All Variable Usages Are Allowed validation rules
   (15m, Benjie)
   - [Spec PR](https://github.com/graphql/graphql-spec/pull/1059)
   - Aim: before I go about implementing this in GraphQL.js, are we agreed this
     is the right solution? RFC1?
   - Question: should we enable the new algorithm by default in the next major
     bump of GraphQL.js, and enable users to opt-in to the old version if they
     need to?
