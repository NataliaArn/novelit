"use client";
import { useRouter, useParams } from "next/navigation";

export default function EditChapterButton() {
  const router = useRouter();
  const { id: novelId, chapterId } = useParams();

  const handleEdit = () => {
    router.push(`/novels/${novelId}/chapters/${chapterId}/edit`);
  };

  return (
    <button
      onClick={handleEdit}
      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
    >
      Editar Capítulo
    </button>
  );
}
