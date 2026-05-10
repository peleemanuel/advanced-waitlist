# Table of Contents

1. [Overview](#overview)
   a) [Advanced Waitlist](#advanced-waitlist)
2. [Technologies used](#technologies-used)
   a) [Frontend](#frontend)
   b) [Backend](#backend)
   c) [Feature flag](#feature-flag)
   d) [Local runtime](#local-runtime)
3. [Simplifications and future implementations](#simplifications-and-future-implementations)

# Overview

This project is a practical demonstration of a feature flag system using **OpenFeature** and **flagd**.

The application simulates a restaurant booking system where users can reserve tables for fixed one-hour time slots. A new feature called **Advanced Waitlist** is implemented in the codebase, but it is not visible to all users by default.

Access to this feature is controlled through feature flags, allowing the application to demonstrate:

- trunk-based development
- dark launch
- gradual feature rollout
- user targeting based on evaluation context
- runtime rule changes without modifying application code

The project does not use an external feature flag SaaS platform. Instead, it uses **OpenFeature** with a local **flagd** provider.

The core feature of the application is table reservation.

A user can:

- select a restaurant
- select a table
- select a date
- view available and occupied time slots
- reserve an available slot
- cancel an active reservation

## Advanced Waitlist

If a slot is already occupied, eligible users can join a waitlist for that exact:

- restaurant
- table
- date
- hour

### Auto-promote

When the existing reservation is cancelled, the system can automatically promote the first eligible waitlist entry and create a new reservation for that user.

# Technologies used

## Frontend

- React
- TypeScript
- Vite

## Backend

- NestJS
- TypeScript

## Feature flag

- OpenFeature
- flagd

## Local runtime

- Docker
- Docker Compose

Use the following command to run the application:

```bash
docker compose up --build
```

After that, in the browser open `http://localhost:5173`.

## Project structure

```text
advanced-waitlist-project/
├── apps/
│   ├── frontend/
│   └── backend/
├── compose.yml
└── README.md
```

# Simplifications and future implementations

To avoid relying on external SaaS solutions and to keep the demo fully reproducible in a local environment, several simplifications were introduced in the project in order to maintain the focus on the feature flag system.

- Dropdown instead of real user login
- In-memory data
- No persistent data
- Local flagd instead of cloud service
