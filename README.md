![GraphQLConf 2024 banner: September 10-12, San Francisco. Hosted by the GraphQL Foundation](https://github.com/user-attachments/assets/cd43e796-fd2e-41dd-b4e1-f03557e62b30)

# GraphQL Working Group

GraphQL WG (Working Group) is a set of recurring virtual meetings of maintainers
of commonly used GraphQL libraries and tools and significant contributors to the
GraphQL community hosted by the [GraphQL TSC][] as part of the [GraphQL
Foundation][].

[graphql tsc]: ./GraphQL-TSC.md
[graphql foundation]: https://graphql.org/foundation/

The GraphQL WG's primary purpose is to discuss and agree upon proposed additions
to the [GraphQL Specification](https://github.com/graphql/graphql-spec) via the
[RFC process](https://github.com/graphql/graphql-spec/blob/main/CONTRIBUTING.md).
Additionally, the group may discuss and collaborate on other relevant technical
topics concerning core GraphQL projects.

Anyone in the public GraphQL community may attend a GraphQL WG meeting, provided
they first sign the [Specification Membership Agreement](./membership) or belong
to an organization which has signed.

This repository holds [agendas](./agendas) and [notes](./notes) for all meetings
past and upcoming as well as [shared rfc documents](./rfcs). Anyone may edit an
upcoming event's agenda to _attend_ or _propose an agenda item_.

All meetings occur via video conference, however participating company offices
are welcome to host guests.

To learn more, read our guide on how to [join a meeting](./JoiningAMeeting.md).

# Upcoming meetings

| Meeting              | Time                            | Host                                     |
| -------------------- | ------------------------------- | ---------------------------------------- |
| WG (Primary)         | 1st Thu, 10:30am - 12:00noon PT | [Lee Byron](https://github.com/leebyron) |
| WG (Secondary, APAC) | 2nd Wed, 3:30pm - 5:00pm PT     | [Lee Byron](https://github.com/leebyron) |
| WG (Secondary, EU)   | 3rd Thu, 10:30am - 12:00noon PT | [Lee Byron](https://github.com/leebyron) |

The primary monthly meeting is preferred for new agenda. The secondary meetings
are for overflow agenda items, follow ups from the primary meeting, or agenda
introduced by those who could not make the primary meeting time. There are two
secondary meetings, each timed to be acceptable for those in either an Asia
Pacific or European timezone.

Meetings are typically scheduled at the times listed, however always check the
[agenda](./agendas) for the exact date and time of an upcoming meeting. Keep
track of future upcoming meetings by subscribing to the [Google Calendar][] or
[ical][].

[google calendar]:
  https://calendar.google.com/calendar?cid=bGludXhmb3VuZGF0aW9uLm9yZ19pazc5dDl1dWoycDMyaTNyMjAzZGd2NW1vOEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t
[ical]:
  https://calendar.google.com/calendar/ical/linuxfoundation.org_ik79t9uuj2p32i3r203dgv5mo8%40group.calendar.google.com/public/basic.ics

To create the agenda files for a given month YYYY/MM, run the following command:

```
yarn && yarn gen-agenda YYYY MM
```

### Subcommittee meetings

The GraphQL WG has subcomittees who focus on the development of specific
projects beyond the GraphQL Spec. These subcomittees make progress within their
own meetings and report back progress and decisions to GraphQL WG meetings.

| Subcommittee         | Time                           | Host                                               | Agenda Repo                                                                                                     |
| -------------------- | ------------------------------ | -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| GraphiQL             | 2nd Tue, 9:00am - 11:00am PT   | [Tim Suchanek](https://github.com/timsuchanek)     | [graphql/graphiql/working-group](https://github.com/graphql/graphiql/tree/main/working-group)                   |
| GraphQL-over-HTTP    | 4th Thu, 17:30 - 18:30 UTC     | [Benjie Gillam](https://github.com/benjie)         | [graphql/graphql-over-http/working-group](https://github.com/graphql/graphql-over-http/tree/main/working-group) |
| Incremental Delivery | 2nd Mon, 10:00am - 11:00am EST | [Rob Richard](https://github.com/robrichard)       | [robrichard/defer-stream-wg](https://github.com/robrichard/defer-stream-wg)                                     |
| Nullability          | 4th Wed, 19:00 - 20:00 UTC     | [Stephen Spalding](https://github.com/fotoetienne) | [graphql/client-controlled-nullability-wg](https://github.com/graphql/client-controlled-nullability-wg)         |
| Composite Schema     | 2nd Thu, 16:00am - 17:00am UTC | [Benjie Gillam](https://github.com/benjie)         | [graphql/composite-schemas-wg](https://github.com/graphql/composite-schemas-wg)                                 |
| GraphQL.js           | 4th Wed, 10:00am - 11:00am PT  | [Jovi DeCroock](https://github.com/JoviDeCroock)   | [graphql/graphql-js-wg](https://github.com/graphql/graphql-js-wg)                                               |

#### Subcommittees on hiatus

These subcommittees are currently not meeting, typically due to lack of agenda
topics. Should you have a topic to discuss that applies to a subcommittee that
is on hiatus, please raise an issue in the WG repository and mention the host.

<!-- prettier-ignore -->
| Subcommittee         | Time                           | Host                                               | Agenda Repo                                                                                                     |
| -------------------- | ------------------------------ | -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |

### Joining a meeting?

To request participation in an upcoming meeting, please send a pull request by
editing the relevant [meeting agenda](./agendas).

### Want to help us keep up?

We're always looking for volunteers to help take notes from the meetings, the
results of which are shared in [`notes/`](./notes). If you're interested in
taking notes, sign up for a meeting in [`agendas/`](./agendas) and indicate that
you're willing to be a note taker.

# Participation guidelines

Meetings with many participants, especially over video, can easily get hard to
follow or run off course. When we talk about issues we care about, it's easy to
get into heated debate. In order to respect everyone's time, and arrive to
worthwhile outcomes, consider a few guidelines:

_These guidelines are heavily inspired by
[Allen Wirfs-Brock](http://wirfs-brock.com/allen/files/papers/standpats-asianplop2016.pdf)._

### Participate

Being in the room when decisions are being made is exciting, but meetings with
large groups of people are much more difficult to follow. Only attend if an
agenda item directly concerns you and your work, and you expect to participate.

### Don't talk too much

The biggest distraction with many people on a video call is interruption, and
interruptions are frequent when someone is talking for too long. Only speak up
if you have something important to add to the discussion and be courteous of
others and avoid interruption.

### Volunteer to take notes

The rest of the community follows along with the group's discussion by reading
the meeting notes. Volunteering to take notes is a great service to that
community and a great way to participate if you don't have an agenda item.

### Have an outcome in mind

Know what you and your organization wish to accomplish from the meeting and make
that clear to the group to keep discussion focused on what's valuable to your
agenda item. Complex or challenging outcomes might take intermediate goals
across multiple meetings.

### Contribute

Projects like GraphQL succeed when their leaders are active contributors more
than passive participants. Follow up on your discussion with pull requests to
projects, or planned events.

### Choose your battles

We're all passionate about GraphQL and it's easy to get mired with an opinion in
every agenda item. There are many ways to solve a problem and you won't always
agree with all of them. Express your views but don't argue about a topic that is
not relevant to your goals.

### Champion alternatives

Sometimes you'll disagree with someone but will find it difficult or impossible
to convince them of the problems you see. Instead of spending your energy
fighting, commit to developing an alternative proposal so future discussion can
be about substance.

### Block progress as a last resort

This working group is only effective when consensus can be reached, even though
there may be disagreements along the way. You should avoid blocking progress if
possible, otherwise you may be seen as hostile to the group. However, if you
have a serious issue with a proposed agenda item outcome, you must make it
clear.

### Be patient and persistent

The GraphQL specification evolves slowly, deliberately, and with the consensus
of the core GraphQL community. The spec
[contribution process](https://github.com/graphql/graphql-spec/blob/master/CONTRIBUTING.md)
requires considerable investment through multiple stages while meeting a
demanding set of guiding principles. This can take a long time, and progress in
each meeting can feel small. Don't give up!

# Contributing to this repo

This repository is managed by EasyCLA. Project participants must sign the free
([GraphQL Specification Membership agreement](https://preview-spec-membership.graphql.org)
before making a contribution. You only need to do this one time, and it can be
signed by
[individual contributors](http://individual-spec-membership.graphql.org/) or
their [employers](http://corporate-spec-membership.graphql.org/).

To initiate the signature process please open a PR against this repo. The
EasyCLA bot will block the merge if we still need a membership agreement from
you.

You can find
[detailed information here](https://github.com/graphql/graphql-wg/tree/main/membership).
If you have issues, please email
[operations@graphql.org](mailto:operations@graphql.org).

## Commit access

Commit access is granted to this repo to members of the
[GraphQL TSC](./GraphQL-TSC.md) and some regular attendees of working group
meetings. To request commit access, please reach out to a TSC member.
