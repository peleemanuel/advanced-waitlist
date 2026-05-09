# Advanced Waitlist Feature Flag Demo

## Overview

This project is a practical demonstration of a feature flag system using **OpenFeature** and **flagd**.

The application simulates a restaurant booking system where users can reserve tables for fixed one-hour time slots. A new feature called **Advanced Waitlist** is implemented in the codebase, but it is not visible to all users by default.

Access to this feature is controlled through feature flags, allowing the application to demonstrate:

- trunk-based development
- dark launch
- gradual feature rollout
- user targeting based on evaluation context
- runtime rule changes without modifying application code

The project does not use an external feature flag SaaS platform. Instead, it uses **OpenFeature** with a local **flagd** provider.

---

## Main Idea

The core feature of the application is table reservation.

A user can:

- select a restaurant
- select a table
- select a date
- view available and occupied time slots
- reserve an available slot
- cancel an active reservation

## The experimental feature is:

### Advanced Waitlist

If a slot is already occupied, eligible users can join a waitlist for that exact:

- restaurant
- table
- date
- hour

### Auto-promote

When the existing reservation is cancelled, the system can automatically promote the first eligible waitlist entry and create a new reservation for that user.

This feature is controlled by feature flags.

---

## Technologies Used

### Frontend

- React
- TypeScript
- Vite

### Backend

- NestJS
- TypeScript

### Feature Flags

- OpenFeature
- flagd

### Local Runtime

- Docker
- Docker Compose

---

## Project Structure

```text
advanced-waitlist-project/
├── apps/
│   ├── frontend/
│   └── backend/
├── compose.yml
└── README.md
```
