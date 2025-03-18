import { useQuery } from "../../../lib/api/client";

export const useGetGachaList = () => {
	return useQuery("/gachas", {}, { suspense: true });
};
