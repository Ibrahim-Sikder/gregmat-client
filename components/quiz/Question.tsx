"use client";
import {
  saveAnswer,
  setSelectedAttemptGroup,
  submitQuiz,
} from "@/redux/features/quiz/quizDataSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useCallback, useEffect, useMemo, useState } from "react";
import Blank from "./question-types/Blank";
import Matching from "./question-types/Matching";
import MultipleChoice from "./question-types/MultipleChoice";
import MultipleSelect from "./question-types/MultipleSelect";
import NumericEntryFraction from "./question-types/NumericEntryFraction";
import NumericEntryNotFraction from "./question-types/NumericEntryNotFraction";
import Pairing from "./question-types/Pairing";
import QuantitativeComparison from "./question-types/QuantitativeComparison";
import ReadingLayout from "./question-types/ReadingLayout";
import TextCompletion from "./question-types/TextCompletion";
import { setSubmissionModal } from "@/redux/features/quiz/quizControlSlice";

interface Props {
  question?: any;
  questionType?: string;
}

export default function Question({ question, questionType }: Props) {
  const dispatch = useAppDispatch();
  const { userId, answers } = useAppSelector((state) => state.quizData);
  const { isCorrectAnswer, submissionModal, timeLeft } = useAppSelector(
    (state) => state.quizControl,
  );
  const [selectedMap, setSelectedMap] = useState<Record<string, string[]>>({});
  const [numericMap, setNumericMap] = useState<Record<string, any>>({});
  const [pairingMap, setPairingMap] = useState<Record<string, string>>({});

  // User's previous answer
  const userAnswer = useMemo(
    () =>
      answers.find(
        (a: any) => a.question === question._id && a.user === userId,
      ),
    [answers, question?._id, userId],
  );

  const displayAnswer = isCorrectAnswer
    ? question.answer || ""
    : userAnswer?.given_answer || "";

  // Initialize state on question load
  useEffect(() => {
    if (!question?._id) return;

    const givenAnswer = displayAnswer;

    const initSelected = (answers?: string[]) =>
      setSelectedMap((prev) => ({
        ...prev,
        [question._id]: answers || [],
      }));

    switch (questionType) {
      case "multiple_select":
      case "sentence_equivalence":
      case "reading_select_all":
        initSelected(givenAnswer ? givenAnswer.split(",").filter(Boolean) : []);
        break;

      case "tc_1_blank":
      case "tc_2_blank":
      case "tc_3_blank":
        if (givenAnswer) {
          initSelected(givenAnswer.split(",").filter(Boolean));
        } else {
          const blankCount = Number(questionType.split("_")[1]);
          initSelected(Array(blankCount).fill(""));
        }
        break;

      case "numeric_entry_not_fraction":
        setNumericMap((prev) => ({
          ...prev,
          [question._id]: { value: givenAnswer || "" },
        }));
        break;

      case "numeric_entry_fraction":
        if (givenAnswer) {
          const [numerator = "", denominator = ""] = givenAnswer.split(",");
          setNumericMap((prev) => ({
            ...prev,
            [question._id]: { numerator, denominator, value: givenAnswer },
          }));
        } else {
          setNumericMap((prev) => ({
            ...prev,
            [question._id]: { numerator: "", denominator: "", value: "" },
          }));
        }
        break;

      case "pairing":
      case "matching":
        setPairingMap((prev) => ({
          ...prev,
          [question._id]: givenAnswer || "",
        }));
        break;

      default:
        initSelected(givenAnswer ? [givenAnswer] : []);
        break;
    }
  }, [question?._id, questionType, displayAnswer]);

  const selected = selectedMap[question._id] || [];
  const numericValue = numericMap[question._id] || {
    numerator: "",
    denominator: "",
    value: "",
  };
  const pairingValue = pairingMap[question._id] || "";

  const getChoiceId = useCallback(
    (choice: any) => choice.title || choice.order?.toString() || "",
    [],
  );

  // Scoring logic
  const calculateScore = useCallback(
    (givenAnswer: string) => {
      const correctAnswer = question.answer || "";
      let isCorrect = false;

      switch (questionType) {
        case "multiple_select":
        case "sentence_equivalence":
        case "reading_select_all":
          const givenArr = (givenAnswer ?? "")
            .split(",")
            .filter(Boolean)
            .sort();
          const correctArr = (correctAnswer ?? "")
            .split(",")
            .filter(Boolean)
            .sort();
          isCorrect = JSON.stringify(givenArr) === JSON.stringify(correctArr);
          break;

        case "tc_1_blank":
        case "tc_2_blank":
        case "tc_3_blank":
          const givenBlanks = (givenAnswer || "").split("&&&").filter(Boolean);
          const correctBlanks = (correctAnswer || "")
            .split("&&&")
            .filter(Boolean);
          isCorrect =
            JSON.stringify(givenBlanks) === JSON.stringify(correctBlanks);
          break;

        case "numeric_entry_not_fraction":
          isCorrect = parseFloat(givenAnswer) === parseFloat(correctAnswer);
          break;

        case "numeric_entry_fraction":
          isCorrect = givenAnswer === correctAnswer;
          break;

        case "pairing": {
          const normalize = (s: string) => s.trim().toLowerCase();

          const toCanonicalPair = (pair: string) =>
            pair.split("&&&").map(normalize).sort().join("&&&");

          const givenPairs = (givenAnswer || "")
            .split("___")
            .filter(Boolean)
            .map(toCanonicalPair);

          const correctPairs = new Set(
            (correctAnswer || "")
              .split("___")
              .filter(Boolean)
              .map(toCanonicalPair),
          );

          let correctCount = 0;

          givenPairs.forEach((pair) => {
            if (correctPairs.has(pair)) {
              correctCount += 1;
            }
          });

          isCorrect = correctCount === correctPairs.size;
          break;
        }

        case "matching":
          const givenPairs = (givenAnswer || "")
            .split("___")
            .filter(Boolean)
            .sort();
          const correctPairs = (correctAnswer || "")
            .split("___")
            .filter(Boolean)
            .sort();
          isCorrect =
            JSON.stringify(givenPairs) === JSON.stringify(correctPairs);
          break;
        case "fill_in_the_blank": {
          const given = (givenAnswer || "").split("&&&");
          const correct = (correctAnswer || "").split("&&&");

          isCorrect =
            given.length === correct.length &&
            given.every((v, i) => v === correct[i]);

          break;
        }
        default:
          isCorrect = givenAnswer === correctAnswer;
      }

      return { isCorrect, score: isCorrect ? question.max_score || 1 : 0 };
    },
    [question.answer, question.max_score, questionType],
  );

  const saveAnswerHandler = useCallback(
    (givenAnswer: string) => {
      const { isCorrect, score } = calculateScore(givenAnswer);
      dispatch(
        saveAnswer({
          user: userId,
          question: question._id,
          quiz: question.quiz,
          collection: question.collection,
          given_answer: givenAnswer,
          correct: isCorrect,
          score,
          score_denom: question.max_score,
          seconds: 0,
        }),
      );
    },
    [calculateScore, dispatch, question, userId],
  );

  // Event handlers
  const handleSelect = useCallback(
    (choiceId: string, groupIndex: number = 0) => {
      if (isCorrectAnswer || !question?._id) return;

      let updated: string[] = [];
      switch (questionType) {
        case "multiple_select":
        case "sentence_equivalence":
        case "reading_select_all":
          updated = selected.includes(choiceId)
            ? selected.filter((id) => id !== choiceId)
            : [...selected, choiceId];
          break;

        case "tc_1_blank":
        case "tc_2_blank":
        case "tc_3_blank":
          updated = [...selected];
          updated[groupIndex] = choiceId;
          break;

        default:
          updated = [choiceId];
      }

      setSelectedMap((prev) => ({ ...prev, [question._id]: updated }));
      saveAnswerHandler(updated.join(","));
    },
    [selected, isCorrectAnswer, question, questionType, saveAnswerHandler],
  );

  const handleNumericNotFraction = useCallback(
    (value: string) => {
      if (isCorrectAnswer || !question?._id) return;
      setNumericMap((prev) => ({
        ...prev,
        [question._id]: { ...prev[question._id], value },
      }));
      saveAnswerHandler(value);
    },
    [isCorrectAnswer, question, saveAnswerHandler],
  );

  const handleNumericFraction = useCallback(
    (key: "numerator" | "denominator", value: string) => {
      if (isCorrectAnswer || !question?._id) return;
      const current = numericMap[question._id] || {
        numerator: "",
        denominator: "",
        value: "",
      };
      const updated = { ...current, [key]: value };
      setNumericMap((prev) => ({ ...prev, [question._id]: updated }));
      if (updated.numerator && updated.denominator) {
        saveAnswerHandler(`${updated.numerator},${updated.denominator}`);
      }
    },
    [numericMap, isCorrectAnswer, question, saveAnswerHandler],
  );

  const handlePairingChange = useCallback(
    (answer: string) => {
      if (isCorrectAnswer || !question?._id) return;
      setPairingMap((prev) => ({ ...prev, [question._id]: answer }));
      saveAnswerHandler(answer);
    },
    [isCorrectAnswer, question, saveAnswerHandler],
  );

  const handleBlankChange = useCallback(
    (answers: string[]) => {
      if (isCorrectAnswer || !question?._id) return;

      setSelectedMap((prev) => ({
        ...prev,
        [question._id]: answers,
      }));

      saveAnswerHandler(answers.join("&&&"));
    },
    [isCorrectAnswer, question, saveAnswerHandler],
  );

  const isSelected = useCallback(
    (choiceId: string, groupIndex: number = 0) => {
      if (
        [
          "sentence_equivalence",
          "multiple_select",
          "reading_select_all",
        ].includes(questionType || "")
      ) {
        return selected.includes(choiceId);
      } else if (questionType?.startsWith("tc_")) {
        return selected[groupIndex] === choiceId;
      } else {
        return selected[0] === choiceId;
      }
    },
    [selected, questionType],
  );

  // Render question
  const renderQuestionType = () => {
    const hasLeftText = question.left_side_text?.body;

    if (
      hasLeftText &&
      ["reading_multiple_choice", "reading_select_all"].includes(
        questionType || "",
      )
    ) {
      return (
        <ReadingLayout
          question={question}
          questionType={questionType!}
          isSelected={isSelected}
          handleSelect={handleSelect}
          getChoiceId={getChoiceId}
          isCorrectAnswer={isCorrectAnswer}
        />
      );
    }

    switch (questionType) {
      case "multiple_choice":
        return (
          <MultipleChoice
            question={question}
            isSelected={isSelected}
            handleSelect={handleSelect}
            getChoiceId={getChoiceId}
            isCorrectAnswer={isCorrectAnswer}
          />
        );

      case "multiple_select":
      case "sentence_equivalence":
      case "reading_select_all":
        return (
          <MultipleSelect
            question={question}
            isSelected={isSelected}
            handleSelect={handleSelect}
            getChoiceId={getChoiceId}
            isCorrectAnswer={isCorrectAnswer}
            questionType={questionType}
          />
        );

      case "quantitative_comparison":
        return (
          <QuantitativeComparison
            question={question}
            isSelected={isSelected}
            handleSelect={handleSelect}
          />
        );

      case "tc_1_blank":
      case "tc_2_blank":
      case "tc_3_blank":
        return (
          <TextCompletion
            question={question}
            isSelected={isSelected}
            handleSelect={handleSelect}
            getChoiceId={getChoiceId}
            isCorrectAnswer={isCorrectAnswer}
            questionType={questionType}
          />
        );

      case "numeric_entry_not_fraction":
        return (
          <NumericEntryNotFraction
            question={question}
            numericValue={numericValue}
            handleNumericNotFraction={handleNumericNotFraction}
            isCorrectAnswer={isCorrectAnswer}
          />
        );

      case "numeric_entry_fraction":
        return (
          <NumericEntryFraction
            question={question}
            numericValue={numericValue}
            handleNumericFraction={handleNumericFraction}
            isCorrectAnswer={isCorrectAnswer}
          />
        );

      case "pairing":
        return (
          <Pairing
            question={question}
            value={pairingValue}
            disabled={isCorrectAnswer}
            onChange={handlePairingChange}
            isCorrectAnswer={isCorrectAnswer}
          />
        );

      case "matching":
        return (
          <Matching
            question={question}
            value={pairingValue}
            disabled={isCorrectAnswer}
            onChange={handlePairingChange}
            isCorrectAnswer={isCorrectAnswer}
          />
        );

      case "fill_in_the_blank":
        return (
          <Blank
            question={question}
            value={selected.join("&&&")}
            disabled={isCorrectAnswer}
            onChange={handleBlankChange}
          />
        );

      default:
        return (
          <div className="text-center py-10">
            Unsupported question type: {questionType}
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col items-center px-4">
      {renderQuestionType()}
    </div>
  );
}
