"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BasicCalculator() {
  const [display, setDisplay] = useState("0");
  const [memory, setMemory] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const calculatorRef = useRef<HTMLDivElement>(null);

  // Memoize all calculator functions with useCallback
  const clearAll = useCallback(() => {
    setDisplay("0");
    setOperation(null);
    setMemory(null);
    setWaitingForOperand(false);
  }, []);

  const clearDisplay = useCallback(() => {
    setDisplay("0");
  }, []);

  const inputDigit = useCallback((digit: string) => {
    setDisplay(prev => {
      if (waitingForOperand) {
        setWaitingForOperand(false);
        return digit;
      } else {
        return prev === "0" ? digit : prev + digit;
      }
    });
  }, [waitingForOperand]);

  const inputDecimal = useCallback(() => {
    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
    } else if (display.indexOf(".") === -1) {
      setDisplay(display + ".");
    }
  }, [display, waitingForOperand]);

  const toggleSign = useCallback(() => {
    const value = parseFloat(display);
    setDisplay(value === 0 ? "0" : String(-value));
  }, [display]);

  const inputPercent = useCallback(() => {
    const value = parseFloat(display);
    setDisplay(String(value / 100));
  }, [display]);

  const performOperation = useCallback((nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (memory === null) {
      setMemory(inputValue);
    } else if (operation) {
      const currentValue = memory || 0;
      let newValue: number;

      switch (operation) {
        case "+":
          newValue = currentValue + inputValue;
          break;
        case "-":
          newValue = currentValue - inputValue;
          break;
        case "×":
          newValue = currentValue * inputValue;
          break;
        case "÷":
          newValue = currentValue / inputValue;
          break;
        default:
          newValue = inputValue;
      }

      setMemory(newValue);
      setDisplay(String(newValue));
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  }, [display, memory, operation]);

  // Use useCallback to memoize the handleKeyDown function
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    let { key } = event;

    // Prevent default behavior for calculator keys
    if (/^[0-9.+\-*\/=]$/.test(key) || key === "Enter" || key === "Escape" || key === "Backspace") {
      event.preventDefault();
    }

    if (key === "Enter") key = "=";
    if (key === "/") key = "÷";
    if (key === "*") key = "×";

    if (/\d/.test(key)) {
      inputDigit(key);
    } else if (key === ".") {
      inputDecimal();
    } else if (key === "+" || key === "-" || key === "×" || key === "÷") {
      performOperation(key);
    } else if (key === "=") {
      performOperation("=");
    } else if (key === "Backspace") {
      if (display !== "0") {
        setDisplay(display.substring(0, display.length - 1) || "0");
      }
    } else if (key === "Escape") {
      clearAll();
    }
  }, [display, performOperation, inputDigit, inputDecimal, clearAll]);

  // Set up global keyboard event listener
  useEffect(() => {
    // Focus the calculator container when it mounts
    if (calculatorRef.current) {
      calculatorRef.current.focus();
    }

    // Add global event listener for keyboard inputs
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]); // Only re-attach when handleKeyDown changes

  const CalculatorButton = ({
    onClick,
    className = "",
    children
  }: {
    onClick: () => void;
    className?: string;
    children: React.ReactNode
  }) => (
    <Button
      onClick={onClick}
      className={`h-14 text-lg font-medium ${className}`}
      variant="outline"
    >
      {children}
    </Button>
  );

  return (
    <Card
      className="calculator-container max-w-md mx-auto"
      ref={calculatorRef}
      tabIndex={0} // Make the container focusable
    >
      <CardHeader className="pb-0">
        <CardTitle className="text-xl font-semibold">Basic Calculator</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div
          className="w-full p-4 mb-4 text-right text-3xl font-medium bg-gray-100 dark:bg-gray-800 rounded-md overflow-x-auto whitespace-nowrap"
        >
          {display}
        </div>
        <div className="grid grid-cols-4 gap-2">
          <CalculatorButton onClick={clearAll} className="bg-red-100 dark:bg-red-900 dark:text-red-100">
            AC
          </CalculatorButton>
          <CalculatorButton onClick={clearDisplay} className="bg-gray-200 dark:bg-gray-700">
            C
          </CalculatorButton>
          <CalculatorButton onClick={inputPercent} className="bg-gray-200 dark:bg-gray-700">
            %
          </CalculatorButton>
          <CalculatorButton onClick={() => performOperation("÷")} className="bg-blue-100 dark:bg-blue-900 dark:text-blue-100">
            ÷
          </CalculatorButton>

          <CalculatorButton onClick={() => inputDigit("7")}>
            7
          </CalculatorButton>
          <CalculatorButton onClick={() => inputDigit("8")}>
            8
          </CalculatorButton>
          <CalculatorButton onClick={() => inputDigit("9")}>
            9
          </CalculatorButton>
          <CalculatorButton onClick={() => performOperation("×")} className="bg-blue-100 dark:bg-blue-900 dark:text-blue-100">
            ×
          </CalculatorButton>

          <CalculatorButton onClick={() => inputDigit("4")}>
            4
          </CalculatorButton>
          <CalculatorButton onClick={() => inputDigit("5")}>
            5
          </CalculatorButton>
          <CalculatorButton onClick={() => inputDigit("6")}>
            6
          </CalculatorButton>
          <CalculatorButton onClick={() => performOperation("-")} className="bg-blue-100 dark:bg-blue-900 dark:text-blue-100">
            -
          </CalculatorButton>

          <CalculatorButton onClick={() => inputDigit("1")}>
            1
          </CalculatorButton>
          <CalculatorButton onClick={() => inputDigit("2")}>
            2
          </CalculatorButton>
          <CalculatorButton onClick={() => inputDigit("3")}>
            3
          </CalculatorButton>
          <CalculatorButton onClick={() => performOperation("+")} className="bg-blue-100 dark:bg-blue-900 dark:text-blue-100">
            +
          </CalculatorButton>

          <CalculatorButton onClick={toggleSign}>
            +/-
          </CalculatorButton>
          <CalculatorButton onClick={() => inputDigit("0")}>
            0
          </CalculatorButton>
          <CalculatorButton onClick={inputDecimal}>
            .
          </CalculatorButton>
          <CalculatorButton onClick={() => performOperation("=")} className="bg-green-100 dark:bg-green-900 dark:text-green-100">
            =
          </CalculatorButton>
        </div>
      </CardContent>
    </Card>
  );
}
