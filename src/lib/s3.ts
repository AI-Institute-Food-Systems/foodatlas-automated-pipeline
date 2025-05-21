/**
 * @author Lukas Masopust
 * @email lmasopust@ucdavis.edu
 * @create date 2025-05-21 14:45:51
 * @modify date 2025-05-21 14:45:51
 * @desc s3 utility for listing and saving papers
 */

import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

import { Readable } from "stream";
import { toJson } from "../utils/stream";
import { Paper } from "./types";

const s3 = new S3Client({ region: "us-west-1" });

export async function listPendingPapers(bucketName: string): Promise<Paper[]> {
  const listResult = await s3.send(
    new ListObjectsV2Command({ Bucket: bucketName, Prefix: "pending/" })
  );
  const result: Paper[] = [];

  for (const item of listResult.Contents || []) {
    const obj = await s3.send(
      new GetObjectCommand({ Bucket: bucketName, Key: item.Key })
    );
    const paper = await toJson<Paper>(obj.Body as Readable);
    result.push(paper);
  }

  return result;
}

export async function savePaper(
  bucketName: string,
  paperId: string,
  data: Paper
) {
  await s3.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: `pending/${paperId}.json`,
      Body: JSON.stringify(data),
      ContentType: "application/json",
    })
  );
}
