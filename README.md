# CMPT272 SFU Fall 2024 Project - Group 9

# Metro Vancouver 9-1-1 Emergency Call Web Application

This repository contains the web application project developed for the Metro Vancouver 9-1-1 Emergency Call Answer Service, in partnership with E-Comm, to streamline emergency reporting and response. This project aims to replace the legacy system with a user-friendly web-based solution for emergency call management.

## Project Overview

The Metro Vancouver 9-1-1 Emergency Call Answer Service handles over one million emergency calls annually through E-Comm. This system enables both civilians and first responders to report, monitor, and manage emergency calls online, improving response efficiency and transparency.

## Scenario

The Metro Vancouver 9-1-1 Emergency Call Answer Service “is responsible for 9-1-1 call answer services within the Metro Vancouver region and provides this service through business partner and service provider: E-Comm. E-Comm receives and processes about one million emergency calls each year. They collect the required information from the caller and transfer the call to the appropriate municipal or provincial dispatch agency who is responsible to direct first responders to assist with the caller’s emergency.”

E-Comm has decided to switch from its legacy system to a web-based system that not only its operators and first responders, but also the public can use to easily report and monitor emergency calls online.

Your team has won a contract from E-Comm to build this web-based system. The system works as follows: anyone, including a civilian, can submit an emergency report containing the following:

- **Reporting Person’s Info**: Name and phone number of the witness.
- **Emergency Info**: Nature of the emergency (fire, shooting, vehicle accident, medical, etc.)
- **Location**: A specific address or place name, optionally including longitude and latitude, pinpointing the incident's site.
- **Picture Link**: An optional URL to an image of the emergency.
- **Comments**: Additional details, such as "suspect is wearing cargo shorts with green t-shirt"

Upon submission, the system logs the report with the above details and auto-fills two additional fields:

- **Time/Date**: The date and time when the report was lodged.
- **Status**: Initially set to OPEN.

E-Comm operators review new reports and respond accordingly. After an emergency has been addressed, E-Comm operators update the report status to "RESOLVED," which requires a valid passcode (see below).

## User Requirements

1. A map shall display all reported emergencies with markers. The list of all emergencies shall also be shown and is sortable. As the map is zoomed in or out, the list changes to show only the emergencies currently in the map. A possible design is shown in Figure 1, but you are free to be more creative.
2. Interacting with a marker shall display the details, as shown in Figure 2. Again, you are free to be more creative.
3. Clicking on a list item shall also display the details and highlight the corresponding marker on the map.
4. Options to modify or delete reports shall be available with a valid passcode that the system shall prompt the user to enter for those operations. You can initially set the password to what you want.
5. The system shall give feedback on incorrect inputs or error situations.

## Non-Functional Requirements

1. The app must be coded in HTML, CSS, and JavaScript. TypeScript is allowed.
2. The MD5 hash shall be used for passcode storage and verification.
3. You shall use the DOM Storage API to save your data.
4. You shall use the Leaflet maps API with OpenStreetMaps to display the reports. Do NOT use MapBox or Google Maps, as they are not free to use.
5. You can use libraries such as Bootstrap or frameworks such as React to help with the design process.

## Other Info

- Project is to be done in groups of 5 students each. Empty groups are already available on Canvas: just join one of them with your groupmates, or join any of the groups if you don’t have groupmates.
- The exact designs and workflows are up to you, but please be mindful of usability and creativity: the app should be aesthetically pleasing and intuitive/easy to use.
- Submit everything in one zip file, including a list of group members and their % share of contribution to the project. Each group member is expected to contribute equally (20%), impacting each individual's final project mark.

### Resources

- [Metro Vancouver 9-1-1 Service](https://metrovancouver.org/services/emergency-management/9-1-1-service)
- [Hashify (MD5)](https://hashify.net/)
- [Leaflet Documentation](https://leafletjs.com/reference.html)
