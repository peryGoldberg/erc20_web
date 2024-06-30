import Head from "next/head";
import App from "./components/App";
export default function Home() {

  return (
    <>
      <Head>
        <title>Homepage</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
    
         <App/>
      </main>
    </>
  );
}