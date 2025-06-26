import { type NextRequest, NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import { join } from "path"

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
    const files: File[] = []

    // Extract all files from form data
    for (const [key, value] of data.entries()) {
      if (key.startsWith("photo-") && value instanceof File) {
        files.push(value)
      }
    }

    if (files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 })
    }

    const uploadedUrls: string[] = []

    for (const file of files) {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Generate unique filename
      const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}-${file.name}`
      const path = join(process.cwd(), "public/uploads", filename)

      // Save file
      await writeFile(path, buffer)
      uploadedUrls.push(`/uploads/${filename}`)
    }

    return NextResponse.json({ urls: uploadedUrls })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
