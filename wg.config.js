// @ts-check

/** @type {import('wgutils').Config} */
const config = {
  name: "GraphQL WG",
  repoUrl: "https://github.com/graphql/graphql-wg",
  videoConferenceDetails: `https://zoom.us/j/593263740
  - _Password:_ graphqlwg`,
  liveNotesUrl:
    "https://docs.google.com/document/d/1q-sT4k8-c0tcDYJ8CxPZkJ8UY4Nhk3HbKsRxosu_7YE/edit?usp=sharing",
  timezone: "US/Pacific",
  frequency: "monthly",
  nth: 1,
  weekday: "Th", // M, Tu, W, Th, F, Sa, Su
  time: "10:30-12:00", // 24-hour clock, range
  attendeesTemplate: `\
| Name             | GitHub        | Organization       | Location              |
| :--------------- | :------------ | :----------------- | :-------------------- |
| Lee Byron (Host) | @leebyron     | GraphQL Foundation | San Francisco, CA, US |
`,
  agendasFolder: "agendas",
  dateAndTimeLocations:
    "p1=224&p2=179&p3=136&p4=268&p5=367&p6=438&p7=248&p8=240",
  joiningAMeetingFile: "JoiningAMeeting.md",
  filenameFragment: "wg-primary",
  description: `\
The GraphQL Working Group meets regularly to discuss changes to the
[GraphQL Specification][] and other core GraphQL projects. This is an open
meeting in which anyone in the GraphQL community may attend.

This is the primary monthly meeting, which typically meets on the first Thursday
of the month. In the case we have additional agenda items or follow ups, we also
hold additional secondary meetings later in the month.`,
  links: {
    "graphql specification": "https://github.com/graphql/graphql-spec",
    calendar:
      "https://calendar.google.com/calendar/embed?src=linuxfoundation.org_ik79t9uuj2p32i3r203dgv5mo8%40group.calendar.google.com",
    "google calendar":
      "https://calendar.google.com/calendar?cid=bGludXhmb3VuZGF0aW9uLm9yZ19pazc5dDl1dWoycDMyaTNyMjAzZGd2NW1vOEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t",
    "ical file":
      "https://calendar.google.com/calendar/ical/linuxfoundation.org_ik79t9uuj2p32i3r203dgv5mo8%40group.calendar.google.com/public/basic.ics",
  },

  annualItems: [
    // TSC Elections
    {
      month: 12,
      allMeetings: true,
      text: `**TSC elections**: open for self-nominations (5m, Host)
- [Election process](https://github.com/graphql/graphql-wg/blob/main/GraphQL-TSC.md#election-process)
- [Nomination form](https://tsc-nomination.graphql.org/)`,
    },
    {
      month: 1,
      text: `**TSC elections**: voting now open (2m, Host)
- [Election process](https://github.com/graphql/graphql-wg/blob/main/GraphQL-TSC.md#election-process)`,
    },
    {
      month: 2,
      text: `**TSC**: election results (2m, Host)
- [Election process](https://github.com/graphql/graphql-wg/blob/main/GraphQL-TSC.md#election-process)
- [This year's TSC members](https://github.com/graphql/graphql-wg/blob/main/GraphQL-TSC.md#tsc-members)`,
    },

    // Spec "release train"
    {
      month: 6,
      text: `**Spec release**: release is coming, 2 months until freeze! (5m, Host)`,
    },
    {
      month: 7,
      text: `**Spec release**: will freeze release just before next month's meeting; last chance for editorial changes (5m, Host)`,
    },
    {
      month: 8,
      text: `**Spec release**: **TSC**, please review and approve the changelog (5m, Host)`,
    },
    {
      month: 9,
      text: `**Spec release**: spec release is live! (pending 45 day notice period) (5m, Host)`,
    },
  ],

  secondaryMeetings: [
    // We decided at the primary WG in November 2024 to cancel the secondaries
    // since they have not been leveraged for a while. We can bring them back
    // as and when they are necessary.
    /*
    {
      // Wednesday, not Thursday
      dayOffset: -1,
      nth: 2,
      time: "16:00-17:00",
      name: "Secondary, APAC",
      filenameFragment: "wg-secondary-apac",
      description: `\
The GraphQL Working Group meets regularly to discuss changes to the
[GraphQL Specification][] and other core GraphQL projects. This is an open
meeting in which anyone in the GraphQL community may attend.

This is a secondary meeting, timed to be acceptable for those in Asia Pacific
timezones, which typically meets on the second Wednesday of the month. The
primary meeting is preferred for new agenda, where this meeting is for overflow
agenda items, follow ups from the primary meeting, or agenda introduced by those
who could not make the primary meeting time.`,
    },
    */
    {
      nth: 3,
      time: "10:30-12:00",
      name: "Secondary, EU",
      filenameFragment: "wg-secondary-eu",
      description: `\
The GraphQL Working Group meets regularly to discuss changes to the
[GraphQL Specification][] and other core GraphQL projects. This is an open
meeting in which anyone in the GraphQL community may attend.

This is a secondary meeting, timed to be acceptable for those in European
timezones, which typically meets on the third Thursday of the month. The
primary meeting is preferred for new agenda, where this meeting is for overflow
agenda items, follow ups from the primary meeting, or agenda introduced by those
who could not make the primary meeting time.`,
    },
  ],
};

module.exports = config;
