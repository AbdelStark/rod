
import { useInfiniteQuery } from '@tanstack/react-query';
import NDK, { NDKEvent, NDKKind } from '@nostr-dev-kit/ndk';
import { useNostrContext } from '../app/context';

export type UseCashuMintList = {
  authors?: string[];
  search?: string;
};

export const getMintEvent = async (ndk: NDK) => {
  const mintList = await ndk.fetchEvents({
    kinds: [NDKKind.CashuMintList],
    limit: 100,
  });
  return mintList
}

/** Cashu Mint List recommender
 */
export const useCashuMintList = (options?: UseCashuMintList) => {
  const { ndk } = useNostrContext()

  return useInfiniteQuery({
    initialPageParam: 0,
    queryKey: ['cashuMintList', options?.authors, options?.search, ndk],
    getNextPageParam: (lastPage: any, allPages, lastPageParam) => {
      if (!lastPage?.length) return undefined;

      const pageParam = lastPage[lastPage.length - 1].created_at - 1;

      if (!pageParam || pageParam === lastPageParam) return undefined;
      return pageParam;
    },
    queryFn: async ({ pageParam }) => {
      const mintList = await ndk.fetchEvents({
        kinds: [NDKKind.CashuMintList],
        authors: options?.authors,
        search: options?.search,
        limit: 100,
      });

      return mintList;
    },
    placeholderData: { pages: [], pageParams: [] },
  });
}


export const countMappingMint = (mintList: NDKEvent[] | any[]) => {
  const mintsUrlsMap: Map<string, number> = new Map()
  const mintsUrls: string[] = []
  mintList.forEach((e) => {
    e?.tags?.filter((tag: string[]) => {
      if (tag[0] === 'mint') {
        const isExist = mintsUrlsMap.has(tag[1])
        if (isExist) {
          const counter = mintsUrlsMap.get(tag[1]) ?? 0
          mintsUrlsMap.set(tag[1], counter + 1)
        } else {
          mintsUrlsMap.set(tag[1],1)
        }
        mintsUrls.push(tag[1])

      }
    });
  })
  const mintsUrlsSet = new Set(mintsUrls)

  return {
    urls: mintsUrls,
    urlsSet: mintsUrlsSet,
    mintEvents: mintList,
    mintsUrlsMap
  };
}