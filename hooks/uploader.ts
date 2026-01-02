import { useRef, useState } from "react"

export type UploadResult = {
  path: string
  bucket: string
  publicUrl: string
}

export function useUploader(serverBase = process.env.NEXT_PUBLIC_API_URL) {
  const xhrRef = useRef<XMLHttpRequest | null>(null)
  const [progress, setProgress] = useState<number>(0)
  const [isUploading, setIsUploading] = useState<boolean>(false)

  // request signed URL from backend then upload via XHR
  async function uploadFile(file: File, bucket = "videos"): Promise<UploadResult> {
    setIsUploading(true)
    setProgress(0)

    const fileName = `${Date.now()}-${file.name}`

    // 1) ask server for signed upload URL
    const resp = await fetch(`${serverBase}/api/supabase/upload-url`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileName, bucket }),
    })

    if (!resp.ok) {
      setIsUploading(false)
      throw new Error("Failed to get upload URL")
    }

    const { uploadUrl, path ,publicUrl} = await resp.json()

    // 2) upload with XHR to support progress + cancel
    return new Promise<UploadResult>((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhrRef.current = xhr

      xhr.open("PUT", uploadUrl)

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const pct = (e.loaded / e.total) * 100
          setProgress(pct)
        }
      }

      xhr.onload = () => {
        xhrRef.current = null
        setIsUploading(false)
        setProgress(100)
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve({ path, bucket,publicUrl })
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`))
        }
      }

      xhr.onerror = () => {
        xhrRef.current = null
        setIsUploading(false)
        reject(new Error("Network error during upload"))
      }

      xhr.onabort = () => {
        xhrRef.current = null
        setIsUploading(false)
        reject(new Error("Upload aborted"))
      }

      xhr.send(file)
    })
  }

  function cancelUpload() {
    xhrRef.current?.abort()
    xhrRef.current = null
    setIsUploading(false)
    setProgress(0)
  }

  return {
    uploadFile,
    cancelUpload,
    progress,
    isUploading,
  }
}
