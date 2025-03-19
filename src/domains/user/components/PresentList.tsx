import { Container } from "@/components/ui/container";
import type { FC } from "react";
import { useGetPresent, usePresentUsecase } from "../usecase/present";

export const PresentList: FC = () => {
  const { data } = useGetPresent();
  const { takePresent } = usePresentUsecase();

  return (
    <div className="w-fit flex h-screen items-center justify-center mx-auto">
      <Container className=" px-10 py-10 max-h-fit">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.map((present) => (
            <div
              key={present.id}
              className="bg-white rounded-xl shadow-md overflow-hidden transform hover:scale-105 transition duration-300"
            >
              <img
                className="w-full h-48 object-cover"
                src={present.item.imageUrl}
                alt={present.item.name}
              />
              <div className="p-4">
                <h4 className="text-lg font-bold text-gray-800">
                  {present.message}
                </h4>
                <p className="text-gray-600">{present.item.name}</p>
                <p className="mt-2 text-gray-700 font-medium">
                  Quantity: {present.itemCount}
                </p>
                <button
                  onClick={() => takePresent(present.id)}
                  className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                >
                  もらう
                </button>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
};
