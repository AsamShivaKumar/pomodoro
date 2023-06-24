import '../styles/globals.css';
import NavBar from '../components/NavBar';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import {Grommet} from 'grommet';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { useState } from 'react';
import { useRouter } from 'next/router';

const theme = {
  global: {
    colors: {
      active: "#F86F03",
      inactive: "grey"
    },
    backgrounds: {
      'bgImg': 'url(/bg.png)'
    },
    font: {
      family: "Poppins",
      size: "18px",
      height: "20px",
    },
  },
};

const client = new ApolloClient({
  uri: '/api/graphql',
  cache: new InMemoryCache(),
});

export default function MyApp({ Component, pageProps }) {

  const router = useRouter();
  const path = router.pathname;

  return (
    <UserProvider>
      <ApolloProvider client={client}> 
        <Grommet theme = {theme} background="url(bg.png)" full>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Poppins:300,400,500" />
          <link href="https://fonts.googleapis.com/css2?family=Ubuntu&display=swap" rel="stylesheet" />
          <Component {...pageProps} />
          <NavBar active={path} />
        </Grommet>
      </ApolloProvider>
    </UserProvider>
  )
}