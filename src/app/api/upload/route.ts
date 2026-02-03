import cloudinary from "@/lib/cloudinary";
import { NextResponse } from "next/server";

type FormDataFile = Blob & {
  name?: string;
};
export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const file = formData.get("file") as FormDataFile | null;
    const pathName = formData.get("pathName") as string;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const fileBuffer = await file.arrayBuffer();
    const base64File = Buffer.from(fileBuffer).toString("base64");

    const uploadResponse = await cloudinary.uploader.upload(
      `data:${file.type};base64,${base64File}`,
      {
        folder: pathName,
        transformation: [
          {
            width: 200,
            height: 200,
            crop: "fill",
            gravity: "face",
          },
        ],
      }
    );

    return NextResponse.json({ url: uploadResponse.secure_url });
  } catch (error) {
    console.log("Error uploading file to cloudinary:", error);
    return NextResponse.json(
      { error: "Error uploading file to cloudinary" },
      { status: 500 }
    );
  }
}
