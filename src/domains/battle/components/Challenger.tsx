import type { UserType } from "@/domains/user/types";
import { useGetUser } from "@/domains/user/usecase/cache";
import { type FC, Suspense } from "react";

type ViewerProps = {
  user: UserType;
};

const Viewer: FC<ViewerProps> = ({ user }) => {
  return (
    <div className="w-full h-screen relative bg-black z-50 animate-slide-in">
      <img
        src="/challenger.jpeg"
        alt="challenger"
        className="w-full h-screen object-cover"
      />
      <div className="absolute right-1/6 rounded-full top-1/2 -translate-y-1/2 h-1/2 aspect-square overflow-hidden z-[100]">
        <img
          src={user.imageUrl}
          alt={user.name}
          className=" w-full h-full overflow-hidden object-cover "
        />
      </div>
    </div>
  );
};

type Props = {
  id: string;
};
const Internal: FC<Props> = ({ id }) => {
  const { data } = useGetUser(id);
  return (
    <div className="absolute w-full h-screen left-0 top-0">
      <Viewer user={data} />
    </div>
  );
};

export const Challenger: FC<Props> = ({ id }) => {
  return (
    <Suspense>
      <Internal id={id} />
    </Suspense>
  );
};
