import '../styles/globals.css';
import NavBar from '../components/NavBar';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import {Grommet} from 'grommet';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import suprsend from "@suprsend/web-sdk";

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

  useEffect(() => {

    console.log(process.env);

    console.log(process.env.NEXT_PUBLIC_VAPID_KEY,process.env.NEXT_PUBLIC_WORKSPACE_KEY, process.env.NEXT_PUBLIC_WORKSPACE_SECRET,"key");

    suprsend.init(process.env.NEXT_PUBLIC_WORKSPACE_KEY, process.env.NEXT_PUBLIC_WORKSPACE_SECRET, {vapid_key: process.env.NEXT_PUBLIC_VAPID_KEY})
    suprsend.web_push.register_push();
    suprsend.web_push.notification_permission();
  },[]);

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