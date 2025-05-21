/**
 * @author Lukas Masopust
 * @email lmasopust@ucdavis.edu
 * @create date 2025-05-21 14:46:03
 * @modify date 2025-05-21 14:46:03
 */

export interface Paper {
  paper_id: string;
  title: string;
  authors: string[];
  facts: Fact[];
}

export interface Fact {
  subject: string;
  predicate: string;
  object: string;
}

export interface ApiResponse {
  statusCode: number;
  headers: {
    "Content-Type": string;
    "Access-Control-Allow-Origin": string;
  };
  body: string;
}
