# Picture Frame

A Go-based picture frame application that allows uploading and displaying media
content. The application consists of a server for media uploads and a client
for displaying content in kiosk mode.

## Features

- **Server**: Web interface for uploading pictures, videos, and text messages
- **Client**: Displays media in a slideshow format using Chromium in kiosk mode
- **Media Support**: Images (JPG, PNG, GIF), videos (MP4, AVI, MOV, WEBM), and
  text messages
- **Web Interface**: Drag-and-drop upload with real-time preview
- **Slideshow Controls**: Navigation, play/pause, and timing controls

## Building

```bash
go build -o picture-frame
```

## Usage

### Server

Start the server to accept media uploads:

```bash
./picture-frame server start
```

The server will start on port 8080 by default. You can specify a different
port:

```bash
./picture-frame server start --port 9000
```

### Client

Start the picture frame client to display media:

```bash
./picture-frame client start --id <frame-id> --server <server-url>
```

Example:

```bash
./picture-frame client start --id living-room --server http://localhost:8080
```

The client will:

1. Launch Chromium in kiosk mode
2. Start a local server on port 3000 to proxy media from the main server
3. Display media in a continuous slideshow

### Web Interface

- **Upload Interface**: Visit `http://<server-url>/<frame-id>` to upload media
- **Media API**: Access `http://<server-url>/<frame-id>/media` to get media list
- **Upload API**: POST to `http://<server-url>/<frame-id>/upload` to upload files

## API Endpoints

- `GET /:id` - Upload interface for the specified frame ID
- `POST /:id/upload` - Upload media files or text content
- `GET /:id/media` - Retrieve media list for the specified frame ID

## File Structure

```
picture-frame/
├── cmd/
│   ├── client/         # Client command implementation
│   └── server/         # Server command implementation
├── internal/
│   ├── client/         # Client logic and HTTP handlers
│   └── server/         # Server logic and HTTP handlers
├── web/
│   ├── static/         # CSS and JavaScript files
│   └── templates/      # HTML templates
├── data/               # Media storage (created at runtime)
└── main.go            # CLI entry point
```

## Requirements

For the client to work properly, you need one of the following browsers
installed:

- `chromium-browser`
- `google-chrome`
- `firefox`

The client will automatically detect and use the first available browser.

## Data Storage

Media files are stored in the `data/<frame-id>/` directory, with metadata
stored in JSON format for efficient retrieval and display.
