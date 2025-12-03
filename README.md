# Secret Santa

Part of [Toki on the fork](https://github.com/toki-on-the-fork)

<img align="right" height="160" src="https://user-images.githubusercontent.com/1037931/87014534-92e21280-c1cc-11ea-9675-5f2c0f3c287f.png"/>


Should you appreciate this tool so much that you'd like to thank me, you can either drop a friendly note in this repository's issues, or be a [one-time sponsor](https://github.com/sponsors/arcanis?frequency=one-time&sponsor=arcanis). Either would make my day 😊

<br/>

## Docker Deployment

### Prerequisites
- Docker installed on your system
- Docker Compose (optional, for easier deployment)

### Building and Running with Docker

#### Option 1: Using Docker directly

1. Build the Docker image:
```bash
docker build -t secretsanta .
```

2. Run the container:
```bash
docker run -d -p 5173:5173 --name secretsanta-app secretsanta
```

The application will be available at `http://localhost:5173`

#### Option 2: Using Docker Compose

1. Build and start the container:
```bash
docker-compose up -d
```

2. To view logs:
```bash
docker-compose logs -f
```

3. To stop the container:
```bash
docker-compose down
```

### Custom Port

To run on a different port, set the `PORT` environment variable:

```bash
docker run -d -p 8080:8080 -e PORT=8080 --name secretsanta-app secretsanta
```

Or in `docker-compose.yml`, modify the ports and environment sections.

### Note on Dev Server

The Docker setup uses Vite's development server (`yarn dev`) instead of a production build. This provides hot module replacement and faster development cycles. For production deployments, consider using a production build with a static file server instead.

### Production Deployment

For production, you may want to:
- Use a reverse proxy (nginx, traefik, etc.)
- Set up SSL/TLS certificates
- Configure environment variables
- Use a container orchestration platform (Kubernetes, Docker Swarm, etc.)

### Note on Base Path

The application is currently configured with `base: '/secretsanta/'` in `vite.config.ts`. If you're deploying to the root path, you'll need to change this to `base: '/'` before building the Docker image.

<br/>

## License (MIT)

> **Copyright © 2015 Maël Nison**
>
> Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
