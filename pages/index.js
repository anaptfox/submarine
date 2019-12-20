import React, {useState, useEffect} from 'react'
import Head from 'next/head'
import {css, Global} from '@emotion/core'
import useForm from 'react-hook-form'
import mqtt from 'mqtt'
import moment from 'moment'

import {
  Container,
  Form,
  Checkbox,
  Grid,
  Image,
  Modal,
  Label,
  Button,
  Select,
  Icon,
  Feed,
} from 'semantic-ui-react'

import {
  Logo,
  Header,
  Main,
  Background,
  Wave,
  App,
  WaveThree,
  WaveTwo,
} from '../components/ui'
import 'semantic-ui-css/semantic.min.css'

const transportOptions = [{key: 'wss', value: 'wss', text: 'Secure WebSockets'}]

// Map of transport types to the corresponding url prefixes.
// form: https://github.com/Losant/losant-mqtt-js/blob/master/lib/mqtt.js
var transportPrefixes = {
  tcp: {prefix: 'mqtt://', port: 1883},
  tls: {prefix: 'mqtts://', port: 8883},
  ws: {prefix: 'ws://', port: 80},
  wss: {prefix: 'wss://', port: 443},
}

const Message = ({type, title, date, data}) => {
  return (
    <Feed.Event>
      <Feed.Label>
        <Icon name="pencil" />
      </Feed.Label>
      <Feed.Content>
        <Feed.Summary>
          {title || type}
          <Feed.Date>{date.fromNow()}</Feed.Date>
        </Feed.Summary>
        {data && <Feed.Extra text>{data.toString()}</Feed.Extra>}
      </Feed.Content>
    </Feed.Event>
  )
}

const Messages = ({messages}) => {
  const html = messages.map((message, index) => {
    return (
      <Message
        key={`message-${index}-${message.date.unix()}`}
        type={message.type}
        date={message.date}
        title={message.title}
        data={message.data}
      />
    )
  })
  return <Feed>{html}</Feed>
}

const Index = () => {
  const [fresh, setFresh] = useState(true)
  const [client, setClient] = useState(null)
  const [logs, setLogs] = useState([])
  const [data, setData] = useState({})
  const {register, handleSubmit, errors, setError} = useForm()
  const [connected, setConnected] = useState(false)

  const addMessage = newMessage => {
    const {type, title, topic, data} = newMessage
    const newMessages = [
      ...logs,
      {
        type,
        title,
        topic,
        data,
        date: moment(),
      },
    ]
    setLogs(newMessages)
  }

  const onSubmit = data => {
    const {username, password, clientId} = data
    setFresh(false)
    const mqttOptions = {
      username,
      password,
      clientId,
    }

    const newClient = mqtt.connect(data.host, mqttOptions)
    console.log(newClient)
    setClient(newClient)
  }

  const onPublish = client => {
    return data => {
      console.log(data)
      console.log(client)
      if (client) {
        client.publish(data.topic, data.message)
      } else {
        console.log('could not publish')
      }
    }
  }

  const onSubscribe = client => {
    return data => {
      console.log(data)
      console.log(client)
      if (client) {
        client.subscribe(data.sub)
      } else {
        console.log('could not publish')
      }
    }
  }

  const disconnect = () => {
    console.log('disconnect')
    client && client.end()
    setClient(null)
    setConnected(false)
    addMessage({
      type: 'disconnect',
      title: 'Disconnected',
    })
  }

  const clientOnError = err => {
    console.log(err)
    client.end()
  }

  const clientOnConnect = () => {
    console.log('client connected')
    setConnected(true)
    addMessage({
      type: 'connect',
      title: 'Connected',
    })
  }

  const clientOnMessage = (topic, data, packet) => {
    addMessage({
      type: 'subscribe',
      title: topic,
      topic,
      data,
      date: moment(),
    })

    console.log(
      'Received Message:= ' + data.toString() + '\nOn topic:= ' + topic,
    )
  }

  const clientOnClose = () => {
    console.log(' disconnected')
    console.log(client)
    disconnect()
  }

  useEffect(() => {
    if (client) {
      client.on('error', clientOnError)
      client.on('connect', clientOnConnect)
      client.on('message', clientOnMessage)
      client.on('close', clientOnClose)
    }
    return () => {
      if (client) {
        client.removeListener('error', clientOnError)
        client.removeListener('connect', clientOnConnect)
        client.removeListener('message', clientOnMessage)
        client.removeListener('close', clientOnClose)
      }
    }
  }, [client, logs])

  return (
    <>
      <Global
        styles={css`
          html,
          body {
            height: 100%;
            margin: 0;
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
        <link
          href="https://fonts.googleapis.com/css?family=Quando&display=swap"
          rel="stylesheet"
        ></link>
      </Head>
      <Background>
        <Wave animate={connected} />
        <WaveThree animate={connected} />
      </Background>
      <Main>
        <Logo src="/submarine-logo.png" alt="Submarine Logo" />
        <Header>Submarine</Header>
        <App>
          <Grid celled>
            <Grid.Row>
              <Grid.Column width={6}>
                <Label color={connected ? 'green' : 'red'} attached="top right">
                  {connected ? 'Connected' : 'Disconnected'}
                </Label>
                <div>
                  <h2>Connection Settings</h2>
                  <Form onSubmit={handleSubmit(onSubmit)} id="connection">
                    <Form.Field>
                      <input
                        ref={register}
                        name="host"
                        type="text"
                        defaultValue={data.host || 'ws://broker.losant.com:80'}
                        placeholder="Host"
                        error={errors.host}
                        required
                      />
                      {errors.host && (
                        <Label basic color="red" pointing>
                          {errors.host.message}
                        </Label>
                      )}
                    </Form.Field>
                    <Form.Field>
                      <input
                        ref={register}
                        name="clientId"
                        type="text"
                        defaultValue={
                          data.clientId || '5df84b48829bcb0006627187'
                        }
                        placeholder="clientId"
                        error={errors.clientId}
                        required
                      />
                      {errors.clientId && (
                        <Label basic color="red" pointing>
                          {errors.clientId.message}
                        </Label>
                      )}
                    </Form.Field>
                    <Form.Field>
                      <input
                        ref={register}
                        name="username"
                        type="text"
                        defaultValue={
                          data.username ||
                          '619e023e-91e9-491e-b6e8-78b87fe9133c'
                        }
                        placeholder="username"
                        error={errors.username}
                        required
                      />
                      {errors.username && (
                        <Label basic color="red" pointing>
                          {errors.username.message}
                        </Label>
                      )}
                    </Form.Field>
                    <Form.Field>
                      <input
                        ref={register}
                        name="password"
                        type="text"
                        defaultValue={
                          data.password ||
                          'a6357184a4f4f7728bdc6fe88c76efb21abcc10aa4e3523048569f102c252438'
                        }
                        placeholder="password"
                        error={errors.password}
                        required
                      />
                      {errors.password && (
                        <Label basic color="red" pointing>
                          {errors.password.message}
                        </Label>
                      )}
                    </Form.Field>
                    {!connected && (
                      <Button color="green" type="submit">
                        Connect
                      </Button>
                    )}
                    {connected && (
                      <Button onClick={disconnect} color="red">
                        Disconnect
                      </Button>
                    )}
                  </Form>
                </div>
                {client && (
                  <div style={{marginTop: '20px'}}>
                    <h2>Publish</h2>
                    <Form
                      onSubmit={handleSubmit(onPublish(client))}
                      id="publish"
                    >
                      <Form.Field>
                        <input
                          ref={register}
                          name="topic"
                          type="text"
                          defaultValue={data.topic || '/test'}
                          placeholder="topic"
                          error={errors.topic}
                          required
                        />
                        {errors.topic && (
                          <Label basic color="red" pointing>
                            {errors.topic.message}
                          </Label>
                        )}
                      </Form.Field>
                      <Form.Field>
                        <textarea
                          ref={register}
                          name="message"
                          type="text"
                          defaultValue={data.message || 'woo'}
                          placeholder="message"
                          error={errors.message}
                          required
                        />
                        {errors.message && (
                          <Label basic color="red" pointing>
                            {errors.message.message}
                          </Label>
                        )}
                      </Form.Field>
                      <Button type="submit" form="publish">
                        Publish
                      </Button>
                    </Form>
                  </div>
                )}
                {client && (
                  <div style={{marginTop: '20px'}}>
                    <h2>Subscribe</h2>
                    <Form
                      onSubmit={handleSubmit(onSubscribe(client))}
                      id="subscribe"
                    >
                      <Form.Field>
                        <input
                          ref={register}
                          name="sub"
                          type="text"
                          defaultValue={data.sub || '/losant/5df84b48829bcb0006627187/state'}
                          placeholder="sub"
                          error={errors.sub}
                          required
                        />
                        {errors.sub && (
                          <Label basic color="red" pointing>
                            {errors.sub.message}
                          </Label>
                        )}
                      </Form.Field>
                      <Button type="submit" form="subscribe">
                        Subscribe
                      </Button>
                    </Form>
                  </div>
                )}
              </Grid.Column>
              <Grid.Column width={10}>
                {logs.length === 0 ? (
                  <h1>Nada</h1>
                ) : (
                  <Messages messages={logs} />
                )}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </App>
      </Main>
    </>
  )
}

export default Index
