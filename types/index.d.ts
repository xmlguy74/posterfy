interface Configuration {
    homeAssistant: string,
    secure: boolean,
    theme: string,
    title: string,
    subtitle: string,
    showTime: boolean,
    showDate: boolean,
    mediaPlayer: string,
}

interface Window {
    CONFIG: Configuration
}
  