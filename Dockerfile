FROM debian:stable-slim

WORKDIR /app

RUN apt-get update && \
  apt-get install -y imagemagick ffmpeg && \
  apt-get clean && rm -rf /var/lib/apt/lists/*

COPY ./build/gift-picture-frame-linux-amd64 ./gift-picture-frame

EXPOSE 8080

CMD ["./gift-picture-frame", "uploader", "start"]
