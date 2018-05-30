# TIME TRACKING

| date | hours | layer | category | what exactly? |
|:-----|:------|:------|:---------|:--------------|
| 20.3. | 2 | n/a | general | concept analysis and design |
| 21.3. | 2 | n/a | general | concept analysis and design |
| 27.3. | 1 | backend | general | basic setup and config |
| 28.3. | 4 | backend | functionality | employee model and API; email and phone format validation |
| 28.3. | 1 | backend | tests | tests for validators |
| 29.3. | 1 | backend | general | Github > Travis > Heroku pipeline |
| 29.3. | 4 | backend | functionality | login API; jwt authentication; password requirements validation |
| 29.3. | 3 | backend | tests | tests for employee and login APIs; tests for password validation |
| 3.4. | 1 | backend | functionality | extending employee API |
| 3.4. | 1 | backend | tests | tests for employee API |
| 3.4. | 1 | backend | refactoring | tweaks to custom validators |
| 4.4. | 2 | backend | functionality | client model and API |
| 4.4. | 2 | backend | tests | tests for client API |
| 4.4. | 3 | backend | refactoring | authentication with middleware instead of routers; generalizing repetitive test code |
| 5.4. | 4 | backend | functionality | extending client and employee models and APIs |
| 6.4. | 4 | backend | tests | tests for client and employee APIs |
| 8.4. | 2 | backend | functionality | project model and API |
| 8.4. | 2 | backend | tests | extending API tests coverage |
| 8.4. | 4 | backend | refactoring | letting mongoose handle validation (since it can) instead of makeshift DIY bullshit |
| 9.4. | 2 | backend | tests | tests for project API |
| 11.4. | 1 | frontend | general | basic setup |
| 11.4. | 4 | frontend | functionality | login, notifications, routing, listing employees |
| 13.4. | 2 | frontend | functionality | viewing, editing, creating individual employees |
| 13.4. | 8 | frontend | refactoring | complete restructuring of redux pattern (how reducers, action creators etc. work together) |
| 14.4. | 2 | frontend | functionality | listing, editing, creating clients |
| 14.4. | 2 | frontend | refactoring | retrofitting “older” parts to renewed redux pattern |
| 15.4. | 2 | frontend | functionality | list filtering; listing, editing, creating projects |
| 15.4. | 1 | backend | refactoring | bouncing 401s with middleware instead of routers |
| 16.4. | 2 | frontend | refactoring | adjusting UI for narrow viewport |
| 19.4. | 8 | frontend | refactoring | yet another overhaul of redux pattern; notifications shown as modal popup |
| 23.4. | 2 | backend | functionality | extending employee and project models and APIs (to allow assigning employees to projects) |
| 24.4. | 3 | backend | refactoring | centralized error handling with middleware |
| 26.4. | 2 | backend | tests | extending project API tests (assigning employees to projects) |
| 26.4. | 2 | backend | refactoring | restructuring tests a bit |
| 27.4. | 1 | backend | functionality | material model and API |
| 27.4. | 1 | backend | tests | tests for material API |
| 2.5. | 2 | backend | functionality | task model and API, extending project API (fetching project-specific tasks) |
| 3.5. | 4 | backend | tests | tests for task API and new project API endpoint |
| 4.5. | 6 | frontend | functionality | assigning employees to projects; materials management; embedded Google maps; etc. |
| 5.5. | 6 | frontend | functionality | listing, adding, updating tasks (tied to projects so a bit more involved than earlier) |
| 6.5. | 4 | frontend | functionality | managing material quotas on a task |
| 13.5. | 4 | backend | functionality | activity model and API; extending employee API (changing password) |
| 13.5. | 6 | frontend | functionality | page for changing user’s own info and password; listing, adding, updating and signing off activities tied to tasks (most involved part thus far) |
| 14.5. | 10 | frontend | refactoring | generalizing highly repetitive code on Redux side; decentralizing data fetch requests downward in container hierarchy; trying out more clear-cut division of responsibility between containers; tweaks to how numbers are handled |
| 15.5. | 2 | backend | refactoring | small changes to tests, material model (remove “color” attribute) and client API (GET returns empty object for non-admin users instead of 403) |
| 15.5. | 6 | frontend | refactoring | tweaking how quota forms are controlled; converting remaining “old” components to new container structure |
| 17.5. | 5 | backend | functionality | blob model and API (uploading and serving files) … took a lot of trial-and-error to figure this out |
| 17.5. | 7 | frontend | functionality | attachment views and controls for activities, clients, materials, projects and tasks |
| 18.5. | 4 | backend | refactoring | switching to cloudinary for file storage instead of mongodb (...what a waste of time yesterday!!); adjustments to client and project models (removing attributes from one and adding to the other) |
| 20.5. | 1 | backend | refactoring | simplify mongoose populate operations with generalized selector |
| 21.5. | 2 | frontend | refactoring | adding proptypes to components (finally…) |
| 22.5. | 8 | frontend | refactoring | proptyping continued; pruning a lot of unnecessary, repetitive code by generalizing all lists and integrating redundant components into others; etc. |
| 23.5. | 1 | backend | tests | tests for changing password (employee API) |
| 23.5. | 1 | frontend | refactoring | adjust which data points are displayed on list rows depending on context |
| 29.5. | 4 | backend | functionality | extend login API (requesting and handling password resets with verification tokens); send password reset requests and new employee invites by email with nodemailer |
| 29.5. | 1 | backend | refactoring | fixed bug where all non-index frontend routes result in 401 with a "catch-all" handler |
| 29.5. | 1 | frontend | functionality | views and forms for the "forgot password?" process |
| 30.5. | 2 | backend | functionality | comment model and API (adding comments to other entities) |
| 30.5. | 2 | frontend | functionality | comment views and controls – lazy and clumsy solution, need to improve at some point |
| TOTAL | 178 |

