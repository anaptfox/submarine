/** @jsx jsx */
import {jsx, css} from '@emotion/core'
import {Form, Header, Label} from 'semantic-ui-react'
import PropTypes from 'prop-types'
import useForm from 'react-hook-form'
import {useRouter} from 'next/router'
import * as yup from 'yup'
import {Button, Segment, Note} from '../../ui'

const schema = yup.object().shape({
  password: yup
    .string()
    .min(8)
    .max(64)
    .label('Password')
    .required(),
  password_confirm: yup
    .string()
    .oneOf([yup.ref('password'), null], "Passwords don't match")
    .required('Confirm Password is required'),
  username: yup.string().required(),
})

const PasswordCreation = ({prev, next, collect, data, navigateStep}) => {
  const router = useRouter()
  const {register, handleSubmit, errors} = useForm({
    validationSchema: schema,
  })
  const onSubmit = data => {
    collect(data)
    router.push('/therapist/submit')
  }

  const onBack = () => {
    navigateStep(prev)
  }

  return (
    <>
      <Segment>
        <Header>Now it is time to set your username & password.</Header>
        <Form onSubmit={handleSubmit(onSubmit)} id="password">
          <Form.Field>
            <label>Username</label>
            <Note>
              You will use your username to log in. It will in the URL of your
              profile.
            </Note>
            <input
              ref={register}
              name="username"
              type="text"
              defaultValue={data.username || ''}
              placeholder="username"
              error={errors.username}
              required
            />
          </Form.Field>
          <Form.Field>
            <label>Password</label>
            <Note>Must be between 8-64 characters</Note>
            <input
              ref={register}
              name="password"
              type="password"
              defaultValue={data.password || ''}
              placeholder="Password"
              error={errors.password}
              required
            />
            {errors.password && (
              <Label basic color="red" pointing>
                {errors.password.message}
              </Label>
            )}
          </Form.Field>
          <Form.Field>
            <label>Confirm Password</label>
            <input
              ref={register}
              name="password_confirm"
              type="password"
              defaultValue={data.password_confirm || ''}
              error={errors.password_confirm}
              placeholder="Confirm Password"
              required
            />
            {errors.password_confirm && (
              <Label basic color="red" pointing>
                {errors.password_confirm.message}
              </Label>
            )}
          </Form.Field>
        </Form>
      </Segment>
      <div
        css={css`
          display: flex;
          justify-content: space-between;
        `}
      >
        {prev && <Button onClick={onBack}>Go Back</Button>}
        <Button size="large" type="submit" form="password">
          Next
        </Button>
      </div>
    </>
  )
}

PasswordCreation.propTypes = {
  prev: PropTypes.object,
  next: PropTypes.string,
  collect: PropTypes.func,
  data: PropTypes.object,
  attribs: PropTypes.attribs,
  navigateStep: PropTypes.func,
}

export default PasswordCreation
