import NovelDetail from "./components/NovelDetail";
import NovelChapters from "./components/NovelChapters";

export default function NovelPage() {
  return (
    <div className="space-y-6">
      <NovelDetail />
      <NovelChapters />
    </div>
  );
}
