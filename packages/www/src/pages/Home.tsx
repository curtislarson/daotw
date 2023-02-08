import CheckinMap from "../components/CheckinMap";
import CheckinFeed from "../components/CheckinFeed";
import { useCallback, useMemo, useState } from "react";
import { FeedEventHandler, PopupEventHandler } from "../types";
import Stats from "../components/Stats";
import { useCheckinState } from "../checkin-state";
import FeedFilters, { FilterData } from "../components/FeedFilters";
import { getTripData } from "../trip";
import { LatLng } from "leaflet";

export default function Home() {
  const [filterData, setFilterData] = useState<Partial<FilterData>>({});
  const [forceView, setForceView] = useState<LatLng | null>(null);
  const onSetFilterData = useCallback(
    (newFilterData: Partial<FilterData>) => {
      if (newFilterData.trip != null && newFilterData.trip.trip_id !== filterData.trip?.trip_id) {
        setForceView(new LatLng(newFilterData.trip.latitude, newFilterData.trip.longitude));
      } else {
        setForceView(null);
      }
      setFilterData(newFilterData);
    },
    [filterData.trip, setFilterData, setForceView]
  );
  const { checkins, stats } = useCheckinState(filterData);

  const trips = useMemo(() => getTripData(), []);

  const [activeCheckinId, setActiveCheckinId] = useState<number | null>(null);

  const onFeedItemClicked = useCallback<FeedEventHandler>(
    (checkin) => {
      setActiveCheckinId(checkin.checkin_id);
    },
    [setActiveCheckinId]
  );

  const onPopupOpen = useCallback<PopupEventHandler>(
    (checkin) => {
      setActiveCheckinId(checkin.checkin_id);
    },
    [setActiveCheckinId]
  );

  const onPopupClose = useCallback<PopupEventHandler>(() => {
    setActiveCheckinId(null);
  }, [setActiveCheckinId]);

  return (
    <main className="relative w-full px-12">
      <div className="flex flex-col mx-auto py-6">
        <div className="flex flex-row pb-2 border-b-2">
          <h1 className="text-4xl text-primary font-semibold leading-6">Drinkin' All Over the World</h1>
          <h3 className="text-lg text-accent pt-2 ml-5">Beers and travels of a nomad</h3>
        </div>
        <div className="flex flex-row">
          <div className="basis-9/12 mt-5">
            <Stats
              stats={[
                { name: "Total Checkins", stat: stats.get("Total Checkins") },
                { name: "Unique Beers", stat: stats.getUniq("Unique Beers") },
                { name: "Unique Locations", stat: stats.getUniq("Unique Locations") },
                { name: "Unique Breweries", stat: stats.getUniq("Unique Breweries") },
                { name: "Favorite Style", stat: stats.getFave("Favorite Style") },
                { name: "Favorite Venue", stat: stats.getFave("Favorite Venue") },
              ]}
            />
          </div>
          <div className="basis-3/12 ml-2 mt-5 self-end">
            <FeedFilters trips={trips} onFilterUpdated={onSetFilterData} />
          </div>
        </div>
      </div>
      <div className="flex flex-row mx-auto shadow-xl">
        <div className="basis-9/12 shadow-xl sm:overflow-hidden">
          <div className="inset-0">
            <CheckinMap
              center={[checkins?.[0]?.venue_lat, checkins?.[0]?.venue_lng]}
              zoom={10}
              checkins={checkins}
              activeCheckinId={activeCheckinId}
              onPopupClose={onPopupClose}
              onPopupOpen={onPopupOpen}
              forceView={forceView}
            />
          </div>
        </div>
        <div className="basis-3/12 shadow-xl overflow-y-scroll ml-2">
          <CheckinFeed checkins={checkins} activeCheckinId={activeCheckinId} onFeedItemClicked={onFeedItemClicked} />
        </div>
      </div>
    </main>
  );
}
