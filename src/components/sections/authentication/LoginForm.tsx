import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import axios from 'axios';
import IconifyIcon from 'components/base/IconifyIcon';
import { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import paths from './../../../routes/path';
import { redirect } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation } from 'app/features/auth/authQuery';
// import { userDataLogin } from 'app/features/user/userSlice';
import Cookies from "js-cookie";

import { AppDispatch, persistor } from "app/store";
import { clearCredentials, setCredentials } from "app/features/auth/authSlice";

interface IFormInput {
  email: string;
  password: string;
}

const LoginForm = () => {
const dispatch = useDispatch()

// const user = useSelector()
  /**States */
  const navigate = useNavigate();
  const {pathname}= useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit } = useForm<IFormInput>();
  const url = import.meta.env.VITE_API_URL;
  /**Handlers */
  const handleClickShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  
  const [login, { isLoading }] = useLoginMutation();
 
  const onSubmit = async (formData: IFormInput) => {
    try {
      const response = await login(formData).unwrap();
      // console.log(response);
      const token = response?.token;
      const user = {
        email: response?.data?.email,
        id: response?.data?.id,
        name: response?.data?.name,
        permissions:response?.data?.permissions

      };
      
      // localStorage.setItem('token', response?.token);
      // Cookies.set("authData", {token,user} , { expires: 7 });
      if (token && user) {
        dispatch(setCredentials({ token, user }));
        //   localStorage.setItem("useToken",token)

        navigate("/");
      // console.error("Logied:", error);

      }
    } catch (error) {
      // console.error("Login failed:", error);
      // console.error("Login", error?.data?.error);
    }
  };

  
// console.log("reder/rerender")
  return (
    <>
      <Box
        sx={{
          mt: { sm: 5, xs: 2.5 },
        }}
        component="form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Stack spacing={3}>
          <TextField
            fullWidth
            variant="outlined"
            id="email"
            type="text"
            label="Email"
            {...register('email', { required: 'Email is required' })}
          />
          <TextField
            fullWidth
            variant="outlined"
            id="password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            {...register('password', { required: 'Password is required' })}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? (
                      <IconifyIcon icon="el:eye-close" color="action.active" />
                    ) : (
                      <IconifyIcon icon="el:eye-open" color="action.focus" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Stack>

        {error && (
          <Typography color="error" variant="body2" mt={2}>
            {error}
          </Typography>
        )}

        <Button
          color="primary"
          variant="contained"
          size="large"
          fullWidth
          type="submit"
          sx={{ mt: 3, fontSize: '18px' }}
        >
          Sign In
        </Button>
      </Box>
      <Toaster position="bottom-center" reverseOrder={false} />
    </>
  );
};

export default LoginForm;
