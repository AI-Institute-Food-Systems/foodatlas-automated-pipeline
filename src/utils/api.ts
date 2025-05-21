/**
 * @author Lukas Masopust
 * @email lmasopust@ucdavis.edu
 * @create date 2025-05-21 14:46:13
 * @modify date 2025-05-21 14:46:26
 * @desc api utility for returning success or error messages
 */

import { ApiResponse } from "../lib/types";

export function success(data: any): ApiResponse {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(data),
  };
}

export function error(message: string, statusCode: number = 500): ApiResponse {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({ error: message }),
  };
}

export function parseBody(event: any): any {
  try {
    return event.body ? JSON.parse(event.body) : {};
  } catch (err) {
    throw new Error("Invalid request body");
  }
}

export function validateRequiredFields(data: any, fields: string[]): void {
  const missing = fields.filter((field) => !data[field]);
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(", ")}`);
  }
}
