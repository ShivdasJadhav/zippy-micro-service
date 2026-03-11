# Zippy Microservice - Ride-Sharing Platform

## Project Overview

Zippy is a modern, scalable **ride-sharing microservice architecture** designed to connect riders with captains (drivers) efficiently. The system is built using a decoupled microservice approach, where each service handles a specific domain responsibility and communicates asynchronously via messaging.

### Architecture

This project follows a **microservice architecture pattern** with:

- **Independent services** for different domains (users, captains, rides)
- **API Gateway** for request routing and aggregation
- **RabbitMQ** as the message broker for asynchronous communication
- **Long-polling** for real-time ride notifications
- **MongoDB** for data persistence
- **Docker & Docker Compose** for containerization and orchestration

---

## Services

### Service Gateway

- **Port:** 3000
- **Description:** Central entry point for all client requests. Routes incoming API calls to appropriate microservices and handles request/response aggregation.
- **Key Features:**
  - API routing and load balancing
  - Request validation
  - Response aggregation
  - CORS handling

### Captain Service

- **Port:** 3001
- **Description:** Manages captain (driver) operations and availability. Handles captain registration, authentication, availability toggling, and ride acceptance notifications.
- **Key Features:**
  - Captain registration and login
  - JWT-based authentication
  - Availability management (online/offline status)
  - Long-polling for incoming ride requests
  - Token blacklisting for secure logout
  - RabbitMQ integration for real-time ride notifications

### Ride Service

- **Port:** 3002
- **Description:** Core ride management service. Handles ride creation, tracking, and status updates. Publishes ride events to other services.
- **Key Features:**
  - Ride creation and management
  - Real-time ride status updates
  - Message publishing for ride events
  - Ride assignment to captains

### User Service

- **Port:** 3003
- **Description:** Manages user (rider) operations and authentication. Handles user registration, booking requests, and receiving ride acceptance notifications.
- **Key Features:**
  - User registration and login
  - JWT-based authentication
  - Ride booking and request creation
  - Long-polling for ride acceptance notifications
  - Token blacklisting for secure logout
  - Real-time updates on captain acceptance

---

## Technology Stack

| Layer                | Technology              |
| -------------------- | ----------------------- |
| **Runtime**          | Node.js                 |
| **Framework**        | Express.js              |
| **Database**         | MongoDB                 |
| **Message Broker**   | RabbitMQ                |
| **Authentication**   | JWT (JSON Web Tokens)   |
| **Hashing**          | bcrypt                  |
| **Containerization** | Docker & Docker Compose |

## System Workflow

Below is a detailed diagram showing the interaction between all components:

![Architecture Diagram](architecture.drawio.png)

### Detailed Workflow Steps

1. **User Requests a Ride**
   - Rider submits a ride request through the User Service
   - User Service publishes `"new-ride"` event to RabbitMQ

2. **Captain Receives Ride Offer**
   - Captain maintains a long-polling connection to Captain Service via `waitForNewRide()`
   - RabbitMQ delivers the ride message to Captain Service
   - Captain Service broadcasts to all pending connections
   - Captain receives the ride offer in real-time

3. **Captain Accepts the Ride**
   - Captain accepts the ride request
   - Ride Service updates the ride status in MongoDB
   - Ride Service publishes `"ride-accepted"` event to RabbitMQ

4. **User Receives Acceptance**
   - User maintains a long-polling connection via `acceptedRide()`
   - RabbitMQ delivers the acceptance message to User Service
   - User Service emits the event to the waiting connection
   - User receives captain acceptance and ride details in real-time

5. **Ride Starts**
   - Both captain and rider have confirmed the match
   - Real-time location updates and ride tracking can begin

---

## API Communication Patterns

### Long-Polling for Real-Time Updates

The system uses long-polling to provide real-time notifications without WebSocket complexity:

- **Captain's Long-Poll:** `/captain/wait-for-ride` waits up to 30 seconds for new ride offers
- **User's Long-Poll:** `/user/wait-for-acceptance` waits up to 30 seconds for captain acceptance

If no event occurs within the timeout, the server responds with `204 No Content` and the client can retry.

### Asynchronous Messaging

RabbitMQ enables decoupled communication between services:

- **Message Queues:**
  - `new-ride` — Published when a user requests a ride
  - `ride-accepted` — Published when a captain accepts a ride

---

## Security Features

- **JWT Authentication** — Secure token-based authentication for all services
- **Password Hashing** — bcrypt for secure password storage
- **Token Blacklisting** — Logout functionality via token blacklisting
- **Middleware** — Authentication middleware on protected routes
- **Environment Variables** — Sensitive configuration stored securely


---

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Docker & Docker Compose
- MongoDB
- RabbitMQ

### Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd zippy-micro-service
   ```

2. **Start all services with Docker Compose:**

   ```bash
   docker compose up -d
   ```

3. **Verify services are running:**
   ```bash
   docker compose ps
   ```

All services will be automatically initialized and available at their respective ports.

---

## Running Services Individually

### Start Captain Service

```bash
cd captain-service
bun install
bun run dev
```

### Start User Service

```bash
cd user-service
bun install
bun run dev
```

### Start Ride Service

```bash
cd ride-service
bun install
bun run dev
```

### Start Service Gateway

```bash
cd service-gateway
bun install
bun run dev
```

---

## Environment Configuration

Each service requires a `.env` file with:

```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/zippy-db
RABBITMQ_URL=amqp://guest:guest@localhost:5672
JWT_SECRET=your-secret-key
```

## Performance & Scalability

### Production Load Estimates

Based on typical benchmarks for similar Node.js/MongoDB/RabbitMQ stacks (single instances with 4-8 CPU cores, 16GB RAM, optimized configurations):

| Component           | Concurrent Load per Instance | Scaled Capacity                   | Notes                            |
| ------------------- | ---------------------------- | --------------------------------- | -------------------------------- |
| **User Service**    | 5,000-10,000 active users    | 50,000+ users (5-10 instances)    | Ride requests, profiles, logins  |
| **Captain Service** | 2,000-5,000 active captains  | 20,000+ captains (5-10 instances) | Availability toggles, ride waits |
| **Ride Service**    | 1,000-3,000 concurrent rides | 15,000+ rides (5-10 instances)    | Ride management, status updates  |
| **Service Gateway** | 10,000-20,000 requests/sec   | 100,000+ req/sec (5-10 instances) | API routing, load balancing      |
| **MongoDB**         | 5,000-10,000 ops/sec         | 50,000+ ops/sec (sharded cluster) | Database operations              |
| **RabbitMQ**        | 10,000-20,000 messages/sec   | 100,000+ msg/sec (clustered)      | Message queuing                  |

### Total System Capacity

In a production cluster (10-20 instances across all services):

- **100,000+ daily active users**
- **20,000+ active captains**
- **10,000-50,000 ride requests/hour**
- **Sub-200ms average response times**
- **<1% error rates under normal load**

### Key Performance Factors

- **Horizontal Scaling**: Services can be scaled independently based on load
- **Load Balancing**: Required for distributing traffic across instances
- **Database Optimization**: Indexing, connection pooling, and sharding for MongoDB
- **Message Queue Tuning**: RabbitMQ clustering and consumer optimization
- **Caching**: Redis integration recommended for session and frequently accessed data

**Note**: Actual performance depends on infrastructure, code optimization, traffic patterns, and geographic distribution. Conduct thorough load testing before production deployment.

---

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Create a feature branch (`git checkout -b feature/your-feature`)
2. Commit your changes (`git commit -m 'Add new feature'`)
3. Push to the branch (`git push origin feature/your-feature`)
4. Open a Pull Request

---

## Support

For issues, questions, or suggestions, please open an issue in the repository or contact the development team.
