
const ROKU_STATE_MAP = {
    none: {
        text: "Stopped",
        icon: "BsStopCircle"
    },    
    close: {
        text: "Stopped",
        icon: "BsStopCircle"
    },    
    stop: {
        text: "Stopped",
        icon: "BsStopCircle"
    },
    buffer: {
        text: "Buffering",
        icon: "BsDownload"
    },
    open: {
        text: "Playing",
        icon: "BsPlayCircle"
    },
    pause: {
        text: "Paused",
        icon: "BsPauseCircle"
    },
    play: {
        text: "Playing",
        icon: "BsPlayCircle"
    }
}

var CONFIG = {
    homeAssistant: "192.168.15.50:8123",
    secure: false,
    theme: "retro",
    title: '',
    subtitle: '',
    showDate: true,
    showTime: true,
    showPoster: true,
    showFooter: true,
    showMediaPlayer: true,
    entities: [
        'sensor.tmdb_feed',
        'media_player.marantz_sr8012',
        'media_player.movie_room_roku_ultra',
        'sensor.movie_room_roku_state'
    ],

    mediaPlayer: {
        //entity_id: 'sensor.movie_room_roku_state',
        source: (id, entity, context) => {
            
            const avr = context.states.find(s => s.entity_id === 'media_player.marantz_sr8012');
            if (avr) {
                switch (avr.state) {
                    case 'on': {
                        if (avr.attributes.source?.includes('Xbox') ?? false) {
                            return {
                                text: "XBox",
                            }
                        }
                        
                        if (avr.attributes.source?.includes('Roku') ?? false) {
                            const player = context.states.find(s => s.entity_id === 'media_player.movie_room_roku_ultra');
                            if (player) {
                                return {
                                    text: player.attributes.source, 
                                    image: player.attributes.entity_picture
                                }
                            }
                        }

                        return {
                            text: null
                        }
                    }
                    default: {
                        return null;
                    }
                }
            }
        },
        state: (id, entity, context) => {
            const avr = context.states.find(s => s.entity_id === 'media_player.marantz_sr8012');
            if (avr) {
                switch (avr.state) {
                    case 'on': {
                        if (avr.attributes.source?.includes('Xbox') ?? false) {
                            return {
                                text: null,
                                icon: "BsController"
                            }
                        }

                        if (avr.attributes.source?.includes('Roku') ?? false) {
                            const player = context.states.find(s => s.entity_id === 'media_player.movie_room_roku_ultra');
                            if (player) {
                                switch (player.attributes.source) {
                                    case 'Roku': {
                                        return {
                                            icon: 'BsDisplay'
                                        }
                                    }
                                    default: {
                                        const sensor = context.states.find(s => s.entity_id === 'sensor.movie_room_roku_state');
                                        return ROKU_STATE_MAP[sensor.state];                                        
                                    }
                                }
                            }
                        }

                        return {
                            text: null,
                            icon: 'BsQuestionCircle'
                        }
                    }
                    default: {
                        return {
                            text: "Off",
                            icon: "BsPower"
                        }
                    }
                }
            }
        },
    }
}