import { useSelector } from 'react-redux';
import { Container, Typography } from '@mui/material';
import { walletAddressSelector, userDataSelector } from '../redux/appDataSlice';
// components
import Page from '../components/Page';
import FarmForm from '../components/AddFarmDetails/FarmForm';
import GetFarmForm from '../components/GetFarmDetails/GetFarmForm';
import UserAdminForm from '../components/AddUserAdmin/UserAdminForm';

// ----------------------------------------------------------------------

export default function DashboardAdmin() {
  const walletAddress = useSelector(walletAddressSelector);
  const userInfo = useSelector(userDataSelector);

  return (
    <Page title="Dashboard">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Bienvenido: {userInfo.name}
        </Typography>
        <FarmForm />
        <br />
        <GetFarmForm />
        <br />
        <UserAdminForm />
      </Container>
    </Page>
  );
}
