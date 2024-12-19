import {useUser} from "@clerk/nextjs";

export const getUser = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { user } = useUser();
  return user;
};
