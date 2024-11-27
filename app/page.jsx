"use client";
import Header from "@/app/components/Header";
import RecentNovels from "@/app/components/RecentNovels";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-6 bg-gray-100">
        <h1 className="text-2xl font-bold text-center mb-6">
          Novelas Recientes
        </h1>
        <RecentNovels />
      </main>
    </div>
  );
}
