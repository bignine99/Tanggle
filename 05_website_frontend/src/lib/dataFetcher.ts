import fs from "fs";
import path from "path";

// ----------------------------------------------------------------------
// Types based on the structured JSON structure
// ----------------------------------------------------------------------
export interface QnAPair {
  question: string;
  answer: string;
}

export interface ProcedureData {
  id: string; // File name without .json
  category: string; // Folder name
  title: string;
  summary: string;
  video_id?: string;
  youtube_url?: string;
  category_name?: string;
  procedure_name?: string;
  target_audience?: string;
  
  // Surgical Info (can be dynamically shaped, but we define common elements)
  surgery_info?: {
    time?: string;
    anesthesia?: string;
    hospitalization?: string;
    stitch_removal?: string;
    recovery?: string;
  };
  
  advantages?: string[];
  special_points?: any;
  how_it_is_performed?: any;
  neck_lifting?: any;
  face_lifting_methods?: any;
  doctor_expertise?: any;
  
  content?: {
    summary?: string;
    key_topics?: string[];
    qa_pairs?: QnAPair[];
  };
  
  // Fallback raw object if needed
  raw: any; 
}

// Ensure robust path resolution (Next.js server environments)
const dataDirectory = path.join(process.cwd(), "..", "02_processed_data", "structured_data");

/**
 * 재귀적으로 모든 JSON 파일의 경로를 배열로 반환합니다.
 */
function getAllJSONPaths(dir: string, fileList: string[] = []): string[] {
  if (!fs.existsSync(dir)) return fileList;
  
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllJSONPaths(fullPath, fileList);
    } else if (fullPath.endsWith(".json")) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

/**
 * 파일 경로에서 카테고리와 ID(파일명)를 추출하고 JSON을 파싱하여 ProcedureData 형식으로 반환합니다.
 */
export function getProcedureData(): ProcedureData[] {
  const filePaths = getAllJSONPaths(dataDirectory);
  const dataList: ProcedureData[] = [];

  for (const filePath of filePaths) {
    try {
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const raw = JSON.parse(fileContent);
      
      const fileName = path.basename(filePath, ".json");
      const category = path.basename(path.dirname(filePath));
      
      // Fallback strategies for title & summary since data shapes vary
      const title = raw.metadata?.title || raw.procedure_name || raw.category || "안내";
      const summary = raw.content?.summary || raw.summary || "";
      const video_id = raw.video_id || "";
      
      dataList.push({
        id: fileName,
        category,
        title,
        summary,
        video_id,
        surgery_info: raw.surgery_info || raw.procedure_overview || null,
        advantages: raw.advantages || [],
        special_points: raw.special_points || null,
        how_it_is_performed: raw.how_it_is_performed || null,
        neck_lifting: raw.neck_lifting || null,
        face_lifting_methods: raw.face_lifting_methods || null,
        doctor_expertise: raw.doctor_expertise || null,
        content: raw.content || null,
        raw
      });
    } catch (error: any) {
      console.warn(`[DataFetcher] Skipping invalid JSON -> ${filePath}: ${error.message}`);
    }
  }
  
  return dataList;
}

/**
 * 전체 카테고리 목록을 반환합니다.
 */
export function getCategories(): string[] {
  const dataList = getProcedureData();
  const categories = dataList.map(data => data.category);
  return Array.from(new Set(categories)).filter(cat => Boolean(cat) && cat !== '병원정보'); // Deduplicate and exclude Hospital Info
}

/**
 * 특정 카테고리의 모든 데이터를 반환합니다.
 */
export function getProceduresByCategory(categoryName: string): ProcedureData[] {
  const dataList = getProcedureData();
  return dataList.filter(data => data.category === decodeURIComponent(categoryName));
}

/**
 * 특정 ID의 단일 데이터를 반환합니다.
 */
export function getProcedureById(id: string): ProcedureData | null {
  const dataList = getProcedureData();
  const found = dataList.find(data => data.id === id);
  return found || null;
}
