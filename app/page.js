"use server";
import LandingPage from "./components/LandingPage";
import fecthUser from "./fetchUsers";

export default async function Home() {
  const resp = await fecthUser();
  console.log(resp);
  return (
    <>
      <LandingPage />
    </>
  );
}
