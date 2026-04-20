"use client";

import { FileQuestion } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useAppSelector } from "@/redux/hooks";

import QuizNavBar from "../navbar/QuizNavBar";
import QuizTopBar from "../navbar/QuizTopBar";
import BgContainer from "../shared/container/BgContainer";
import Container from "../shared/container/Container";
import StartQuiz from "./StartQuiz";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { UserInfo } from "../auth/UserInfo";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { IUser } from "@/actions/user";

export default function Quiz({
  isSubscribed,
  user,
}: {
  isSubscribed?: boolean;
  user: IUser | null;
}) {
  const { isBegin } = useAppSelector((state) => state.quizControl);
  const { data } = useAppSelector((state) => state.quizData);

  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);

  if (!data) {
    return (
      <BgContainer
        variant="minimal"
        className="min-h-screen flex items-center justify-center px-4"
      >
        <Card className="max-w-md w-full shadow-none mx-auto">
          <CardContent className="flex flex-col items-center gap-6 py-10 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
              <FileQuestion className="h-7 w-7 text-muted-foreground" />
            </div>

            <Alert className="border-none">
              <AlertTitle className="text-lg font-semibold">
                Quiz Not Available
              </AlertTitle>
              <AlertDescription className="text-muted-foreground mt-1">
                This quiz hasn't been released yet or may no longer be
                available.
              </AlertDescription>
            </Alert>

            <Button variant="outline" asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </BgContainer>
    );
  }
  const isPlusLocked = data.plus_only && !isSubscribed;

  const isPrepSwiftLocked =
    data.is_prepswift &&
    isSubscribed &&
    user?.subscription?.type !== "gregmat_prepswift";

  return (
    <>
      <BgContainer variant="minimal" className="min-h-screen">
        {isPlusLocked ? (
          /* PLUS SUBSCRIPTION MESSAGE */
          <div className="min-h-screen flex items-center justify-center px-4">
            <div className="max-w-7xl w-full rounded-lg border border-red-400 bg-red-100 px-6 py-6 text-center">
              <p className="text-sm font-medium text-red-700">
                Sorry, this content is available for subscribers only.{" "}
                <button
                  onClick={() => setIsSubscribeOpen(true)}
                  className="font-semibold underline underline-offset-2 hover:text-red-900"
                >
                  Click here to subscribe.
                </button>
              </p>
            </div>
          </div>
        ) : isPrepSwiftLocked ? (
          /* PREPSWIFT UPGRADE MESSAGE */
          <div className="min-h-screen flex items-center justify-center px-4">
            <div className="max-w-7xl w-full rounded-lg border border-blue-400 bg-blue-100 px-6 py-6 text-center">
              <p className="text-sm font-medium text-blue-700">
                This quiz is part of{" "}
                <span className="font-semibold">PrepSwift</span>.{" "}
                <button
                  onClick={() => setIsSubscribeOpen(true)}
                  className="font-semibold underline underline-offset-2 hover:text-blue-900"
                >
                  Upgrade to PrepSwift
                </button>{" "}
                to access this content.
              </p>
            </div>
          </div>
        ) : (
          /* FULL ACCESS */
          <>
            <QuizTopBar />
            {isBegin && <QuizNavBar />}

            <div className="p-4">
              <Container>
                {!isBegin && (
                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: data.body }}
                  />
                )}
              </Container>

              <StartQuiz />
            </div>
          </>
        )}
      </BgContainer>

      {/* SUBSCRIBE MODAL */}
      <Dialog open={isSubscribeOpen} onOpenChange={setIsSubscribeOpen}>
        <DialogContent className="w-full">
          <div>
            <UserInfo user={user} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
