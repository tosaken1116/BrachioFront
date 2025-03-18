import { useQuery } from "../../../lib/api/client";
import type { MasterCardType } from "../types";

export const useGetCardList = () => {
	const { data } = useQuery("/cards");
	return { data } as {
		data: {
			masterCard: MasterCardType;
			count: number;
		}[];
	};
};
