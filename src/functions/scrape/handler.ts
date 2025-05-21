/**
 * @author Lukas Masopust
 * @email lmasopust@ucdavis.edu
 * @create date 2025-05-21 14:45:21
 * @modify date 2025-05-21 14:45:21
 * @desc handler for scraping papers endpoint
 * generates a random paper id and saves it to s3 bucket
 * sends notification to email
 * returns success or error message
 */

import { v4 as uuidv4 } from "uuid";

import { Paper } from "../../lib/types";
import { savePaper } from "../../lib/s3";
import { sendPaperNotification } from "../../lib/email";
import { error, success } from "../../utils/api";

export const lambdaHandler = async (event: any) => {
  const paperId = uuidv4();
  const data: Paper = {
    paper_id: paperId,
    title: "Deep Transfer Learning for Tomatoes",
    authors: ["Jane Doe"],
    facts: [
      {
        subject: "Tomatoes",
        predicate: "require",
        object: "sunlight",
      },
    ],
  };

  const bucketName = process.env.BUCKET_NAME || "automation-proof-of-concept";

  try {
    await savePaper(bucketName, paperId, data);
    await sendPaperNotification(bucketName, paperId);

    return success({ message: "Scraped and notified successfully" });
  } catch (err: any) {
    console.error("Error:", err);
    return error(err.message);
  }
};
