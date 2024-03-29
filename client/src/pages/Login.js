// @mui
import { styled } from '@mui/material/styles';
import { Card, Container, Typography } from '@mui/material';

import LoginMetamask from '../components/LoginMetamask';
// hooks
import useResponsive from '../hooks/useResponsive';
// components
import Page from '../components/Page';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
  zIndex: 10,
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 350,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  // margin: theme.spacing(2, 0, 2, 2),
  marginLeft: '70px',
  // paddingLeft: 100,
  height: '50%',
}));

const ContentStyle = styled('div')(({ theme }) => ({
  // margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  marginTop: '30px',
  // paddingLeft: '12px',
  // padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function Login() {
  const mdUp = useResponsive('up', 'md');

  return (
    <Page title="Login">
      <RootStyle>
        {mdUp && (
          <SectionStyle className="login-page">
            <img src="/static/images/login.jpg" alt="login" className="w-3/3 self-center" />
          </SectionStyle>
        )}

        <Container maxWidth="md">
          <ContentStyle>
            <img
              src="/static/illustrations/logistica_16.svg"
              alt="login"
              className="absolute w-2/3 self-center opacity-10"
            />
            <LoginMetamask />
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
