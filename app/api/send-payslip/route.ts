import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { Client } from "@microsoft/microsoft-graph-client";
import { ClientSecretCredential } from "@azure/identity";
import { Payslip } from "@/types/payslip";

const clientId = process.env.AZURE_CLIENT_ID!;
const clientSecret = process.env.AZURE_CLIENT_SECRET!;
const tenantId = process.env.AZURE_TENANT_ID!;
const userEmail = "hr@cipherdevelopers.com";

export async function POST(req: NextRequest) {
  try {
    const credential = new ClientSecretCredential(
      tenantId,
      clientId,
      clientSecret
    );
    const token = await credential.getToken(
      "https://graph.microsoft.com/.default"
    );
    const client = Client.init({
      authProvider: (done) => done(null, token.token),
    });

    const formData = await req.formData();
    const pdfFile = formData.get("file") as File | null;
    const jsonPaySlip = formData.get("slip") as string | null;

    if (!pdfFile || !jsonPaySlip) {
      return NextResponse.json(
        { error: "File or recipient email missing" },
        { status: 400 }
      );
    }

    const paySlip: Payslip = JSON.parse(jsonPaySlip);
    const recipientEmail = paySlip.email;
    const employeeName = paySlip.employeeName;
    const payPeriod = paySlip.payPeriod;

    const arrayBuffer = await pdfFile.arrayBuffer();
    const base64Content = Buffer.from(arrayBuffer).toString("base64");

    // Email content
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Your Salary Slip</title>
  </head>
  <body
    style="
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
    "
  >
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 0">
          <table
            role="presentation"
            style="
              width: 600px;
              border-radius:20px;
              margin:10px auto;
              background-color: #ffffff;
              border-collapse: collapse;
            "
          >
  

            <!-- Email content -->
            <tr>
              <td style="padding: 30px 20px">
                <h2 style="margin-top: 0; color: #333333">Salary Slip</h2>
                <p
                  style="margin-bottom: 20px; color: #555555; line-height: 1.5"
                >
                  Dear ${employeeName},
                </p>
                <p
                  style="margin-bottom: 20px; color: #555555; line-height: 1.5"
                >
                  Your salary slip for the pay period ${payPeriod} has been
                  generated and is attached to this email.
                </p>
                <p
                  style="margin-bottom: 20px; color: #555555; line-height: 1.5"
                >
                  If you have any questions, feel free to reach out.
                </p>
                <p
                  style="margin-bottom: 20px; color: #555555; line-height: 1.5"
                >
                  Thank you.
                </p>
                <p style="margin-bottom: 0; color: #555555; line-height: 1.5">
                  Best regards,<br />HR Cipher Developers
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                style="
                  padding: 20px;
                  text-align: center;
                  background-color: #f8f8f8;
                  border-top: 1px solid #dddddd;
                  font-size: 12px;
                  color: #777777;
                "
              >
                <p style="margin: 0">
                  © 2023 Cipher Developers. All rights reserved.
                </p>
                <p style="margin: 10px 0 0">
                  For any queries, please contact: hr@cipherdevelopers.com
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

    // Send email
    await client.api(`/users/${userEmail}/sendMail`).post({
      message: {
        subject: `Salary Slip - ${payPeriod}`,
        body: {
          contentType: "HTML",
          content: htmlContent,
        },
        toRecipients: [
          {
            emailAddress: {
              address: recipientEmail,
            },
          },
        ],
        ccRecipients: [
          {
            emailAddress: {
              address: "afraz@cipherdevelopers.com",
            },
          },
        ],
        attachments: [
          {
            "@odata.type": "#microsoft.graph.fileAttachment",
            name: pdfFile.name,
            contentType: "application/pdf",
            contentBytes: base64Content,
          },
        ],
        // Add text version as alternative
        // Note: Microsoft Graph doesn't support multipart/alternative emails directly
        // Fallback is automatic if HTML fails to render, but Graph only allows one body
      },
      // saveToSentItems: "false", // Optional
    });
    return NextResponse.json(
      { message: "Email sent successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error sending email:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
