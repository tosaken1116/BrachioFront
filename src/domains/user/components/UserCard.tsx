import { Container } from "@/components/ui/container";
import type { FC } from "react";
import type { UserType } from "../types";

type Props = {
  user: UserType;
};

export const UserCard: FC<Props> = ({ user }) => {
  return (
    <Container className="relative flex items-center gap-8 flex-col justify-center">
      <div className="absolute left-1/2 -translate-x-1/2 top-0 -translate-y-1/2">
        <img src={user.imageUrl} className="object-contain" alt={user.name} />
      </div>
      <div>{user.name}</div>
    </Container>
  );
};
