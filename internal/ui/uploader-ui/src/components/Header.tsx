import './Header.css'

interface HeaderProps {
  frameId: string
}

export default function Header(props: HeaderProps) {
  return (
    <header class="header">
      <h1>Picture Frame {props.frameId}</h1>
      <p>Upload photos, videos, or text messages to display on your picture frame</p>
    </header>
  )
}