import React from 'react';
import Navbar from '../components/Navbar';
import { Container } from '@mui/material';
import Head from 'next/head';

interface Props {
  title?: string;
}

const MainLayout: React.FC<Props> = ({children, title}) => {
  return (
    <>
      <Head>
        <title>{title || 'Exel to Case.One'}</title>
      </Head>
      <Navbar/>
      <Container className="mainContainer">
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
        {children}
      </Container>
    </>
  );
};

export default MainLayout;
