import { Button } from '@mantine/core';
import * as Styles from './styles';

const Footer = () => {
  return (
    <Styles.Wrapper>
      <Button variant="outline">Previous</Button>
      <Button>Next</Button>
    </Styles.Wrapper>
  );
};

export default Footer;
