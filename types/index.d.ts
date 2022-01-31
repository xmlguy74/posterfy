interface Configuration {
    homeAssistant: string,
    secure: boolean,
    theme: string,
    title: string,
    subtitle: string,
    showTime: boolean,
    showDate: boolean,

    mediaPlayer: MediaPlayerConfig
}

interface MediaPlayerConfig {
    entity_id: string,
    source: MetadataReducer<MediaPlayerSource> | MetadataMap<MediaPlayerSource>,
    state: MetadataReducer<MediaPlayerState> | MetadataMap<MediaPlayerState>,
}

type MetadataReducer<T> = (id: string, entity: Entity, context: HomeAssistantContext) => T

type MetadataMap<T> = Dict<string, T>

interface Window {
    CONFIG: Configuration
}

interface AnyEntity extends Entity<any> {
    entity_id: string,
    state: string,
    attributes: any,
}

interface Entity<TAttributes> {
    entity_id: string,
    state: string,
    attributes: TAttributes,
}
  