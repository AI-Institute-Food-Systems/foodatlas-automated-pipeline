/**
 * @author Lukas Masopust
 * @email lmasopust@ucdavis.edu
 * @create date 2025-05-21 14:46:38
 * @modify date 2025-05-21 14:46:38
 * @desc stream utility for converting streams to strings and JSON objects
 */

import { Readable } from "stream";

/**
 * Converts a stream to a string
 * @param stream - The stream to convert
 * @returns A promise that resolves to the string
 */
export async function toString(stream: Readable): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: any[] = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
  });
}

/**
 * Converts a stream to a JSON object
 * @param stream - The stream to convert
 * @returns A promise that resolves to the JSON object
 */
export async function toJson<T>(stream: Readable): Promise<T> {
  const str = await toString(stream);
  return JSON.parse(str);
}

/**
 * Converts a stream to a buffer
 * @param stream - The stream to convert
 * @returns A promise that resolves to the buffer
 */
export async function toBuffer(stream: Readable): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: any[] = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks)));
  });
}
