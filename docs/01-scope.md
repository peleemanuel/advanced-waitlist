## Application Scope

- This is a web platform in which users can make a reservation at a table at a certain hour for a specific number of guests.
- This platform introduces a new feature which other platforms lack: in case a table is occupied, a customer can join a waiting list and will be assigned automatically in case the table gets free.
- This feature will be introduced as a feature flag, meaning that some users will be able to join this waiting list while other won't be able to.

## Types of users

1. **Normal user**
   This user can:
   - authenticate
   - see restaurants
   - make reservations
   - see if there are any free seats

2. **Beta user**
   This user can do all things a **normal** user can, and additionally:
   - they will see a button for entering a waiting list if case the needed seats are occupied

## Feature flags

`advanced-waitlist-ui` - controls whether the users sees the button to enter the waitlist.

`advanced-waitlist-auto-promote` - controls whether the system will pick the first user from the waitlist to receive the seats in case the reservation for it has been cancelled.

This way the project shows a feature flag for each frontend and backend.
