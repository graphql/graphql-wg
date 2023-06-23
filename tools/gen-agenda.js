#!/usr/bin/env node

/**
 * This tool generates new agenda files in a consistent format. When making
 * changes to future agenda templates, please make the changes to this tool
 * first, then generate files.
 *
 * To use this tool, provide year and month as command arguments
 *
 *  tools/gen-agenda.js 2023 6
 *
 */

const fs = require("fs");
const path = require("path");
const { inspect } = require("util");

// Get arguments
const [year, month] = process.argv
  .slice(2)
  .map((n) => parseInt(n, 10))
  .sort((a, b) => b - a);
if (!year || !month) {
  console.error(`Must provide command arguments of year and month
  tools/gen-agenda.js 2023 6
`);
  process.exit(1);
}

// For all three meetings in a month, fill and write the template
for (num = 0; num < 3; num++) {
  const meeting = getMeeting(year, month, num);
  const contents = fillMeetingTemplate(meeting);

  // Create missing directories recursively
  fs.mkdirSync(path.dirname(meeting.filePath), { recursive: true });

  // Write file
  fs.writeFileSync(meeting.filePath, contents);

  console.log(`Wrote file: ${meeting.repoPath}`);
}

// --------------------------------------------------------------------------

function fillMeetingTemplate(meeting) {
  // Get JoiningAMeeting contents
  const howToJoin = fs
    .readFileSync(path.resolve(__dirname, "../JoiningAMeeting.md"), "utf8")
    .split("\n## How to join\n\n")[1];

  const prior1Meeting = getPriorMeeting(meeting);
  const prior2Meeting = getPriorMeeting(prior1Meeting);

  const meetingDescription = [
    `This is the primary monthly meeting, which typically meets on the first Thursday
of the month. In the case we have additional agenda items or follow ups, we also
hold additional secondary meetings later in the month.`,
    `This is a secondary meeting, timed to be acceptable for those in Asia Pacific
timezones, which typically meets on the second Wednesday of the month. The
primary meeting is preferred for new agenda, where this meeting is for overflow
agenda items, follow ups from the primary meeting, or agenda introduced by those
who could not make the primary meeting time.`,
    `This is a secondary meeting, timed to be acceptable for those in European
timezones, which typically meets on the third Thursday of the month. The
primary meeting is preferred for new agenda, where this meeting is for overflow
agenda items, follow ups from the primary meeting, or agenda introduced by those
who could not make the primary meeting time.`,
  ][meeting.num];

  return t`<!--

# How to join (copied directly from /JoiningAMeeting.md)

${howToJoin}

-->

| This is an open meeting: To attend, read [JoiningAMeeting.md][] then edit and PR this file. (Edit: ✎ above, or press "e") |
| ---------------------------------------------------------------------------------------- |

# GraphQL WG – ${meeting.monthName} ${meeting.year} (${meeting.name})

The GraphQL Working Group meets regularly to discuss changes to the
[GraphQL Specification][] and other core GraphQL projects. This is an open
meeting in which anyone in the GraphQL community may attend.

${meetingDescription}

- **Date & Time**: [${meeting.dateTimeDuration}](${meeting.timeLink})
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

| Name             | GitHub        | Organization       | Location              |
| :--------------- | :------------ | :----------------- | :-------------------- |
| Lee Byron (Host) | @leebyron     | GraphQL Foundation | San Francisco, CA, US |


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
   - [${prior2Meeting.monthName} WG ${prior2Meeting.name}](${prior2Meeting.url})
   - [${prior1Meeting.monthName} WG ${prior1Meeting.name}](${prior1Meeting.url})
1. Review previous meeting's action items (5m, Lee)
   - [Ready for review](https://github.com/graphql/graphql-wg/issues?q=is%3Aissue+is%3Aopen+label%3A%22Ready+for+review+%F0%9F%99%8C%22+sort%3Aupdated-desc)
   - [All open action items (by last update)](https://github.com/graphql/graphql-wg/issues?q=is%3Aissue+is%3Aopen+label%3A%22Action+item+%3Aclapper%3A%22+sort%3Aupdated-desc)
   - [All open action items (by meeting)](https://github.com/graphql/graphql-wg/projects?query=is%3Aopen+sort%3Aname-asc)
`;
}

function t(strings, ...placeholders) {
  let string = "";
  for (let i = 0, l = strings.length; i < l; i++) {
    string += strings[i];
    if (i < l - 1) {
      const v = placeholders[i];
      if (!v) {
        throw new Error(
          `Placeholder ${i} in template string is falsy (val = ${inspect(v, {
            colors: true,
          })})`
        );
      }
      string += String(v);
    }
  }
  return string;
}

function getMeeting(year, month, num) {
  if (num > 2) throw new Error(`Bad num: ${num}`);

  const name = ["Primary", "Secondary, APAC", "Secondary, EU"][num];
  const time = ["10:30", "16:00", "10:30"][num];
  const length = [90, 60, 90][num];

  // Find the day of the month this meeting falls on:
  //  - The first meeting is first Thursday.
  //  - Second is the following Wednesday after the first.
  //  - Third is two weeks following the first, also on a Thursday.
  const monthStartWeekday = new Date(year, month - 1, 1).getDay();
  const firstThursday = new Date(
    year,
    month - 1,
    monthStartWeekday <= 4 ? 5 - monthStartWeekday : 12 - monthStartWeekday
  ).getDate();
  const day = firstThursday + (num === 0 ? 0 : num === 1 ? 6 : 14);

  // Get the actual Date instance representing the start time of this meeting
  const dateTime = getDateTime(year, month, day, time);

  // Month names
  const monthName = dateTime.toLocaleString("en-US", { month: "long" });

  // Get the full date and time duration string
  const end = new Date(dateTime);
  end.setMinutes(dateTime.getMinutes() + length);
  const dateTimeDuration =
    dateTime.toLocaleDateString("en-US", {
      timeZone: "America/Los_Angeles",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour12: true,
      hour: "numeric",
      minute: "numeric",
    }) +
    " - " +
    end.toLocaleTimeString("en-US", {
      timeZone: "America/Los_Angeles",
      hour12: true,
      hour: "numeric",
      minute: "numeric",
      timeZoneName: "short",
    });

  const isoTime = dateTime.toISOString().replace(/[:-]/g, "").slice(0, 15);
  const timeLink = `https://www.timeanddate.com/worldclock/converter.html?iso=${isoTime}&p1=224&p2=179&p3=136&p4=268&p5=367&p6=438&p7=248&p8=240`;

  const monthShort = dateTime.toLocaleString("en-US", { month: "short" });
  const month2D = dateTime.toLocaleString("en-US", { month: "2-digit" });
  const day2D = dateTime.toLocaleString("en-US", { day: "2-digit" });
  const fileName = ["wg-primary", "wg-secondary-apac", "wg-secondary-eu"][num];
  const repoPath = `agendas/${year}/${month2D}-${monthShort}/${day2D}-${fileName}.md`;

  const filePath = path.resolve(__dirname, "../", repoPath);
  const url = `https://github.com/graphql/graphql-wg/blob/main/${repoPath}`;

  return {
    num,
    year,
    month,
    day,
    name,
    monthName,
    dateTimeDuration,
    timeLink,
    repoPath,
    filePath,
    url,
  };
}

function getPriorMeeting(meeting) {
  let { year, month, num } = meeting;
  num -= 1;
  if (num < 0) {
    num += 3;
    month -= 1;
    if (month < 1) {
      month += 12;
      year -= 1;
    }
  }
  return getMeeting(year, month, num);
}

// Times are in Pacific Time
function getDateTime(year, month, date, time) {
  const iso = new Date(year, month - 1, date).toISOString();
  // Timezones are hard. This iterates through a few offsets until we find the
  // one which has a time which matches the expected time.
  for (let offset = 7; offset <= 8; offset++) {
    const d = new Date(
      iso.slice(0, 11) + time + iso.slice(16, -1) + "-0" + offset + ":00"
    );
    if (
      time ===
      d.toLocaleTimeString("en-US", {
        timeZone: "America/Los_Angeles",
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      })
    ) {
      return d;
    }
  }
  throw new Error(`Timezones are hard: ${year} ${month} ${date} ${time}`);
}
