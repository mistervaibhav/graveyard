import { Avatar, Group, Text, rem } from '@mantine/core';
import { IoChevronForwardSharp } from 'react-icons/io5';
import { StaffSelectButtonWrapper } from './styles';
import { StoreStaff } from '@prisma/client';
import { getNameInitials } from '../../../../components/Header';

interface IStaffSelectButtonProps {
  staffMember: StoreStaff;
  onClick: (staffMemberId: string) => void;
  isSelected: boolean;
}

function StaffSelectButton({
  staffMember,
  onClick,
  isSelected,
}: IStaffSelectButtonProps) {
  return (
    <StaffSelectButtonWrapper
      onClick={() => onClick(staffMember.id)}
      $isSelected={isSelected}
    >
      <Group>
        <Avatar size="md" radius="xl">
          {getNameInitials(staffMember.name ?? '')}
        </Avatar>

        <div style={{ flex: 1 }}>
          <Text size="sm" fw={500}>
            {staffMember.name}
          </Text>

          <Text c="dimmed" size="xs">
            {staffMember.email}
          </Text>
        </div>

        <IoChevronForwardSharp
          style={{ width: rem(14), height: rem(14) }}
          strokeWidth={1.5}
        />
      </Group>
    </StaffSelectButtonWrapper>
  );
}

export default StaffSelectButton;
