import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useDispatch } from 'react-redux';
import { logInUser } from '../state/slices';
import {zodResolver} from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LogInDataInputType, loginInputDataValidator } from "../interfaces";

export default function SignIn() {
  const dispatch = useDispatch()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LogInDataInputType>({
    resolver:zodResolver(loginInputDataValidator),
  });

  const onSubmit = (data:LogInDataInputType)=>{
    dispatch(logInUser({...data}));
  };
 
  return (
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign:"center"
          }}
        >
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              margin="normal"
              fullWidth
              label="Email"
              autoComplete="email"
              autoFocus
              {...register("email",{required:"Required Field"})}
              error = {!!errors?.email}
              helperText={errors?.email ? errors.email.message:null}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Password"
              type="password"
              autoComplete="current-password"
              {...register("password",{required:"Required Field"})}
              error = {!!errors?.password}
              helperText={errors?.password ? errors.password.message:null}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 , py:2}}
            >
              Sign In
            </Button>
          </form>
        </Box>
      </Container>
  );
}