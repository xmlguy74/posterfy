import platform_netflix from '../assets/platform_netflix.png'
import platform_hbomax from '../assets/platform_hbomax.png'
import platform_prime from '../assets/platform_prime.png'
import platform_tmdb from '../assets/platform_tmdb.png'
import platform_fandango from '../assets/platform_fandango.png'

const PLATFORM_IMAGES: any = {
    'netflix': platform_netflix,
    'hbomax': platform_hbomax,
    'prime': platform_prime,
    'tmdb': platform_tmdb,
    'fandango': platform_fandango,
};

export interface PlatformProps {
    className?: string
    platform?: string
}

export function Platform(props: PlatformProps) {
    
    const platformImage = PLATFORM_IMAGES[props.platform];

    return (
        <div className={props.className} style={{backgroundImage: `url(${platformImage})`}}></div>
    );
}