/** RFC 5545 calendar export with explicit timezone transitions for seven years.
 * The calendar app owns notifications; this module never schedules a delivery.
 */
const minute = 60_000;
function formatter(timeZone: string) {
  if (!/^[A-Za-z_]+(?:\/[A-Za-z0-9_+.-]+)*$/.test(timeZone)) throw new Error("Choose a valid timezone.");
  return new Intl.DateTimeFormat("en-GB", {timeZone, year:"numeric", month:"2-digit", day:"2-digit", hour:"2-digit", minute:"2-digit", second:"2-digit", hourCycle:"h23"});
}
function parts(date: Date, fmt: Intl.DateTimeFormat) {
  return Object.fromEntries(fmt.formatToParts(date).map(p => [p.type, p.value]));
}
function localStamp(date: Date, fmt: Intl.DateTimeFormat) {
  const p=parts(date,fmt); return `${p.year}${p.month}${p.day}T${p.hour}${p.minute}${p.second}`;
}
function utcStamp(date: Date) { return date.toISOString().replace(/[-:]/g,"").replace(/\.\d{3}/,""); }
function offset(date: Date, fmt: Intl.DateTimeFormat) {
  const p=parts(date,fmt);
  return Math.round((Date.UTC(+p.year,+p.month-1,+p.day,+p.hour,+p.minute,+p.second)-date.getTime())/minute);
}
function zoneOffset(value: number) { const n=Math.abs(value); return `${value<0?"-":"+"}${String(Math.floor(n/60)).padStart(2,"0")}${String(n%60).padStart(2,"0")}`; }
function timezoneBlock(zone: string, year: number, fmt: Intl.DateTimeFormat) {
  const lines=["BEGIN:VTIMEZONE",`TZID:${zone}`];
  const begin=Date.UTC(year-1,0,1),end=Date.UTC(year+6,0,1);
  let previous=offset(new Date(begin),fmt),transitionCount=0;
  for(let t=begin+86400000;t<end;t+=86400000) {
    const next=offset(new Date(t),fmt);
    if(next===previous)continue;
    let low=t-86400000,high=t;
    while(high-low>minute){const mid=Math.floor((low+high)/2/minute)*minute;if(offset(new Date(mid),fmt)===previous)low=mid;else high=mid;}
    const kind=next>previous?"DAYLIGHT":"STANDARD";
    const wall=utcStamp(new Date(high+previous*minute)).replace(/Z$/,'');
    lines.push(`BEGIN:${kind}`,`DTSTART:${wall}`,`TZOFFSETFROM:${zoneOffset(previous)}`,`TZOFFSETTO:${zoneOffset(next)}`,`END:${kind}`);
    previous=next;transitionCount++;
  }
  if(!transitionCount)lines.push("BEGIN:STANDARD","DTSTART:19700101T000000",`TZOFFSETFROM:${zoneOffset(previous)}`,`TZOFFSETTO:${zoneOffset(previous)}`,"END:STANDARD");
  return [...lines,"END:VTIMEZONE"];
}
function stableUid(value: string) {
  let hash=14695981039346656037n;for(const byte of new TextEncoder().encode(value)){hash^=BigInt(byte);hash=BigInt.asUintN(64,hash*1099511628211n);}return `checkin-${hash.toString(16)}@reclaim`;
}
function escapeText(value: string) { return value.replace(/\\/g,"\\\\").replace(/\r?\n/g,"\\n").replace(/,/g,"\\,").replace(/;/g,"\\;"); }
export function calendarFile(title: string,start: string,frequency: string,timeZone="UTC") {
  const date=new Date(start);if(!Number.isFinite(date.getTime()))throw new Error("Choose a valid date.");
  if(!["ONCE","DAILY","WEEKLY","MONTHLY"].includes(frequency))throw new Error("Choose a supported repeat schedule.");
  const fmt=formatter(timeZone),summary=escapeText(title.slice(0,100));
  const uid=stableUid([title,date.toISOString(),frequency,timeZone].join('|'));
  const lines=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//RECLAIM//Security check-ins//EN","CALSCALE:GREGORIAN",...timezoneBlock(timeZone,date.getUTCFullYear(),fmt),"BEGIN:VEVENT",`UID:${uid}`,`DTSTAMP:${utcStamp(new Date())}`,`DTSTART;TZID=${timeZone}:${localStamp(date,fmt)}`,"DURATION:PT15M"];
  if(frequency!=="ONCE")lines.push(`RRULE:FREQ=${frequency}`);
  lines.push(`SUMMARY:${summary}`,"DESCRIPTION:Private security check-in. Set notifications in your calendar. Timezone transitions are included for seven years.","END:VEVENT","END:VCALENDAR");
  // Fold long content lines while preserving Unicode code points.
  return lines.map(line=>{let result='',column=0;for(const char of line){const bytes=new TextEncoder().encode(char).length;if(column+bytes>74){result+='\r\n ';column=1;}result+=char;column+=bytes;}return result;}).join('\r\n')+'\r\n';
}
