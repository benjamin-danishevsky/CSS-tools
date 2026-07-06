import TrackList from "./TrackList";
import GapControls from "./GapControls";
import AlignmentControls from "./AlignmentControls";
import ItemList from "./ItemList";

export default function Sidebar() {
  return (
    <aside
      className="flex w-[280px] shrink-0 flex-col gap-5 overflow-y-auto p-4"
      style={{
        borderRight: "1px solid var(--color-border)",
        backgroundColor: "var(--color-bg-secondary)",
      }}
    >
      <TrackList type="columns" />
      <TrackList type="rows" />
      <GapControls />
      <AlignmentControls />
      <ItemList />
    </aside>
  );
}
