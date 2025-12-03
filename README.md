# gift-picture-frame

This project is a picture frame I built as a gift. It displays a slideshow of
media.

## Installation

Grab the latest release for your OS + architecture.

## The Uploader

The uploader is a web application that allows users to upload media.

```sh
gift-picture-frame uploader start
```

The server keeps a list of known frames and their access keys in `frames.json`

```json
{
  "known_frames": [
    {
      "name": "test",
      "allowed_keys": ["test-key"]
    }
  ]
}
```

## The Frame

The frame is also a web application. Its target hardware is a Raspberry Pi +
Touch Display 2.

```sh
gift-picture-frame frame start --id test --access-key test-key --server http://localhost:8080
```

The frame connects to the uploader and periodically checks for new media. It
also has options for:

- Screen Rotation (requires `wlr-randr` and a wlroots compatible compositor)
- Screen Brightness (requires Raspberry Pi Touch Display 2)
- Network Settings (requires `nmcli`)
- Color Temperature

## Development

```sh
./script/start
```

The stack is a little cursed:

- Go backends
- SolidJS frontends

Which doesn't sound so bad, but the frontends are actually SSG'd.

## Testing

There is no automated tests yet so testing is all done manually.

This will at least build and start a production build of everything:

```sh
./script/test
```
