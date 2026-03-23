import { Grid, Select, Skeleton } from '@mantine/core';
import { useGetStaffByStoreIdQuery } from '../../../../redux/stores/api';
import { useTypedSelector } from '../../../../redux/useTypedSelector';
import { setStaffId } from '../../../../redux/cart';
import useAppDispatch from '../../../../redux/useAppDispatch';
import StaffSelectButton from './StaffSelectButton';

const StepThree = () => {
  const dispatch = useAppDispatch();

  const storeId = useTypedSelector((store) => store.user.store.id);
  const selectedStaffId = useTypedSelector((store) => store.cart.staffId);

  const { data, isFetching } = useGetStaffByStoreIdQuery(storeId);

  return (
    <>
      {/* <Select
        searchable
        label="Select Sales Associate"
        placeholder="Pick one"
        disabled={isFetching}
        value={selectedStaffId}
        data={data?.map((item) => ({ value: item.id, label: item.name }))}
        onChange={}
      /> */}
      <Skeleton visible={isFetching}>
        <Grid gutter="sm">
          {data?.map((member) => (
            <Grid.Col span={4}>
              <StaffSelectButton
                key={member.id}
                staffMember={member}
                onClick={(value) => dispatch(setStaffId(value ?? ''))}
                isSelected={selectedStaffId === member.id}
              />
            </Grid.Col>
          ))}
        </Grid>
      </Skeleton>
    </>
  );
};

export default StepThree;
