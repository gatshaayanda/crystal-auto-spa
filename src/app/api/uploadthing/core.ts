import { createUploadthing, type FileRouter } from "uploadthing/next";
import { readReceiptByToken, requireBigBrothersStaff } from "@/lib/server/big-brothers-receipts";

const f = createUploadthing();

export const ourFileRouter = {
  fileUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
    video: { maxFileSize: "16MB", maxFileCount: 1 },
    pdf: { maxFileSize: "4MB", maxFileCount: 1 },
  }).middleware(async ({ req }) => {
    const receiptToken = req.headers.get("x-receipt-token")?.trim();
    if (receiptToken) {
      const receipt = await readReceiptByToken(receiptToken);
      if (!receipt) throw new Error("A valid, unexpired wash receipt is required for customer media uploads.");
      return { kind: "customer" as const, receiptToken };
    }
    await requireBigBrothersStaff(req);
    return { kind: "staff" as const };
  }).onUploadComplete(async ({ metadata, file }) => {
    console.info("[Crystal Auto Spa] media uploaded", {
      kind: metadata.kind,
      name: file.name,
      size: file.size,
      type: file.type,
      urlAvailable: Boolean(file.url || file.ufsUrl),
    });
    return { kind: metadata.kind };
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
