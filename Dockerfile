# TODO: Set a base image based on your application stack (e.g., node, python, ubuntu, alpine)
FROM alpine:latest

# TODO: Set up the working directory inside the container
WORKDIR /app

# TODO: Copy application code and dependencies
# COPY package.json .
# RUN npm install
COPY . .

# TODO: Define the default command or entrypoint to run your application
CMD ["echo", "Docker image is running successfully!"]
