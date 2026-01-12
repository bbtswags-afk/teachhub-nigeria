import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
    try {
        const data = await request.formData();
        const file: File | null = data.get("file") as unknown as File;

        if (!file) {
            return NextResponse.json({ success: false, message: "No file uploaded" }, { status: 400 });
        }

        // Check file size (200MB limit)
        const ONE_MB = 1024 * 1024;
        const MAX_SIZE = 200 * ONE_MB;

        if (file.size > MAX_SIZE) {
            return NextResponse.json({
                success: false,
                message: "File too large. Maximum size is 200MB."
            }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to Supabase using SERVICE ROLE (Bypasses RLS)
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

        if (!supabaseUrl || !supabaseServiceKey) {
            return NextResponse.json({ success: false, message: "Server Config Error: Missing Service Key" }, { status: 500 });
        }

        const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

        const timestamp = Date.now();
        const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
        const fileName = `${timestamp}-${safeName}`;

        const { data: uploadData, error: uploadError } = await supabaseAdmin
            .storage
            .from('files')
            .upload(fileName, buffer, {
                contentType: file.type,
                upsert: false
            });

        if (uploadError) {
            console.error("Supabase Upload Error:", uploadError);
            return NextResponse.json({ success: false, message: "Upload failed: " + uploadError.message }, { status: 500 });
        }

        // Get Public URL (Use standard client or just construct string)
        const { data: { publicUrl } } = supabaseAdmin
            .storage
            .from('files')
            .getPublicUrl(fileName);

        return NextResponse.json({ success: true, url: publicUrl });
    } catch (error) {
        console.error("Upload failed:", error);
        return NextResponse.json({ success: false, message: "Upload failed" }, { status: 500 });
    }
}
