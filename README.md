# Room Schedule Concordia University

Website to access the room schedule of Concordia University based in Montréal, QC, Canada, using the open data provided by the university.

# Feature

## MVP (Minimal Viable Product)

### Client

- [ ] Basic responsive HTML/CSS
- [ ] Interface
  - [ ] Navigation to select campus, building, floor, room
  - [ ] Show occupied times for selected room
    - [ ] Text
    - [ ] Graphic
- [ ] JS
  - [ ] Get all rooms from server
  - [ ] Send user selected room to server
  - [ ] Get selected room data from server
  - [ ] Display room data on webpage

### Server

- [ ] Retrieve data
  - [ ] Get course schedules from Concordia open data api
  - [ ] Parse api data to obtain information per room
- [ ] Data handling
  - [ ] Check for new data
  - [ ] Save/update to database if room schedule changed
- [ ] Send all rooms to client on start
- [ ] Room request
  - [ ] Parse client request to get room
  - [ ] Query database to retrieve room data
  - [ ] Send data to client
- [ ] Ensure app some security
- [ ] Ensure app performance and reliability
  - [ ] Avoid synchronous functions
  - [ ] Handle exceptions properly
  - [ ] Set NODE_ENV to "production"
  - [ ] Automatic restart

## Later features

- [ ] Filter room availability for given time period
- [ ] Filter room availability for given duration
- [ ] Number of people in the room (not accurate, need to rely on students filling form correctly)

# Road map

- [ ] Create mock Concordia open data api
- [ ] Boiler plate server.js with Express
- [ ] Get course schedules from mock Concordia open data api
- [ ] Parse api data to obtain information per room
- [ ] Send all rooms to client on start
- [ ] Check for new data
- [ ] Save/update to database
- [ ] Parse client request to get room
- [ ] Query database to retrieve room data
- [ ] Send data to client
- [ ] Basic responsive HTML/CSS
- [ ] Get all rooms from server
- [ ] Navigation to select campus, building, floor, room
- [ ] Send user selected room to server
- [ ] Get selected room data from server
- [ ] Show occupied times for selected room in text
- [ ] Improve website interface (favicon,font,color,style)
- [ ] Show occupied times for selected room graphically
- [ ] Save/update to database if room schedule changed
- [ ] Get course schedules from Concordia open data api
- [ ] Ensure app some security
- [ ] Ensure app performance and reliability
- [ ] Filter room availability for given time period
- [ ] Filter room availability for given duration
- [ ] Number of people in the room (not accurate, need to rely on students filling form correctly)