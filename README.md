# Collexga

Collexga is a backend system that connects students seeking post‑HSC admission guidance with verified college seniors. It focuses on trust, real‑time communication, and secure payments so students can get reliable counselling from authenticated seniors.

## About the Project

After 12th (HSC), students often face misleading information and unverified counsellors. Collexga addresses this by enforcing identity checks, role‑based access, and a strict approval flow for counsellors. The backend powers authentication, verification, chat, video signaling, and payment workflows that make student–counsellor interactions safe and seamless.

## Highlights

- Role‑based authentication for students, counsellors, and admins
- OTP email verification to prevent fake signups
- Admin approval workflow for counsellor verification
- Real‑time chat with Socket.io
- Video call signaling support over sockets
- Razorpay payment flow for paid counselling
- PostgreSQL schema design with Prisma ORM
- Secure APIs with robust error handling and access control

## Responsibilities

- Designed and implemented the entire backend architecture and logic
- Built JWT auth with role handling and protected routes
- Added OTP verification and basic fraud prevention
- Implemented counsellor verification and admin approval flow
- Delivered real‑time chat and video signaling via Socket.io
- Integrated Razorpay for payments and session validation
- Modeled PostgreSQL relations in Prisma and maintained migrations
- Enforced security, validation, and error‑handling standards

## Tech Stack

- Node.js
- Next.js API routes
- PostgreSQL
- Prisma ORM
- Socket.io
- JWT Authentication
- Nodemailer (OTP emails)
- Razorpay Payment Gateway

## Project Structure

- backend/: Node backend, Prisma schema, controllers, and routes
- frontend/: Next.js frontend application

## Prerequisites

- Node.js (LTS)
- PostgreSQL database
- A Razorpay account (for payment flows)

## Environment Variables

Create environment files for both backend and frontend.

### Backend

Create [backend/.env](backend/.env) with values matching your setup:

- DATABASE_URL: PostgreSQL connection string
- JWT_SECRET: secret key for token signing
- JWT_EXPIRES_IN: token lifetime (example: 7d)
- RAZORPAY_KEY_ID: Razorpay key id
- RAZORPAY_KEY_SECRET: Razorpay key secret
- CLIENT_URL: frontend base URL for CORS

### Frontend

Create [frontend/.env.local](frontend/.env.local):

- NEXT_PUBLIC_API_URL: backend base URL
- NEXT_PUBLIC_SOCKET_URL: socket server URL (often same as API URL)
- NEXT_PUBLIC_RAZORPAY_KEY_ID: Razorpay public key

## Getting Started

1. Install dependencies in both backend and frontend directories.
2. Set the environment variables listed above.
3. Apply Prisma migrations and generate the client.
4. Start the backend service.
5. Start the frontend application.
