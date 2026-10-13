# Rotation

A four-workout, 40-minute lifting loop for a busy college rec, as an installable phone web app.

- **Today:** the next workout in the loop, a set logger, a rest timer with a beep, and a 40-minute session clock.
- **Protein:** a daily counter with quick-add foods (USDA FoodData Central values) and barcode scanning (Open Food Facts, then USDA FoodData Central).
- **Water:** a daily water log with a goal.
- **Progress:** a weekly streak, badges, strength trends, cardio, monthly measurements, editable history, and backup export/import.
- **Reminders:** push notifications on workout days (Mon, Tue, Thu, Fri around 2:40 pm Central), sent by a scheduled GitHub Actions job in `.github/workflows/reminders.yml`. The phone decides the wording from its own data.
- **Plan / Why:** the program and the research behind it, with sources.

Everything is stored on the phone (localStorage). Nothing is sent anywhere except barcode numbers you look up (to Open Food Facts and USDA).

Install on iPhone: open the site in Safari → Share → Add to Home Screen.
