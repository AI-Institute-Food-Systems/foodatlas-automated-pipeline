/**
 * @author Lukas Masopust
 * @email lmasopust@ucdavis.edu
 * @create date 2025-05-21 14:43:04
 * @modify date 2025-05-21 14:44:48
 * @desc handler for listing unverified papers endpoint
 * retrieves pending papers from s3 bucket and returns them in api response
 * returns error if operation fails
 */

import { listPendingPapers } from "../../lib/s3";
import { success, error } from "../../utils/api";

export const lambdaHandler = async (event: any) => {
  const bucketName = process.env.BUCKET_NAME || "automation-proof-of-concept";

  try {
    const papers = await listPendingPapers(bucketName);
    return success(papers);
  } catch (err) {
    console.error(err);
    return error("Failed to load data");
  }
};
