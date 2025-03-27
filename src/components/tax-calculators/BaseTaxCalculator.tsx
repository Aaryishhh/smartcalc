"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Region, formatCurrency } from "@/lib/tax-utils";

export interface BaseTaxCalculatorProps {
  region: Region;
  title: string;
  description?: string;
}

export interface TaxResult {
  label: string;
  value: number;
  description?: string;
  isTotal?: boolean;
}

export default function BaseTaxCalculator({
  region,
  title,
  description,
  children,
  onCalculate,
  taxResults = []
}: BaseTaxCalculatorProps & {
  children: React.ReactNode;
  onCalculate?: () => void;
  taxResults?: TaxResult[];
}) {
  return (
    <Card className="calculator-container">
      <div className="space-y-5">
        <div>
          <h3 className="text-xl font-semibold mb-1">{title}</h3>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>

        <div className="space-y-5">
          {children}
        </div>

        {onCalculate && (
          <Button onClick={onCalculate} className="w-full shadow hover:shadow-md">
            Calculate
          </Button>
        )}

        {taxResults.length > 0 && (
          <div className="tax-result-card">
            <h4 className="font-medium mb-3 text-primary">Results</h4>
            <div className="space-y-3">
              {taxResults.map((result, index) => (
                <div
                  key={index}
                  className={`flex justify-between items-center ${result.isTotal ? 'font-bold text-primary pt-2 border-t' : ''}`}
                >
                  <div>
                    <span className="text-sm">{result.label}</span>
                    {result.description && (
                      <p className="text-xs text-muted-foreground">{result.description}</p>
                    )}
                  </div>
                  <span className={result.isTotal ? "text-lg" : ""}>{formatCurrency(result.value, region)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

// Reusable input component for tax calculators
export function TaxInput({
  id,
  label,
  value,
  onChange,
  type = "number",
  placeholder,
  helperText,
  min,
  max,
  step = "0.01",
  required = false,
  prefix,
  suffix
}: {
  id: string;
  label: string;
  value: string | number;
  onChange: (value: string | number) => void;
  type?: string;
  placeholder?: string;
  helperText?: string;
  min?: number;
  max?: number;
  step?: string;
  required?: boolean;
  prefix?: string;
  suffix?: string;
}) {
  // Convert value to string for display, handling various input values
  const displayValue = value === 0 ? "0" : value === null || value === undefined ? "" : String(value);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Allow empty string or valid numeric input
    if (inputValue === "") {
      onChange("");
    } else if (type === "number") {
      // For numeric inputs, validate the input format
      const numericRegex = /^-?\d*\.?\d*$/;
      if (numericRegex.test(inputValue)) {
        onChange(inputValue);
      }
    } else {
      onChange(inputValue);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="font-medium">{label}{required && <span className="text-red-500 ml-1">*</span>}</Label>
      <div className="flex">
        {prefix && (
          <div className="flex items-center justify-center bg-muted/50 border border-r-0 border-input rounded-l-md px-2 sm:px-3 text-muted-foreground min-w-8 sm:min-w-10">
            {prefix}
          </div>
        )}
        <Input
          id={id}
          type={type}
          value={displayValue}
          onChange={handleChange}
          placeholder={placeholder}
          className={`${prefix ? 'rounded-l-none' : ''} ${suffix ? 'rounded-r-none' : ''} shadow-sm p-2 h-10 sm:h-11 text-base`}
          min={min}
          max={max}
          step={step}
          required={required}
          inputMode={type === "number" ? "decimal" : undefined}
        />
        {suffix && (
          <div className="flex items-center justify-center bg-muted/50 border border-l-0 border-input rounded-r-md px-2 sm:px-3 text-muted-foreground min-w-8 sm:min-w-10">
            {suffix}
          </div>
        )}
      </div>
      {helperText && <p className="text-xs text-muted-foreground">{helperText}</p>}
    </div>
  );
}

// New SliderInput component that combines a slider with numeric input
export function SliderInput({
  id,
  label,
  value,
  onChange,
  min = 0,
  max = 100000,
  step = 1000,
  required = false,
  prefix,
  suffix,
  helperText,
  showInput = true,
  formatDisplay
}: {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
  prefix?: string;
  suffix?: string;
  helperText?: string;
  showInput?: boolean;
  formatDisplay?: (value: number) => string;
}) {
  const [internalValue, setInternalValue] = useState<number>(value);

  // Update internal value when external value changes
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  // Handle slider change
  const handleSliderChange = (newValue: number[]) => {
    const updatedValue = newValue[0];
    setInternalValue(updatedValue);
    onChange(updatedValue);
  };

  // Handle input change
  const handleInputChange = (inputValue: string | number) => {
    const numValue = Number(inputValue);
    if (!isNaN(numValue)) {
      const boundedValue = Math.min(Math.max(numValue, min), max);
      setInternalValue(boundedValue);
      onChange(boundedValue);
    }
  };

  // Format display value
  const displayValue = formatDisplay ? formatDisplay(internalValue) : internalValue.toString();

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <Label htmlFor={id} className="font-medium">
          {label}{required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        <span className="text-sm font-medium">
          {prefix && <span className="mr-1">{prefix}</span>}
          {displayValue}
          {suffix && <span className="ml-1">{suffix}</span>}
        </span>
      </div>

      <Slider
        value={[internalValue]}
        min={min}
        max={max}
        step={step}
        onValueChange={handleSliderChange}
        className="my-4"
        aria-label={label}
      />

      {showInput && (
        <div className="flex">
          {prefix && (
            <div className="flex items-center justify-center bg-muted/50 border border-r-0 border-input rounded-l-md px-2 sm:px-3 text-muted-foreground min-w-8 sm:min-w-10">
              {prefix}
            </div>
          )}
          <Input
            id={id}
            type="number"
            value={internalValue}
            onChange={(e) => handleInputChange(e.target.value)}
            className={`${prefix ? 'rounded-l-none' : ''} ${suffix ? 'rounded-r-none' : ''} shadow-sm h-10 text-base`}
            min={min}
            max={max}
            step={step}
            required={required}
            inputMode="decimal"
          />
          {suffix && (
            <div className="flex items-center justify-center bg-muted/50 border border-l-0 border-input rounded-r-md px-2 sm:px-3 text-muted-foreground min-w-8 sm:min-w-10">
              {suffix}
            </div>
          )}
        </div>
      )}

      {helperText && <p className="text-xs text-muted-foreground">{helperText}</p>}
    </div>
  );
}
