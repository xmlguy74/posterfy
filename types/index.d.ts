interface Configuration {
    homeAssistant: string,
    title: string,
    subtitle: string,
    showTime: boolean,
    showDate: boolean,
    mediaPlayer: string,
}

interface Window {
    CONFIG: Configuration
}
  