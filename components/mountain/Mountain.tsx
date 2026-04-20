"use client";
import { useAppDispatch } from "@/redux/hooks";
import DayNavigation from "./DayNavigation";
import MountainControl from "./MountainControl";
import MountainContent from "./mountain-content";
import MountainInfo from "./mountain-info";
import { setCurrentPage } from "@/redux/features/mountain/mountainControlSlice";
import { useEffect } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { UserInfo } from "../auth/UserInfo";
import { Skeleton } from "../ui/skeleton";

interface Props {
  data: any;
  param: any;
}

export default function Mountain({ data, param }: Props) {
  const dispatch = useAppDispatch();
  const { isSubscribed, user, loading } = useCurrentUser();
  useEffect(() => {
    dispatch(setCurrentPage(data?.pagination?.currentPage));
  }, [data?.pagination?.currentPage]);

  if (loading) {
    return (
      <>
        <Skeleton className="h-8 w-1/4 mb-4 rounded-lg" />
        <Skeleton className="h-6 w-full mb-2 rounded-lg" />
        <Skeleton className="h-6 w-full mb-2 rounded-lg" />
        <Skeleton className="h-6 w-3/4 mb-2 rounded-lg" />
        <Skeleton className="h-48 w-full rounded-lg" />
      </>
    );
  }

  return (
    <>
      {user && !isSubscribed ? (
        <>
          <UserInfo user={user} />
        </>
      ) : (
        <>
          <div className="text-2xl font-bold py-5 text-slate-900 dark:text-slate-100">
            <h1>{data?.title}</h1>
          </div>
          <div className="border p-3 rounded-2xl space-y-6 bg-white/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 dark:bg-slate-900/60">
            <MountainControl params={param} data={data} />
            <div className="px-4 py-4">
              <MountainInfo description={data.description} />
            </div>
            <DayNavigation
              currentPage={data.pagination.currentPage}
              totalPages={data.pagination.totalPages}
              slug={param.slug}
            />
            <MountainContent categories={data.mountain_categories} />
            <DayNavigation
              currentPage={data.pagination.currentPage}
              totalPages={data.pagination.totalPages}
              slug={param.slug}
            />
          </div>
        </>
      )}
    </>
  );
}
