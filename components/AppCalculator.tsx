"use client";

import { evaluate } from "mathjs";
import { useState, useEffect, useRef } from "react";
import {
  Maximize2,
  Minimize2,
  Laptop,
  Monitor,
  X,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function AppCalculator() {
  const [display, setDisplay] = useState("0");
  const [equation, setEquation] = useState("");
  const [memory, setMemory] = useState(0);
  const [isNewNumber, setIsNewNumber] = useState(true);
  const [lastOperation, setLastOperation] = useState("");
  const [isFocus, setIsFocus] = useState(false);
  const [isBrowserFullscreen, setIsBrowserFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Handle Focus Mode Body Scroll Lock
  useEffect(() => {
    if (isFocus) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isFocus]);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsBrowserFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      wrapperRef.current?.requestFullscreen().catch((err) => {
        console.error(
          `Error attempting to enable full-screen mode: ${err.message}`,
        );
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;

      // Prevent default behavior for calculator keys
      if (
        /^[0-9]$/.test(key) || // Numbers 0-9
        key === "." ||
        key === "+" ||
        key === "-" ||
        key === "*" ||
        key === "/" ||
        key === "Enter" ||
        key === "=" ||
        key === "Escape" ||
        key === "Backspace" ||
        key === "(" ||
        key === ")"
      ) {
        event.preventDefault();
      }

      // Handle numbers 0-9
      if (/^[0-9]$/.test(key)) {
        handleNumber(key);
      }

      // Handle decimal point
      else if (key === ".") {
        handleNumber(".");
      }

      // Handle operators
      else if (key === "+") {
        handleOperator("+");
      } else if (key === "-") {
        handleOperator("-");
      } else if (key === "*") {
        handleOperator("*");
      } else if (key === "/") {
        handleOperator("/");
      }

      // Handle equals/Enter
      else if (key === "=" || key === "Enter") {
        handleEquals();
      }

      // Handle clear/Escape
      else if (key === "Escape") {
        if (isFocus) {
          setIsFocus(false);
        } else {
          handleClear();
        }
      }

      // Handle backspace (clear entry)
      else if (key === "Backspace") {
        handleClearEntry();
      }
    };

    // Focus the container on mount and add event listener
    if (containerRef.current) {
      containerRef.current.focus();
    }

    window.addEventListener("keydown", handleKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [display, equation, isNewNumber, memory, lastOperation]);

  const handleNumber = (num: string) => {
    if (display === "Error") {
      setDisplay(num);
      setEquation("");
      setIsNewNumber(false);
      return;
    }

    if (isNewNumber) {
      setDisplay(num === "." ? "0." : num);
      setIsNewNumber(false);
    } else {
      if (num === "." && display.includes(".")) return;
      if (display === "0" && num !== ".") {
        setDisplay(num);
      } else {
        setDisplay((prev) => prev + num);
      }
    }
  };

  const handleOperator = (op: string) => {
    if (display === "Error") {
      handleClear();
      return;
    }

    const opSymbol = getOperatorSymbol(op);

    // Update the display to show the operator
    if (!isNewNumber) {
      // If we have a previous equation and user is typing a new operation
      if (equation) {
        try {
          const result = evaluate(equation + display);
          const formattedResult = Number.isInteger(result)
            ? result.toString()
            : parseFloat(result.toFixed(10)).toString();
          setDisplay(formattedResult);
          setEquation(formattedResult + op);
          setIsNewNumber(true);
        } catch {
          setDisplay("Error");
          setEquation("");
          setIsNewNumber(true);
        }
      } else {
        // Starting a new calculation
        setEquation(display + op);
        setIsNewNumber(true);
      }
    } else if (equation) {
      // User is changing the operator
      // Remove the last operator and add the new one
      const newEquation = equation.replace(/[\+\-\*/]$/, "") + op;
      setEquation(newEquation);
    }

    setLastOperation(opSymbol);
  };

  const getOperatorSymbol = (op: string) => {
    switch (op) {
      case "+":
        return "+";
      case "-":
        return "−";
      case "*":
        return "×";
      case "/":
        return "÷";
      default:
        return op;
    }
  };

  const handleEquals = () => {
    if (display === "Error") {
      handleClear();
      return;
    }

    if (!equation) return;

    try {
      const result = evaluate(equation + display);
      const formattedResult = Number.isInteger(result)
        ? result.toString()
        : parseFloat(result.toFixed(10)).toString();
      setDisplay(formattedResult);
      setEquation("");
      setIsNewNumber(true);
      setLastOperation("");
    } catch {
      setDisplay("Error");
      setEquation("");
      setIsNewNumber(true);
      setLastOperation("");
    }
  };

  const handleClear = () => {
    setDisplay("0");
    setEquation("");
    setIsNewNumber(true);
    setLastOperation("");
  };

  const handleClearEntry = () => {
    setDisplay("0");
    setIsNewNumber(true);
  };

  const handlePlusMinus = () => {
    if (display === "0" || display === "Error") return;
    setDisplay((prev) => {
      const num = parseFloat(prev);
      return (num * -1).toString();
    });
  };

  const handleSquareRoot = () => {
    if (display === "Error") {
      handleClear();
      return;
    }

    try {
      const num = parseFloat(display);
      if (num < 0) {
        setDisplay("Error");
        setIsNewNumber(true);
        return;
      }
      const result = Math.sqrt(num);
      const formattedResult = Number.isInteger(result)
        ? result.toString()
        : parseFloat(result.toFixed(10)).toString();
      setDisplay(formattedResult);
      setIsNewNumber(true);
    } catch {
      setDisplay("Error");
      setIsNewNumber(true);
    }
  };

  const handleMemoryRecall = () => {
    setDisplay(memory.toString());
    setIsNewNumber(true);
  };

  const handleMemoryClear = () => {
    setMemory(0);
  };

  const handleMemoryAdd = () => {
    if (display === "Error") return;
    setMemory((prev) => prev + parseFloat(display || "0"));
  };

  // Update display to show the full equation when there's one
  const displayValue =
    equation && lastOperation && !isNewNumber
      ? `${equation.slice(0, -1)} ${getOperatorSymbol(
          equation.slice(-1),
        )} ${display}`
      : display;

  const Button = ({
    children,
    onClick,
    variant = "default",
  }: {
    children: React.ReactNode;
    onClick: () => void;
    variant?: "default" | "operator" | "memory" | "function" | "clear";
  }) => {
    const variants = {
      default: "bg-white hover:bg-gray-100 text-gray-900",
      operator: "bg-teal-600 hover:bg-teal-700 text-white",
      memory: "bg-slate-700 hover:bg-slate-800 text-white",
      function: "bg-teal-700 hover:bg-teal-800 text-white",
      clear: "bg-orange-600 hover:bg-orange-700 text-white",
    };

    return (
      <button
        onClick={onClick}
        className={`h-11 text-base font-semibold rounded transition-all active:scale-95 ${variants[variant]}`}
        type="button"
      >
        {children}
      </button>
    );
  };

  return (
    <div
      ref={wrapperRef}
      className={cn(
        "flex items-center justify-center transition-colors duration-300",
        (isFocus || isBrowserFullscreen) &&
          "fixed inset-0 z-[9998] bg-white backdrop-blur-md",
      )}
    >
      <AnimatePresence>
        {isFocus && !isBrowserFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/80 backdrop-blur-sm"
            onClick={() => setIsFocus(false)}
          />
        )}
      </AnimatePresence>

      <div
        ref={containerRef}
        tabIndex={0} // Make the container focusable
        className={cn(
          "bg-gray-800 rounded-lg shadow-2xl overflow-hidden p-4 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300 relative",
          isFocus || isBrowserFullscreen ? "w-72 z-[9999]" : "w-72 mx-auto",
        )}
      >
        {/* Header Bar */}
        <div className="flex justify-between items-center mb-3 px-1 border-b border-gray-700 pb-2">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
            </div>
            <span className="text-[10px] text-gray-400 font-bold ml-2 uppercase tracking-tighter">
              GRE Calculator
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={toggleFullScreen}
              className="text-gray-500 hover:text-white transition-colors p-1 rounded hover:bg-gray-700"
              title="Browser Fullscreen"
            >
              <Monitor size={14} />
            </button>
            <button
              onClick={() => setIsFocus(!isFocus)}
              className="text-gray-500 hover:text-white transition-colors p-1 rounded hover:bg-gray-700"
              title={isFocus ? "Exit Focus Mode" : "Enter Focus Mode"}
            >
              {isFocus ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          </div>
        </div>

        {/* Display */}
        <div className="bg-gray-900/50 rounded-lg p-3 mb-4 text-right border border-gray-700/50 shadow-inner">
          <div className="text-xs font-mono text-gray-500 h-5 overflow-hidden flex justify-end items-center">
            {equation && !isNewNumber
              ? `${equation.slice(0, -1)} ${getOperatorSymbol(
                  equation.slice(-1),
                )}`
              : ""}
            {memory !== 0 && (
              <span className="ml-2 text-[10px] bg-teal-900/50 text-teal-400 px-1 rounded">
                M
              </span>
            )}
          </div>
          <div className="text-3xl font-light text-white truncate font-mono">
            {displayValue}
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-5 gap-2">
          {/* Row 1 */}
          <Button onClick={handleMemoryRecall} variant="memory">
            MR
          </Button>
          <Button onClick={handleMemoryClear} variant="memory">
            MC
          </Button>
          <Button onClick={handleMemoryAdd} variant="memory">
            M+
          </Button>
          <Button onClick={() => handleNumber("(")} variant="operator">
            (
          </Button>
          <Button onClick={() => handleNumber(")")} variant="operator">
            )
          </Button>

          {/* Row 2 */}
          <Button onClick={() => handleNumber("7")}>7</Button>
          <Button onClick={() => handleNumber("8")}>8</Button>
          <Button onClick={() => handleNumber("9")}>9</Button>
          <Button onClick={() => handleOperator("/")} variant="operator">
            ÷
          </Button>
          <Button onClick={handleClear} variant="clear">
            C
          </Button>

          {/* Row 3 */}
          <Button onClick={() => handleNumber("4")}>4</Button>
          <Button onClick={() => handleNumber("5")}>5</Button>
          <Button onClick={() => handleNumber("6")}>6</Button>
          <Button onClick={() => handleOperator("*")} variant="operator">
            ×
          </Button>
          <Button onClick={handleClearEntry} variant="clear">
            CE
          </Button>

          {/* Row 4 */}
          <Button onClick={() => handleNumber("1")}>1</Button>
          <Button onClick={() => handleNumber("2")}>2</Button>
          <Button onClick={() => handleNumber("3")}>3</Button>
          <Button onClick={() => handleOperator("-")} variant="operator">
            −
          </Button>
          <Button onClick={handleSquareRoot} variant="function">
            √
          </Button>

          {/* Row 5 */}
          <Button onClick={handlePlusMinus} variant="function">
            ±
          </Button>
          <Button onClick={() => handleNumber("0")}>0</Button>
          <Button onClick={() => handleNumber(".")}>.</Button>
          <Button onClick={() => handleOperator("+")} variant="operator">
            +
          </Button>
          <Button onClick={handleEquals} variant="function">
            =
          </Button>
        </div>

        {isFocus && (
          <div className="mt-4 text-center">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest animate-pulse">
              Focused Session Active
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
