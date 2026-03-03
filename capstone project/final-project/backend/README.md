# Project Setup

This project uses a PostgreSQL database and manages database schema changes
using raw SQL migration files.

## To create a new migration file (work in progress 24-nov-2025)

Use the same pattern as existing migration files in the `migrations` folder
remembering to increment the number at the start of the filename accordingly
(it should show the timestamp when the file was created,
e.g., `20231010120000_add_new_table.js`).
