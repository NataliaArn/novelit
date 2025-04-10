"use client";
import NovelDetail from "./components/NovelDetail";
import NovelChapters from "./components/NovelChapters";
import React from "react";
import { use } from "react";

export default function NovelPage({ params }) {
  const { id } = use(params);
  return (
    <div className="space-y-6">
      <NovelDetail id={id} />
      <NovelChapters />
    </div>
  );
}
