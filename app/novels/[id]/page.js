"use client";
import NovelDetail from "./components/NovelDetail";
import NovelChapters from "./components/NovelChapters";
import React from "react";

export default function NovelPage({ params }) {
  const { id } = React.use(params);
  return (
    <div className="space-y-6">
      <NovelDetail id={id} />
      <NovelChapters />
    </div>
  );
}
