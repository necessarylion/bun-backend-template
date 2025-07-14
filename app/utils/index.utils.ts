import type { Controller } from "../../core/router";

// Helper function to check if a value is a class constructor
export function isClass(v: any): v is new (...args: any[]) => any {
  return (
    typeof v === "function" &&
    /^class\s/.test(v.toString()) // Check if the function is a class
  );
}

export function isTuple(v: Controller): v is [new (...args: any[]) => any, string] {
  return Array.isArray(v) && v.length === 2 && isClass(v[0])
}