import styled from '@emotion/styled'
import {Container} from 'semantic-ui-react'
import {keyframes} from '@emotion/core'

export const Background = styled.div`
  width: 100%;
  height: 516px;
  box-shadow: 0 2px 30px rgba(black, 0.2);
  background: lighten(#f0f4c3, 10%);
  position: absolute;
  overflow: hidden;
  transform: translate3d(0, 0, 0);

  &:after {
    content: '';
    display: block;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    transform: translate3d(0, 0, 0);
  }
`

export const drift = keyframes`
    from { transform: rotate(0deg); }
    from { transform: rotate(180deg); }
`

export const Wave = styled.div`
  opacity: 0.8;
  position: absolute;
  top: -800%;
  left: -100%;
  background: #4f81c7;
  width: 4500px;
  height: 4500px;
  margin-left: -250px;
  margin-top: -250px;
  border-radius: 43%;
  animation: ${drift} 20s infinite linear;
  animation-play-state: ${props => (props.animate ? 'running' : 'paused')};
`

export const WaveTwo = styled(Wave)`
  animation: ${drift} 21s infinite linear;
  animation-play-state: ${props => (props.animate ? 'running' : 'paused')};
`

export const WaveThree = styled(Wave)`
  animation: ${drift} 22s infinite linear;
  animation-play-state: ${props => (props.animate ? 'running' : 'paused')};
  opacity: 0.1;
  background: yellow;
`

export const Logo = styled.img`
  width: 125px;
  margin-top: 30px;
  z-index: 2;
`
export const Header = styled.h1`
  z-index: 2;
  color: white;
  margin: 10px 0 30px 0;
  font-size: 22px;
`

export const Main = styled.main`
  display: flex;
  height: 100%;
  align-items: center;
  z-index: 2;
  flex-direction: column;
`

export const App = styled(Container)`
`
