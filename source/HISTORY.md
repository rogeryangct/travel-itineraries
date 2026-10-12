# Travel history

`history.json` stores dated historical segments (inclusive dates). The June 13, 2026 PDF supersedes the earlier PDF; import once. Do not infer countries from a broad region or cities from an accommodation name. Pure transit is excluded.

`historyRecords()` merges this archive with `catalog.trips` at runtime. Every new itinerary automatically appears, using its dates and first/primary country. Add optional `trip.history = {countries: [country IDs or English names], cities: [confirmed names], cityVisits: [{name, date}], start, end, title, note}` for richer statistics. Use cityVisits for future trips so destinations are not counted before their visit date. Explicit historical entries use `tripIds` to link and suppress duplicate itinerary imports. Set `syncDates: true` when a linked canonical itinerary controls dates. Historic actual stays may deliberately differ from cross-border guide coverage: do not overwrite them with incidental itinerary countries.

Statistics use unique ISO calendar dates and split at year boundaries; segment cards show full inclusive ranges. Elapsed statistics are schedule-based, not an assertion that every reservation was fulfilled. Country/region and city totals deduplicate exact normalized canonical names. No inferred distance or carbon estimate. Romania historical city visits use planned dated arrival points. Existing localStorage and country routes must remain intact.

Build with `python build.py`; publish modified sources and generated index.html together.

The user-supplied flag roster (`visitedCountries`, snapshot 2026-09-25) is authoritative for the All countries total, includes Taiwan, Hong Kong and Macau, and preserves image order. This independent roster does not create trip records or days. Undated flag additions do not affect yearly country totals. Future dated countries are unioned with the roster when their trip starts. The flag list is available at #visited-countries. Monaco is the second red/white flag in the supplied list.


## Bulgaria 2026-10-03–2026-10-13

Added through catalog trip.history with dated cityVisits and accommodation/transport details. The 11 inclusive trip dates add 10 unique planned dates beyond Romania (October 3 is shared). October 10 alternative bookings count as one night and one trip. The 57-country flag roster is unchanged before October 3; Bulgaria is appended by the existing dated-history union when the trip begins. Optional Melnik and alternative route dates are not assumed visited. Statistics follow itinerary dates, not live location tracking.


## Egypt added 2026-10-12

The Egypt catalog entry covers 2026-10-13 through 2026-11-01: 20 inclusive calendar days and 19 booked nights. October 13 overlaps Bulgaria and counts only once in global totals. Eight dated city visits are projected from the itinerary; future visits do not count as elapsed travel. The superseded Nile cruise and Red Sea extension are excluded. The 57-country flag baseline is unchanged.
