import { useUser } from "@clerk/nextjs";
export const getUser = () => {
  const { user } = useUser();
  return user;
};
