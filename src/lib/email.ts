/**
 * @author Lukas Masopust
 * @email lmasopust@ucdavis.edu
 * @create date 2025-05-21 14:45:39
 * @modify date 2025-05-21 14:45:39
 * @desc email utility for sending notifications
 */

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPaperNotification(
  bucketName: string,
  paperId: string
) {
  await resend.emails.send({
    from: "[FoodAtlas] Automated Pipeline Update<automation@foodatlas.ai>",
    to: ["lmasopust@ucdavis.edu"],
    subject: "New Paper Scraped",
    html: `
      <p>A new paper was scraped and is ready for review:</p>
      <p><code>s3://${bucketName}/pending/${paperId}.json</code></p>
      <p>Please review the paper and update the status in the database here: https://foodatlas.ai/verify</p>
    `,
  });
}
