import styled from "@emotion/styled";

export const AppSection = styled.div`
    text-align: center;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`
export const TaskbarSection = styled.div`
    display: flex;
    flex-grow: 0;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
`

export const HeaderSection = styled.div`
    flex-grow: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
`

export const PosterSection = styled.div`
    flex-grow: 1;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: solid 3px #FFFFFF;
    border-radius: 10px;
    width: 90vw;
    height: 72vh;
    margin-top: -1em;
`

export const FooterSection = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 90vw;
    margin-bottom: 0.8em;
`

export const FooterText = styled.div`
    margin-top:1vh;
    font-family: Josefin Sans;
    font-size: 80pt;
    font-weight: 700;
    font-variant-caps: all-small-caps;
    flex-grow: 0;
    width: 80vw;
`