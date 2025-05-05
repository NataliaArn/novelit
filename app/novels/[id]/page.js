"use client";
import { useState, useEffect } from "react";
import NovelDetail from "./components/NovelDetail";
import NovelChapters from "./components/NovelChapters";
import React from "react";
import { use } from "react";

export default function NovelPage({ params }) {
  const { id } = use(params);
  const [novel, setNovel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function fetchNovelDetails() {
      setLoading(true);
      const res = await fetch(`/api/novels/${id}`);
      const data = await res.json();

      if (res.ok) {
        setNovel(data);
      } else {
        alert(data.error || "Error fetching novel details");
      }
      setLoading(false);
    }

    fetchNovelDetails();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!novel) {
    return <p>Novel not found.</p>;
  }
  return (
    <div className="space-y-6">
      <NovelDetail novel={novel} />
      <NovelChapters novel={novel} />
    </div>
  );
}
