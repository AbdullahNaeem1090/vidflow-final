import { z } from "zod"

export const fileSchema = z
  .custom<File>((v) => v instanceof File, "File is required")
  .refine((file) => file.size > 0, "File is required")
  .refine((file) => file.type.startsWith("video/") || file.type.startsWith("image/"), "Invalid file type")

export const videoUploadSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  duration: z.number().min(0),
  video: fileSchema.refine((file) => file.type.startsWith("video/"), "Video must be a video file"),
  thumbnail: fileSchema.refine((file) => file.type.startsWith("image/"), "Thumbnail must be an image file"),
})

