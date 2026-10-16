# Travel – Tour Booking Platform

A full-stack tour booking system with three apps:

| App | Tech | URL after start |
|---|---|---|
| Customer website (`travelweb`) | Next.js 15, React 19, Tailwind | http://localhost:3000 |
| Admin dashboard (`admintravel`) | Next.js 15, React 19, Tailwind | http://localhost:3001 |
| REST API + WebSocket (`travel`) | Spring Boot 3.5, Java 17, JPA, JWT | http://localhost:8088 |
| Database | MySQL 8.4 | `localhost:3307` (user `root`, password `123456`) |

## Run it with Docker (recommended)

**Requirement:** [Docker Desktop](https://www.docker.com/products/docker-desktop/), installed and running. You don't need Java, Node or MySQL.

```bash
git clone <this-repo-url>
cd Travel
```

Then run the start script:

- **Windows (PowerShell):** `powershell -ExecutionPolicy Bypass -File start.ps1`
- **macOS / Linux:** `sh start.sh`

The script builds the three images one at a time and then starts everything. Don't use `docker compose up --build` for the first run: it builds all images at once, and that can run out of memory on Docker Desktop's default 4 GB.

The first build takes about 10–15 minutes because it downloads dependencies. After that, `docker compose up -d` starts everything in a few seconds.

Then open:
- Website: http://localhost:3000
- Admin: http://localhost:3001

The backend waits for MySQL to be ready before it starts. It can take up to a minute after `docker compose up` returns before the site loads data.

### Demo accounts

| Account | Email | Password | Use it on |
|---|---|---|---|
| Customer | `user@travel.com` | `User@123456` | Website (http://localhost:3000) |
| Admin | `admin@travel.com` | `Admin@123456` | Admin dashboard (http://localhost:3001) |

These are created automatically the first time the database starts. If your database already existed before they were added, create them with:

```bash
docker compose exec -T mysql sh -c 'mysql -uroot -p"$MYSQL_ROOT_PASSWORD" travel' < database/init/02-demo-accounts.sql
```

### Useful commands

```bash
docker compose ps                 # status of all services
docker compose logs -f backend    # follow backend logs
docker compose down               # stop everything (data is kept)
docker compose down -v            # stop and DELETE the database (re-imports sample data next start)
```

### Running on a server or another machine

By default the apps expect to be opened at `localhost`. If Docker runs on one machine and you open the site from another (for example `http://192.168.1.50:3000`), tell the build which address people will use. Add this to `.env`:

```bash
PUBLIC_HOST=192.168.1.50
```

Then rebuild the frontends and restart:

```bash
docker compose build travelweb admin
docker compose up -d
```

The frontends need the rebuild because the backend address is built into their browser code. Without it, the site loads, but every API call fails with `ERR_CONNECTION_REFUSED`.

### Troubleshooting

- **"port is already allocated"**: another program is using port 3000, 3001, 8088 or 3307. Stop that program. For MySQL only, you can also set a different host port: `MYSQL_HOST_PORT=3310 docker compose up -d`.
- **Website loads but shows no tours**: the backend may still be starting. Run `docker compose logs -f backend` and wait for `Started TravelApplication`.

## Run without Docker (development)

1. Create a MySQL database named `travel` and import `database/init/01-travel.sql`.
2. Backend: `cd travel && ./mvnw spring-boot:run` (port 8088)
3. Website: `cd travelweb && npm install && npm run dev` (port 3000)
4. Admin: `cd admintravel && npm install && npm run dev` (port 3001)
