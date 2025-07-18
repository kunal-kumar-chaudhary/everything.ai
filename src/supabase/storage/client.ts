import {v4 as uuidv4} from "uuid";
import {createSupabaseClient} from "../client";

function getStorage(){
    const {storage} = createSupabaseClient();
    return storage;
}

type uploadProps = {
    file: File;
    bucket: string;
    folder?: string;
}

// we will compress and upload the file to the storage
export async function uploadImage({file, bucket, folder}: uploadProps){
    const filename = file.name;
    const fileExtension = filename.slice(filename.lastIndexOf(".")+1);
    const path = `${folder ? folder + "/" : ""}${uuidv4()}.${fileExtension}`;
    console.log(path);
    const storage = getStorage();

    const {data, error} = await storage.from(bucket).upload(path, file);
    if (error){
        console.log(error);
        return {imageUrl : "", error: "image upload failed"}
    }
    const fileUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL!}/storage/${bucket}/${data?.path}`;
    return {fileUrl, error: ""}
}