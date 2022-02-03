import { BackgroundSection, TitleContainer } from './TitleBanner.styled';

export interface TitleBannerProps {
    title: string,
    subtitle: string
}

export function TitleBanner(props: TitleBannerProps) {
    return (
        <TitleContainer>
            <BackgroundSection className="TitleBanner-Background" />            
            <h1 className="TitleBanner-Title">
                <span>{props.title}</span>
                <span>{props.title}</span>
            </h1>
            <h2 className="TitleBanner-Subtitle">{props.subtitle}</h2>
        </TitleContainer>
    );
}