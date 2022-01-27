import styled from "@emotion/styled";

export const Container = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
`

export const MediaImage = styled.div`
    background-size:contain;
    background-repeat: no-repeat;
    width: 60px;
    height: 40px;
`

export const ContentSection = styled.div`    
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: start;
    width: 50%;
`

export const StatusSection = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: end;
    width: 50%;
`