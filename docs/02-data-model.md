1. **User**
   - `id`
   - `name`
   - `email`
   - `passwordHash`
   - `segment`
   - `createdAt`

    <br>

2. **Restaurant**
   - `id`
   - `name`
   - `location`
   - `description` - optional
   - `createdAt`

    <br>

3. **Table**
   - `id`
   - `name`
   - `capacity`
     <br>

4. **Reservation**
   - `id`
   - `userId`
   - `restaurantId`
   - `tableId`
   - `reservationDate`
   - `slotHour`
   - `status`
     <br>

5. **WaitlistEntry**
   - `id`
   - `userId`
   - `restaurantId`
   - `tableId`
   - `reservationDate`
   - `slotHour`
   - `status`
     <br>

---

- A `User` has many `Reservation`
- A `User` has many `WaitlistEntry`
- A `Restaurant` has many `Table`
- A `Restaurant` has many `Reservation`
- A `Restaurant` has many `WaitlistEntry`
- A `Table` belongs to a `Restaurant`
- A `Reservation` belongs to a `User`, to a `Restaurant` and to a `Table`
