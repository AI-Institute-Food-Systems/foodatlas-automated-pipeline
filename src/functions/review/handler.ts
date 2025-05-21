/**
 * @author Lukas Masopust
 * @email lmasopust@ucdavis.edu
 * @create date 2025-05-21 14:45:11
 * @modify date 2025-05-21 14:45:11
 * @desc handler for reviewing papers endpoint
 * retrieves paper from s3 bucket and updates its status
 * returns success or error message
 */

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  S3Client,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { success, error } from "../../utils/api";
import { toJson } from "../../utils/stream";
import { Paper } from "../../lib/types";
import { Readable } from "stream";

const s3Client = new S3Client({});
const BUCKET_NAME = process.env.BUCKET_NAME || "automation-proof-of-concept";

export const lambdaHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      return error("request body is required");
    }

    const { paperId, action } = JSON.parse(event.body);

    if (!paperId || !action) {
      return error("paperId and action are required");
    }

    if (action !== "accept" && action !== "reject") {
      return error('action must be either "accept" or "reject"');
    }

    // get the paper from s3
    const getCommand = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: `unverified/${paperId}.json`,
    });

    const paper = await toJson<Paper>(
      (await s3Client.send(getCommand)).Body as Readable
    );

    if (!paper) {
      return error("paper not found");
    }

    if (action === "accept") {
      // TODO: in the future, this is where we would inject the paper into the database
      console.log("paper accepted:", paper);
    }

    // delete the paper from s3
    const deleteCommand = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: `unverified/${paperId}.json`,
    });

    await s3Client.send(deleteCommand);

    return success({
      message: `paper ${action}ed successfully`,
      paperId,
    });
  } catch (err: any) {
    console.error("error reviewing paper:", err);
    return error("error reviewing paper");
  }
};
