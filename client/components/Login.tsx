import React from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { Dialog } from '@mui/material';
import DialogContentText from '@mui/material/DialogContentText';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import {getCookie, setCookies} from 'cookies-next';
import { useRouter } from 'next/router';
import {useActions} from "../hooks/useActions";

const Login = () => {
  const router = useRouter();
  const {setToken} = useActions();
  let [display, setDisplay] = React.useState(true);
  let [c1URL, setC1URL] = React.useState('');
  let [username, setUsername] = React.useState('');
  let [password, setPassword] = React.useState('');
  let [dialogText, setDialogText] = React.useState('Введите адрес инстанса Case.One и данные для входа');

  async function submit() {
    let res = await fetch(process.env.outsideAddress + '/api/auth/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json',
      'Content-Length': JSON.stringify({c1URL: c1URL, username: username, password: password}).length.toString()},
      body: JSON.stringify({c1URL: c1URL, username: username, password: password})
    });
    let data = await res.json();
    if (data.hasOwnProperty('token')) {
      setToken(data.token);
      setCookies('token', data.token, {maxAge: 60*60*24});
      setDisplay(false);
    } else {
      setDialogText('Неверные данные для входа!')
    }
  }
  return (
      <Dialog open={display} onClose={() => router.push('/')}>
        <DialogTitle>{'Вход'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {dialogText}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="c1URL"
            label={'Case.One URL'}
            onChange={e => {
              setC1URL(e.target.value);
            }}
            fullWidth
            variant="standard"
          />
          <TextField
              autoFocus
              margin="dense"
              id="username"
              label={'Логин'}
              onChange={e => {
                setUsername(e.target.value);
              }}
              fullWidth
              variant="standard"
          />
          <TextField
              autoFocus
              margin="dense"
              id="password"
              label={'Пароль'}
              onChange={e => {
                setPassword(e.target.value);
              }}
              type="password"
              fullWidth
              variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={submit}>{'Отправить'}</Button>
          <Button sx={{color: 'red'}} onClick={() => router.push('/')}>{'Отмена'}</Button>
        </DialogActions>
      </Dialog>
  );
};

export default Login;
