import { AttendanceSession } from "@/types/attendance-session.type";
import { add, isAfter, isBefore, parse, set } from "date-fns";

export const getAttendanceSessionStatus = (
  session: AttendanceSession,
  current: Date
) => {
  const sessionDatetimeStart = set(
    parse(session.session_date, "yyyy-MM-dd", new Date()),
    {
      hours: session.start_hour,
      minutes: session.start_min,
      seconds: 0,
      milliseconds: 0,
    }
  );

  const sessionDatetimeEnd = set(
    parse(session.session_date, "yyyy-MM-dd", new Date()),
    {
      hours: session.end_hour,
      minutes: session.end_min,
      seconds: 0,
      milliseconds: 0,
    }
  );

  if (isBefore(current, sessionDatetimeStart))
    return { status: "Upcoming", color: "rgb(250 204 21)" };

  if (
    !isBefore(current, sessionDatetimeStart) &&
    !isAfter(current, sessionDatetimeEnd)
  )
    return { status: "Ongoing", color: "rgb(34 211 238)" };

  if (
    isAfter(current, sessionDatetimeEnd) &&
    !isAfter(
      current,
      add(sessionDatetimeEnd, {
        minutes: session.overtime_minutes_for_late ?? 0,
      })
    )
  )
    return { status: "Overtime", color: "rgb(129 140 248)" };

  if (
    isAfter(
      current,
      add(sessionDatetimeEnd, {
        minutes: session.overtime_minutes_for_late ?? 0,
      })
    )
  )
    return { status: "Finished", color: "rgb(74 222 128)" };

  return { status: "Upcoming", color: "rgb(250 204 21)" };
};
