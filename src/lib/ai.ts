// Gemini AI integration for portfolio generation
interface AIGenerationRequest {
  name?: string;
  role?: string;
  skills?: string[];
  title?: string;
  tags?: string[];
}

interface AIPortfolioResponse {
  bio: string;
  skills: string[];
  projects: {
    title: string;
    description: string;
    tags: string[];
  }[];
}

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY!;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

async function callGeminiAPI(prompt: string): Promise<string> {
  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Failed to generate AI content');
  }
}

export async function generateBio({ name, role, skills = [] }: AIGenerationRequest): Promise<string> {
  const skillsText = skills.length > 0 ? ` with skills in ${skills.join(', ')}` : '';
  const prompt = `Write a professional portfolio bio for ${name}, a ${role}${skillsText}. Keep it under 120 words. Make it engaging and professional.`;
  
  return await callGeminiAPI(prompt);
}

export async function generateProjectDescription({ title, tags = [] }: AIGenerationRequest): Promise<string> {
  const tagsText = tags.length > 0 ? ` with technologies: ${tags.join(', ')}` : '';
  const prompt = `Write a concise project description for "${title}"${tagsText} suitable for a portfolio. Focus on impact and technical implementation. Keep it under 100 words.`;
  
  return await callGeminiAPI(prompt);
}

export async function suggestSkills({ role }: AIGenerationRequest): Promise<string[]> {
  const prompt = `Suggest 10 relevant technical and professional skills that a ${role} should showcase in their portfolio. Return only a comma-separated list of skills, no explanations.`;
  
  const response = await callGeminiAPI(prompt);
  return response.split(',').map(skill => skill.trim()).filter(Boolean).slice(0, 10);
}

export async function generateFullPortfolio({ name, role }: AIGenerationRequest): Promise<AIPortfolioResponse> {
  const prompt = `Generate a complete portfolio JSON for ${name}, a ${role}. Return only valid JSON with this exact structure:
{
  "bio": "professional description under 120 words",
  "skills": ["skill1", "skill2", "skill3", "skill4", "skill5", "skill6", "skill7", "skill8", "skill9", "skill10"],
  "projects": [
    {
      "title": "Project Title 1",
      "description": "Project description under 100 words",
      "tags": ["tag1", "tag2", "tag3"]
    },
    {
      "title": "Project Title 2", 
      "description": "Project description under 100 words",
      "tags": ["tag1", "tag2", "tag3"]
    },
    {
      "title": "Project Title 3",
      "description": "Project description under 100 words", 
      "tags": ["tag1", "tag2", "tag3"]
    }
  ]
}

Make the content realistic and relevant for a ${role}.`;

  const response = await callGeminiAPI(prompt);
  
  try {
    // Extract JSON from response if it contains extra text
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    const jsonString = jsonMatch ? jsonMatch[0] : response;
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Failed to parse AI response:', error);
    throw new Error('Failed to generate portfolio data');
  }
}