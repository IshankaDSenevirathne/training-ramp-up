import { Button, styled, ButtonProps } from '@mui/material';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useDispatch } from 'react-redux';
import { signUpUser } from '../state/slices';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { SignUpDataInputType, signupInputDataValidator } from "../interfaces";

const SignUpButton = styled(Button)<ButtonProps>(({ theme }) => ({
  color: '#ffffff',
  backgroundColor: '#ef4444',
  margin:'2px',
  fontWeight:'bold',
  '&:hover': {
      backgroundColor: '#d32f2f',
  },
}));
const CustomTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: '#ef4444',
  },
  '& .MuiOutlinedInput-root': {
    '&.Mui-focused fieldset': {
      borderColor: '#ef4444',
    },
  },
 
});


export default function SignUp() {

  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SignUpDataInputType>({
    resolver:zodResolver(signupInputDataValidator),
  });

  const onSubmit = (data:SignUpDataInputType)=>{
    dispatch(signUpUser({...data}));
  };
  return (
      <Container component="main" maxWidth="xs">
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography component="h1" variant="h5">
              Sign Up
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <CustomTextField
                margin="normal"
                fullWidth
                label="Name"
                autoFocus
                {...register("name",{required:"Required Field"})}
                error = {!!errors?.name}
                helperText={errors?.name ? errors.name.message:null}
              />
              <CustomTextField
                margin="normal"
                fullWidth
                label="Email"
                autoComplete="email"
                {...register("email",{required:"Required Field"})}
                error = {!!errors?.email}
                helperText={errors?.email ? errors.email.message:null}
              />
              <CustomTextField
                margin="normal"
                fullWidth
                label="Password"
                type="password"
                autoComplete="current-password"
                {...register("password",{required:"Required Field"})}
                error = {!!errors?.password}
                helperText={errors?.password ? errors.password.message:null}
              />
              <SignUpButton
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 ,py:2}}
              >
                Sign Up
              </SignUpButton>
            </form>
          </Box>
      </Container>
  );
}