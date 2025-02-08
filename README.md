# RealTrev

RealTrev is a web platform that connects travelers with locals to get real-time updates about destinations they plan to visit. It helps users stay informed about the latest conditions, events, and safety concerns in various locations through crowd-sourced reports.

## Features
- **Real-Time Updates**: Travelers can receive live updates about places they plan to visit.
- **Community-Driven Reports**: Locals and other travelers can share information about ongoing events, safety concerns, or local insights.
- **User Authentication**: Secure login and account management for users.
- **Interactive Map**: Visual representation of location-based reports.
- **Comment & Vote System**: Users can comment on and upvote/downvote reports to ensure accuracy.
- **Notification System**: Users can subscribe to updates for specific locations.

## Tech Stack
- **Frontend**: Next.js, Tailwind CSS, ShadCN (Radix UI)
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL (with Prisma ORM)
- **Authentication**: NextAuth.js
- **Hosting & Deployment**: Render.com

## Installation

### Prerequisites
Ensure you have the following installed:
- Node.js (v18+ recommended)
- PostgreSQL (for database setup)

### Steps to Set Up Locally
1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/realtrev.git
   cd realtrev
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Set up the environment variables:
   Create a `.env` file in the root directory and add the following:
   ```env
   DATABASE_URL=your_postgresql_database_url
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   ```

4. Apply database migrations:
   ```sh
   npx prisma migrate dev --name init
   ```

5. Start the development server:
   ```sh
   npm run dev
   ```

6. Open the application in your browser:
   ```
   http://localhost:3000
   ```

## Contributing
Contributions are welcome! If you'd like to contribute:
1. Fork the repository.
2. Create a new branch (`feature/your-feature-name`).
3. Commit your changes and push to your fork.
4. Open a pull request.

## License
This project is licensed under the MIT License.

## Contact
For any inquiries or support, reach out to **Rithvick Kumar** via [LinkedIn](https://www.linkedin.com/in/yourprofile) or email at `12216061@NITKKR.AC.IN`.

---

Feel free to modify any sections as needed. 🚀

# RealTrev

RealTrev is a web platform that connects travelers with locals to get real-time updates about destinations they plan to visit. It helps users stay informed about the latest conditions, events, and safety concerns in various locations through crowd-sourced reports.

## Features
- **Real-Time Updates**: Travelers can receive live updates about places they plan to visit.
- **Community-Driven Reports**: Locals and other travelers can share information about ongoing events, safety concerns, or local insights.
- **User Authentication**: Secure login and account management for users.
- **Interactive Map**: Visual representation of location-based reports.
- **Comment & Vote System**: Users can comment on and upvote/downvote reports to ensure accuracy.
- **Notification System**: Users can subscribe to updates for specific locations.

## Tech Stack
- **Frontend**: Next.js, Tailwind CSS, ShadCN (Radix UI)
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL (with Prisma ORM)
- **Authentication**: NextAuth.js
- **Hosting & Deployment**: Render.com

## Installation

### Prerequisites
Ensure you have the following installed:
- Node.js (v18+ recommended)
- PostgreSQL (for database setup)

### Steps to Set Up Locally
1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/realtrev.git
   cd realtrev
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Set up the environment variables:
   Create a `.env` file in the root directory and add the following:
   ```env
   DATABASE_URL=your_postgresql_database_url
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   ```

4. Apply database migrations:
   ```sh
   npx prisma migrate dev --name init
   ```

5. Start the development server:
   ```sh
   npm run dev
   ```

6. Open the application in your browser:
   ```
   http://localhost:3000
   ```

## Contributing
Contributions are welcome! If you'd like to contribute:
1. Fork the repository.
2. Create a new branch (`feature/your-feature-name`).
3. Commit your changes and push to your fork.
4. Open a pull request.

## License
This project is licensed under the MIT License.

## Contact
For any inquiries or support, reach out to **Rithvick Kumar** via [LinkedIn](https://www.linkedin.com/in/yourprofile) or email at `12216061@NITKKR.AC.IN`.

---

