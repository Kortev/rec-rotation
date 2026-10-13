// Sends one push to the phone. The phone's app decides what the notification says
// (next workout, this week's count, protein), so this only needs to wake it up.
import webpush from "web-push";

const { VAPID_PUBLIC, VAPID_PRIVATE, PUSH_SUBSCRIPTION, FORCE } = process.env;

if (!PUSH_SUBSCRIPTION) {
  console.log("No phone is connected yet (PUSH_SUBSCRIPTION secret is empty). Nothing to send.");
  process.exit(0);
}

const parts = Object.fromEntries(
  new Intl.DateTimeFormat("en-US", { timeZone: "America/Chicago", hour: "numeric", minute: "numeric", hourCycle: "h23" })
    .formatToParts(new Date()).map(p => [p.type, p.value])
);
const minutes = Number(parts.hour) * 60 + Number(parts.minute);
if (FORCE !== "true" && (minutes < 14 * 60 + 30 || minutes > 15 * 60 + 29)) {
  console.log(`Auburn time is ${parts.hour}:${parts.minute}, outside 2:30–3:29 pm. This is the other time zone's run; skipping.`);
  process.exit(0);
}

webpush.setVapidDetails("https://kortev.github.io/rec-rotation/", VAPID_PUBLIC, VAPID_PRIVATE);

try {
  const res = await webpush.sendNotification(JSON.parse(PUSH_SUBSCRIPTION), JSON.stringify({ type: "reminder" }), { TTL: 3 * 3600, urgency: "normal" });
  console.log("Reminder sent:", res.statusCode);
} catch (e) {
  console.error("Push failed:", e.statusCode, e.body || e.message);
  if (e.statusCode === 404 || e.statusCode === 410) {
    console.error("The phone's connection expired. In Rotation, turn reminders off and on, then save the new code as PUSH_SUBSCRIPTION.");
  }
  process.exit(1);
}
