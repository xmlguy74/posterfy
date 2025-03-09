
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
    theme: "retro_original",
    title: 'Morris',
    subtitle: 'Gameroom',
    showDate: true,
    showTime: true,
    showPoster: true,
    showFooter: true,
    showMediaPlayer: true,

    mediaPlayer: {
        //entity_id: 'sensor.movie_room_roku_state',
        source: (id, entity, context) => {
            
            const mediaPlayer = context.states.find(s => s.entity_id === 'media_player.marantz_sr8012');
            if (mediaPlayer) {
                switch (mediaPlayer.state) {
                    case 'on': {
                        if (mediaPlayer.attributes.source?.includes('Xbox') ?? false) {
                            return {
                                text: "XBox",
                            }
                        }
                        break;
                    }
                    default: {
                        return null;
                    }
                }
            }

            const player = context.states.find(s => s.entity_id === 'media_player.rec_room_roku');
            if (player) {
                return {
                    text: player.attributes.source, 
                    image: player.attributes.entity_picture
                }
            }
        },
        state: (id, entity, context) => {
            const mediaPlayer = context.states.find(s => s.entity_id === 'media_player.marantz_sr8012');
            if (mediaPlayer) {
                switch (mediaPlayer.state) {
                    case 'on': {
                        if (mediaPlayer.attributes.source?.includes('Xbox') ?? false) {
                            return {
                                text: null,
                                icon: "BsController"
                            }
                        }

                        if (mediaPlayer.attributes.source?.includes('Roku') ?? false) {
                            const player = context.states.find(s => s.entity_id === 'media_player.rec_room_roku');
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
                        break;
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