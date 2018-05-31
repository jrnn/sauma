SAUMA
=====

Description
-----------

- Sauma is a small-scale webapp made for one Finnish medium-size business
  specializing in the sealing of precast concrete element joints in building
  construction.
- Sauma offers some very basic project management and resource planning features
  such as:
  1. Keeping tabs on clients, work sites, materials, and employees
  2. Planning and scheduling tasks for sites
  3. Reporting used hours and materials against open tasks
  4. Following up on whether schedules are kept, what materials are used and in
     what quantity, who has been doing what and when, etc.
  5. ...
- Key technologies:
  - React for frontend ([see code here](https://github.com/jrnn/sauma-front))
  - Node for backend
  - MongoDB for persistence
- UI is in Finnish due to the fact that all users are native Finns.
- Hours clocked up to May 31 count towards an exercise project for a Helsinki
  University course on full stack web application development.

Where we at (as of 2018 May 31)
-------------------------------

- Functionality
  - Sauma can, roughly, handle points 1 to 3 on the minified feature list above.
  - However the UI, navigation in particular, is clumsy and at times confusing.
  - Also, due to the complete lack of aggregating views (i.e. point 4), the app
    does not yet provide any insight. You can't do much more than tedious data
    input...
- Some numbers
  - Codebase altogether ~9 300 sloc, of which 40% backend and 60% frontend
  - Backend has quite robust testing:
    - Total 114 tests, with nearly 90% test coverage (for what it's worth)
    - Tests comprise almost 60% of backend code
  - Frontend has no automated testing whatsoever:
    - I have no excuses, it is what it is
    - (Also no idea why frontend code is so bloated compared to backend?)
  - Roughly 60% of hours burnt on writing new code and tests, and 40% wasted on
    fixing and refactoring... Hours split very evenly between back and front

Way forward
-----------

- Sauma is only recently starting to see test use by its intended audience.
  Expectation is that a lot of adjustments and changes need to be made based on
  feedback. Of course it's also possible that Sauma will see no traction, in
  which case it just goes to the bin.
- If Sauma is actually picked up, some known to-dos are:
  - Fixes and improvements to UI/UX
  - Showing all work sites at once on a map
  - Ability to delete/undo things (conditionally)
  - All that "aggregate query" stuff, e.g. how much of a certain material has
    been used in excess of budget across all work sites
  - Extending back-end test coverage
  - Consider switching from a live test DB e.g. to mongomock
  - Consider socket.io
  - Consider porting to mobile with React Native
  - Frontend testing
  - ...

Helsinki University reviewer, I salute you
------------------------------------------

- You'll find
  - time tracking [here](https://github.com/jrnn/sauma/blob/master/hours.md)
  - instructions of use here (TBA)
  - and a demo version of the app [here](https://sauma-demo.heroku.com/)
- You should have received an email with username and password reset link
