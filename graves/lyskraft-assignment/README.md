# Lyskraft Assignment

## Tech Stack

### Frontend
- `Mantine` for UI components
- `react-router-dom` for routing
- `styled-components` for custom styling
- `redux` and `redux-toolkit` for state management and APIs

### Backend
- `nestjs`
- `prisma` ORM

### Database
- `PostgreSQL` provided by `supabase`

### All inside a `Nx` workspace to put frontend and backend at one place

To get the project up and running, follow these steps

### Step 1

`npm install`

### Step 2

run  `npm i -g prisma` to install prisma globally

`cd` into the backend repository at `apps/backend`

create a `.env` file here with the following content

```
DATABASE_URL=postgres://postgres.ixiozmzblvdkccgohsst:AovIJjxAPm3BYkdW@aws-0-ap-south-1.pooler.supabase.com:5432/postgres
```

run `npx prisma generate`

### Step 3

`cd` to the root of the project

`npm start`

### To view the database

`npx prisma studio`

## Some Previews *(Non Exhaustive)*

### Login Page

![image](https://github.com/mistervaibhav/lyskraft-assignment/assets/41189028/bc997caa-8332-4f60-8812-36049085b840)


### Register Page

![image](https://github.com/mistervaibhav/lyskraft-assignment/assets/41189028/088ba5dd-5d6d-4ffb-8644-e051c39732d1)

### Home Page

![image](https://github.com/mistervaibhav/lyskraft-assignment/assets/41189028/e7ce59c1-5ab4-4983-a41f-8bc8f334147d)

### Orders Page

![image](https://github.com/mistervaibhav/lyskraft-assignment/assets/41189028/fad2e1b5-1838-47c8-a4c5-4b69228863aa)

#### With Details Open

![image](https://github.com/mistervaibhav/lyskraft-assignment/assets/41189028/61d4af33-6890-4689-8154-412f84dd49f8)

### Products Page

### Billing Page















