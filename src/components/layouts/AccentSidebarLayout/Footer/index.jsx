import { Box, Card, Link, Typography, styled } from '@mui/material';

const FooterWrapper = styled(Card)(
  ({ theme }) => `
        border-radius: 0;
        margin-top: ${theme.spacing(4)};
  `
);

const Footer = () => {
  return (
    <FooterWrapper className="footer-wrapper">
      <></>
    </FooterWrapper>
  );
}

export default Footer;
