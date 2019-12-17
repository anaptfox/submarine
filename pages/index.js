import React, {useState} from 'react'
import Head from 'next/head'
import styled from '@emotion/styled'
import {keyframes, css, Global} from '@emotion/core'
import mqtt from 'mqtt'

const Background = styled.div`
  width: 100%;
  height: 500px;
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

const drift = keyframes`
from { transform: rotate(0deg); }
from { transform: rotate(180deg); }
`

const Wave = styled.div`
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

const WaveTwo = styled(Wave)`
  animation: ${drift} 21s infinite linear;
  animation-play-state: ${props => (props.animate ? 'running' : 'paused')};
`

const WaveThree = styled(Wave)`
  animation: ${drift} 22s infinite linear;
  animation-play-state: ${props => (props.animate ? 'running' : 'paused')};
  opacity: 0.1;
  background: yellow;
`

const Logo = styled.img`
  width: 125px;
  margin-top: 30px;
  z-index: 2;
`
const Header = styled.h1`
  z-index: 2;
  color: white;
  margin: 10px 0 30px 0;
  font-size: 22px;
`

const Main = styled.main`
  display: flex;
  height: 100%;
  align-items: center;
  z-index: 2;
  flex-direction: column;
`

const App = styled.div`
  width: 1127px;
  height: 100%;
  position: relative;
  overflow: hidden;
  transform: translate3d(0, 0, 0);
  display: flex;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
  justify-content: center;
  align-items: center;
  background: #fcfafa;
`

export default () => {
  const [animateBackground, setAnimateBackground] = useState(false)

  const flipBackground = toggle => {
    return () => {
      setAnimateBackground(toggle)
    }
  }

  var host = 'wss://broker.losant.com:443'
  const clientId = '5df84b48829bcb0006627187'

  var options = {
    clientId: clientId,
    username: '619e023e-91e9-491e-b6e8-78b87fe9133c',
    password:
      'a6357184a4f4f7728bdc6fe88c76efb21abcc10aa4e3523048569f102c252438',
  }

  var client = mqtt.connect(host, options)

  client.on('error', function(err) {
    console.log(err)
    client.end()
  })

  client.on('connect', function() {
    console.log('client connected:' + clientId)
    setAnimateBackground(true)
  })

  client.subscribe(`/losant/${clientId}/state`, {qos: 0})

  client.on('message', function(topic, message, packet) {
    console.log(
      'Received Message:= ' + message.toString() + '\nOn topic:= ' + topic,
    )
  })

  client.on('close', function() {
    console.log(clientId + ' disconnected')
    setAnimateBackground(false)
  })

  return (
    <React.Fragment>
      <Global
        styles={css`
          html,
          body {
            height: 100%;
            margin: 0;
            font-family: Helvetica, Arial, sans-serif;
            font-size: 24px;
          }
          html {
            background: #f0d78c;
          }
          #__next {
            height 100%;
          }
          h1 {
            font-family: 'Quando';
          }
        `}
      />
      <Head>
        <title>With Emotion</title>
        <link href="https://fonts.googleapis.com/css?family=Quando&display=swap" rel="stylesheet"></link>
      </Head>
      <Background>
        <Wave animate={animateBackground} />
        <WaveTwo animate={animateBackground} />
        <WaveThree animate={animateBackground} />
      </Background>
      <Main>
        <Logo src="/submarine-logo.png" alt="Submarine Logo" />
        <Header>Submarine</Header>
        <App>
          <button onClick={flipBackground(true)}>On </button>{' '}
          <button onClick={flipBackground(false)}>off</button>
        </App>
      </Main>
    </React.Fragment>
  )
}
