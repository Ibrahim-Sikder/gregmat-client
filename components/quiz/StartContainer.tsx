"use client";
import React from "react";
import { useGetQuizQuery } from "@/redux/features/quiz/quiz.api";
import Start from "./Start";
import Loader from "../shared/Loader";
import { useCurrentUser } from "@/hooks/useCurrentUser";

interface Props {
  slug: string;
  user: any;
  id: string | null;
}
export default function StartContainer({ slug, user, id }: Props) {
  const { data, isLoading } = useGetQuizQuery(slug);
  const { loading, isSubscribed } = useCurrentUser();
  if (isLoading || loading) return <Loader />;
  return (
    <>
      <Start
        data={data?.data}
        user={user}
        search={id}
        isSubscribed={isSubscribed}
      />
    </>
  );
}
