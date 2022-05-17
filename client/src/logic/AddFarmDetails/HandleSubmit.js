import { v4 as uuid } from 'uuid';
import { getCoffeWriterERC20 } from '../erc20';

const HandleSubmit = async (values) => {
  const uniqueID = uuid();
  const erc20 = await getCoffeWriterERC20();
  await erc20.addFarmDetails(
    // values.registrationNo,
    uniqueID,
    values.farmName,
    values.latitude,
    values.longitude,
    values.farmAddress
  );
};

export default HandleSubmit;
