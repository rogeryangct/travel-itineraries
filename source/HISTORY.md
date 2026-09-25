# Travel history

`history.json` stores dated historical segments (inclusive dates). The June 13, 2026 PDF supersedes the earlier PDF; import once. Do not infer countries from a broad region or cities from an accommodation name. Pure transit is excluded.

`historyRecords()` merges this archive with `catalog.trips` at runtime. Every new itinerary automatically appears, using its dates and first/primary country. Add optional `trip.history = {countries: [country IDs or English names], cities: [confirmed names], cityVisits: [{name, date}], start, end, title, note}` for richer statistics. Use cityVisits for future trips so destinations are not counted before their visit date. Explicit historical entries use `tripIds` to link and suppress duplicate itinerary imports. Set `syncDates: true` when a linked canonical itinerary controls dates. Historic actual stays may deliberately differ from cross-border guide coverage: do not overwrite them with incidental itinerary countries.

Statistics use unique ISO calendar dates and split at year boundaries; segment cards show full inclusive ranges. Elapsed statistics are schedule-based, not an assertion that every reservation was fulfilled. Country/region and city totals deduplicate exact normalized canonical names. No inferred distance or carbon estimate. Romania historical city visits use planned dated arrival points. Existing localStorage and country routes must remain intact.

Build with `python build.py`; publish modified sources and generated index.html together.
