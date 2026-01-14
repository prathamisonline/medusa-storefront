import { atom, selector, useRecoilState, useRecoilValue } from "recoil";
import { HttpTypes } from "@medusajs/types";
import { sdk } from "../lib/sdk";

// Atoms
export const regionsAtom = atom<HttpTypes.StoreRegion[]>({
    key: "regions",
    default: [],
});

export const selectedRegionIdAtom = atom<string | null>({
    key: "selectedRegionId",
    default: localStorage.getItem("region_id"),
});

export const regionLoadingAtom = atom<boolean>({
    key: "regionLoading",
    default: true,
});

// Selector to get the selected region object
export const selectedRegionSelector = selector<HttpTypes.StoreRegion | undefined>({
    key: "selectedRegion",
    get: ({ get }) => {
        const regions = get(regionsAtom);
        const selectedId = get(selectedRegionIdAtom);
        return regions.find((r) => r.id === selectedId);
    },
});

// Custom hook to initialize and manage regions
export const useRegionState = () => {
    const [regions, setRegions] = useRecoilState(regionsAtom);
    const [, setSelectedRegionId] = useRecoilState(selectedRegionIdAtom);
    const [isLoading, setIsLoading] = useRecoilState(regionLoadingAtom);
    const region = useRecoilValue(selectedRegionSelector);

    const fetchRegions = async () => {
        try {
            const { regions: fetchedRegions } = await sdk.store.region.list();
            setRegions(fetchedRegions);

            const savedRegionId = localStorage.getItem("region_id");
            const savedRegion = fetchedRegions.find((r) => r.id === savedRegionId);

            if (savedRegion) {
                setSelectedRegionId(savedRegion.id);
            } else if (fetchedRegions.length > 0) {
                setSelectedRegionId(fetchedRegions[0].id);
                localStorage.setItem("region_id", fetchedRegions[0].id);
            }
        } catch (error) {
            console.error("Failed to fetch regions:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const setRegion = (newRegion: HttpTypes.StoreRegion) => {
        setSelectedRegionId(newRegion.id);
        localStorage.setItem("region_id", newRegion.id);
    };

    return {
        region,
        regions,
        isLoading,
        setRegion,
        fetchRegions,
    };
};

// Simple hook to just read region (for components that don't need to manage it)
export const useRegion = () => {
    const region = useRecoilValue(selectedRegionSelector);
    const regions = useRecoilValue(regionsAtom);
    const isLoading = useRecoilValue(regionLoadingAtom);

    return { region, regions, isLoading };
};
