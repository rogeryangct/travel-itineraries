# Travel website maintenance

User preferences confirmed 2026-09-10:
- Brand: R & A (Roger and Amber), compact sticky header. Do not restore the former Chinese site title or homepage hero/counts.
- Display country names in English; retain Chinese aliases for search.
- Keep a global Today link. Match itinerary-local dates, including optional day.timeZone/trip.timeZone overrides.
- When the user asks to prepare/add country itineraries, complete research, content, build, upload and deployment verification to this existing GitHub Pages website. Do not hand manual uploads back to the user when authorized GitHub access works. This preference does not authorize unprompted background research or publication of private booking details.
- Preserve existing trips, sources, stable IDs, .nojekyll and device-local storage keys.
- Edit source files, run python3 build.py, then publish index.html and modified sources together.
- Repository: rogeryangct/travel-itineraries; public URL: https://rogeryangct.github.io/travel-itineraries/
- Place global Search immediately after travel tools; omit the large homepage search form. Keep the Explore Countries heading 18px and country codes small (14px).
