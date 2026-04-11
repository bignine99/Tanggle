import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const PROCEDURE_DETAILS: Record<string, string> = {
  '얼굴거상': `
    SURGICAL PROCEDURE: Maximum Facial Rhytidectomy (Face Lift) & Neck Lift
    
    BEFORE STATE:
    - Sagging jowls along the jawline
    - Deep nasolabial folds (smile lines) and marionette lines
    
    AFTER STATE:
    - MAXIMUM ANATOMICAL LIFT: The jawline contour is radically sharp, defined, and firm (V-line)
    - COMPLETE ELIMINATION: Jowls and excess skin along the jaw and neck are completely removed
    - COMPLETE ELIMINATION: Nasolabial folds are completely erased
    - Face appears lifted to the anatomical maximum and overall width is radically slimmer
    
    PHOTO CONSISTENCY:
    - Same face identity, eyes, forehead, head size, clothing, and background
  `,
  '동안성형': `
    SURGICAL PROCEDURE: Anti-Aging Mid-Face Rejuvenation (Fat Grafting)
    
    BEFORE STATE:
    - Flat or slightly hollow cheeks and under-eye area
    
    AFTER STATE:
    - Subtle, youthful plumpness (volume) restored to the anterior cheeks (apple zone)
    - Hollows and dark circles under the eyes are smoothly filled
    - Skin texture is visibly smoother, brighter, and youthful
    - Lips are subtly plumper by 10% without altering shape
    
    PHOTO CONSISTENCY:
    - Same face width, jawline shape, pose, and background
  `,
  '이마거상': `
    SURGICAL PROCEDURE: Maximum Forehead Lift (Brow Lift)
    
    BEFORE STATE:
    - Drooping eyebrows and heavy upper eyelids
    - Forehead wrinkles present
    
    AFTER STATE:
    - MAXIMUM ANATOMICAL LIFT: Eyebrows are elevated to the extreme anatomical limit
    - Upper eyelids are stretched tight, making eyes appear drastically larger and refreshed
    - COMPLETE ELIMINATION: Forehead skin is completely smooth with all wrinkles annihilated
    
    PHOTO CONSISTENCY:
    - Lower face, cheeks, jawline, and background maintained
  `,
  '가슴거상': `
    SURGICAL PROCEDURE: Mastopexy (Breast Lift)
    
    BEFORE STATE:
    - Breasts show ptosis (sagging) and downward pointing nipples
    
    AFTER STATE:
    - Breast tissue is lifted to a higher, more youthful position on the chest wall
    - Upper pole fullness is restored (rounder shape)
    - Areola/nipple position is elevated and centered
    - Background fills the space where sagging tissue was removed
    
    PHOTO CONSISTENCY:
    - Same face, pose, and clothing maintained
  `,
  '팔거상': `
    SURGICAL PROCEDURE: Radical Brachioplasty (Arm Lift)
    
    BEFORE STATE (current photo):
    - Upper arm has excess loose skin hanging from the tricep area
    - The arm silhouette shows a convex bulge on the underside between shoulder and elbow
    - Skin appears soft and drooping when arm is raised
    
    AFTER STATE (generate this):
    - RADICAL VOLUME REDUCTION: The underside of the upper arm is shaved flat tightly to the bone/muscle
    - Upper arm circumference reduced by 50% or more (Maximum Transformation)
    - A clean, drastically straight linear contour from shoulder to elbow
    - Skin is taut, smooth, and adheres directly to the underlying muscle
    - Where excess skin/fat was removed, the background (wall, space behind arm) 
      is now visible and must be seamlessly reconstructed
    
    PHOTO CONSISTENCY:
    - Same face, same lighting, same pose, same clothing
    - Only the upper arm shape radically changes
  `,
  '복부거상': `
    SURGICAL PROCEDURE: Radical Abdominoplasty (Tummy Tuck)
    
    BEFORE STATE:
    - Lower abdomen has protruding and sagging fatty tissue
    - Waistline lacks definition
    
    AFTER STATE:
    - RADICAL VOLUME REDUCTION: Abdomen is aggressively flattened, reduced by 50% or more in projection
    - MAXIMUM TRANSFORMATION: Waist-to-hip ratio is radically cinched into an extreme hourglass silhouette
    - Skin is extremely smooth with no stretch marks visible
    - Background seamlessly fills the enormous space where abdominal volume was removed
    
    PHOTO CONSISTENCY:
    - Same face, pose, and clothing maintained
  `,
  '허벅지거상': `
    SURGICAL PROCEDURE: Radical Thigh Lift (Thighplasty)
    
    BEFORE STATE:
    - Inner thighs have excess skin and fat
    - Thighs touch at the inner surface when standing
    
    AFTER STATE:
    - RADICAL VOLUME REDUCTION: Inner thigh volume reduced by 50% or more
    - A massive, highly visible gap exists between the inner thighs
    - Smooth, extremely tight skin contour from groin to knee
    - Floor/background is vividly visible through the newly created thigh gap
    
    PHOTO CONSISTENCY:
    - Same face, pose, and clothing maintained
  `,
  '엉덩이성형': `
    SURGICAL PROCEDURE: Gluteal Augmentation & Lift
    
    BEFORE STATE:
    - Flat or sagging buttocks profile
    
    AFTER STATE:
    - Gluteal fold is lifted higher
    - Buttocks have significantly increased projection and rounded volume (apple hip)
    
    PHOTO CONSISTENCY:
    - Same face, pose, and clothing maintained
  `,
  '지방흡입': `
    SURGICAL PROCEDURE: Radical Liposuction (Body Contouring)
    
    BEFORE STATE:
    - Target body area shows excess adipose tissue and bulky contour
    
    AFTER STATE:
    - RADICAL VOLUME REDUCTION: Circumference of the target area is reduced by 50% or more
    - Silhouette is remarkably leaner, radically altering the body shape
    - Background is vividly restored where massive volume was extracted
    
    PHOTO CONSISTENCY:
    - Same face, pose, and clothing maintained
  `,
  '바디필러': `
    SURGICAL PROCEDURE: Body Contouring Fillers (Hip/Breast)
    
    BEFORE STATE:
    - Depressions (like hip dips) or flattened curves
    
    AFTER STATE:
    - Hollow areas are seamlessly inflated creating a very smooth, voluptuous curve
    
    PHOTO CONSISTENCY:
    - Same face, pose, and clothing maintained
  `,
  '남성여유증': `
    SURGICAL PROCEDURE: Gynecomastia Correction
    
    BEFORE STATE:
    - Male chest shows pronounced, gland-like protrusion
    
    AFTER STATE:
    - Chest is completely flat against the chest wall
    - Pectoral muscle lines are subtly defined
    - Background is inpainted perfectly where chest volume was reduced
    
    PHOTO CONSISTENCY:
    - Same face, pose, and clothing maintained
  `
};

export async function POST(req: Request) {
  try {
    // We will extract details locally so the frontend doesn't need to change
    const { imageBase64, procedure } = await req.json();

    if (!imageBase64 || !procedure) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Extract Base64 Data & Mime Type from the data URL sent by the frontend
    let base64Data = imageBase64;
    let mimeType = "image/jpeg";
    
    if (imageBase64.includes(",")) {
      base64Data = imageBase64.split(",")[1];
      try {
        mimeType = imageBase64.split(";")[0].split(":")[1] || "image/jpeg";
      } catch (e) {
        mimeType = "image/jpeg";
      }
    }

    const details = PROCEDURE_DETAILS[procedure] || "";

    // 2. Apply the 'Clinical Prompt' proven to work in AI Studio
    const prompt = `
      You are a Medical Visualization Expert. 
      TASK: Clinical Reconstruction and Maximum Simulation of ${procedure}.
      GOAL: ${details}
      
      STRICT RULES:
      1. RADICAL & MAXIMUM TRANSFORMATION: Prioritize Dramatic Visual Impact over mere naturalness. Perform a TOTAL RECONSTRUCTION.
      2. ANATOMICAL MODIFICATION: Apply a Maximum Anatomical Lift and Radical Volume Reduction where applicable. Physically modify the target area to the absolute maximum clinical limit.
      3. WRINKLE & VOLUME RECONSTRUCTION: Complete Elimination of target wrinkles. Radical Volume Reduction for slimming procedures (shave off up to 50% or more of the silhouette).
      4. BACKGROUND INPAINTING: Reconstruct the background vividly seamlessly in empty spaces left by the radical reduction.
      5. REALISM & AESTHETICS: Fully healed, clean Clinical Reconstruction. No scars, sutures, or bruising.
      
      Output: Return the modified image only.
    `;

    // 3. Use the requested model
    const model = "gemini-2.5-flash-image";

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: ["IMAGE"],
      }
    });

    const generatedPart = response.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData);

    if (!generatedPart) {
      throw new Error("No image generated by Gemini");
    }

    return NextResponse.json({ 
      success: true,
      image: `data:${generatedPart.inlineData?.mimeType || 'image/png'};base64,${generatedPart.inlineData?.data}`
    });

  } catch (error: any) {
    console.error("AI Simulation Route Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate simulation" }, { status: 500 });
  }
}
