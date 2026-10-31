"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { uploadBlogPdf } from "@/lib/upload-file";
import { uploadBlogImage } from "@/lib/upload-image";

function revalidateEbooks() {
  revalidateTag("ebooks", "max");
  revalidatePath("/ebooks");
  revalidatePath("/admin");
  revalidatePath("/admin/ebooks");
}

export type EbookActionResult = { error: string } | undefined;

export async function createEbook(
  formData: FormData,
): Promise<EbookActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại." };
  }

  const title = String(formData.get("title") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const coverFile = formData.get("cover_image");
  const pdfFile = formData.get("pdf_file");

  if (!title) {
    return { error: "Vui lòng nhập tiêu đề ebook." };
  }

  if (!(pdfFile instanceof File) || pdfFile.size === 0) {
    return { error: "Vui lòng tải lên file PDF." };
  }

  const uploadedPdf = await uploadBlogPdf(supabase, pdfFile, "ebooks");
  if ("error" in uploadedPdf) return { error: uploadedPdf.error };

  let coverImageUrl: string | null = null;
  if (coverFile instanceof File && coverFile.size > 0) {
    const uploadedCover = await uploadBlogImage(
      supabase,
      coverFile,
      "ebook-covers",
    );
    if ("error" in uploadedCover) return { error: uploadedCover.error };
    coverImageUrl = uploadedCover.url;
  }

  const { error } = await supabase.from("ebooks").insert({
    title,
    category,
    cover_image_url: coverImageUrl,
    file_url: uploadedPdf.url,
  });

  if (error) {
    console.error("Create ebook failed:", error.message);
    return { error: `Không thể tạo ebook: ${error.message}` };
  }

  revalidateEbooks();
  return undefined;
}

export async function deleteEbook(id: string): Promise<EbookActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại." };
  }

  const { error } = await supabase.from("ebooks").delete().eq("id", id);

  if (error) {
    console.error("Delete ebook failed:", error.message);
    return { error: `Không thể xóa ebook: ${error.message}` };
  }

  revalidateEbooks();
  return undefined;
}
