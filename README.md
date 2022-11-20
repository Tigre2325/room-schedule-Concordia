# Room Schedule Concordia University

Website to access the room schedule of Concordia University based in Montréal, QC, Canada, using the open data provided by the university.

## Features

### MVP (Minimal Viable Product)

#### Client

- [ ] Basic responsive HTML/CSS
- [ ] Interface
  - [ ] Navigation to select campus, building, floor, room
  - [ ] Show occupied times for selected room
- [ ] JS
  - [x] Get all rooms from server
  - [x] Fill dependent dropdowns using all rooms
  - [x] Send user selected room to server
  - [ ] Display room data on webpage

#### Server

- [x] Retrieve data
  - [x] Get course schedules from Concordia open data api
  - [x] Parse Concordia api data
- [ ] Data handling
  - [ ] Check for new data
  - [ ] Save/update to database if room schedule changed
- [x] Send all rooms to client on start
- [x] Room request
  - [x] Parse client request to get room
  - [x] Query database to retrieve room data
  - [x] Send data to client
- [ ] Ensure app some security
- [ ] Ensure app performance and reliability
  - [ ] Avoid synchronous functions
  - [ ] Handle exceptions properly
  - [ ] Set NODE_ENV to "production"
  - [ ] Automatic restart

### Later features

- [ ] Filter room availability for given time period
- [ ] Filter room availability for given duration
- [ ] Number of people in the room (not accurate, need to rely on students filling form correctly)

## Road map

- [x] Create mock Concordia open data api with Mockoon
- [x] Boiler plate server.js with Express
- [x] Get course schedules from mock Concordia open data api in server
- [x] Parse Concordia api data
- [x] Save/update to database
- [x] Send all rooms to client on start
- [x] Get all rooms from server
- [x] Fill dependent dropdowns using all rooms
- [x] Send user selected room to server
- [x] Parse client request to get room
- [x] Query database to retrieve room data
- [x] Send data to client
- [x] Show occupied times for selected room graphically: hardcoded
- [ ] Show occupied times for selected room graphically: using server response
- [ ] Basic responsive HTML/CSS
- [ ] Publish website for beta testing
- [ ] Improve website interface (favicon, font, color, style)
- [ ] Navigation to select campus, building, floor, room
- [ ] Check for new data
- [ ] Save/update to database if room schedule changed
- [ ] Get course schedules from Concordia open data api
- [ ] Ensure app some security
- [ ] Ensure app performance and reliability
- [ ] Filter room availability for given time period
- [ ] Filter room availability for given duration
- [ ] Number of people in the room (not accurate, need to rely on students filling form correctly)
