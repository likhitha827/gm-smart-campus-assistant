import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadJson(filename) {
  try {
    const raw = fs.readFileSync(path.join(__dirname, 'data', filename), 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

export const campusKnowledge = {
  departments: loadJson('departments.json'),
  faculty: loadJson('faculty.json'),
  facilities: loadJson('facilities.json'),
  events: loadJson('events.json'),
  notices: loadJson('notices.json'),
  services: loadJson('student-services.json'),
  academic: loadJson('academic-resources.json'),
};

export function retrieveContext(query) {
  const qTokens = query.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(t => t.length > 2);
  const matched = [];

  function scoreItem(item, category) {
    const str = JSON.stringify(item).toLowerCase();
    let score = 0;
    for (const token of qTokens) {
      if (str.includes(token)) score += 1;
    }
    if (score > 0) matched.push({ category, score, data: item });
  }

  campusKnowledge.departments.forEach(d => scoreItem(d, 'Departments'));
  campusKnowledge.faculty.forEach(f => scoreItem(f, 'Faculty'));
  campusKnowledge.facilities.forEach(f => scoreItem(f, 'Facilities'));
  campusKnowledge.events.forEach(e => scoreItem(e, 'Events'));
  campusKnowledge.notices.forEach(n => scoreItem(n, 'Notices'));
  campusKnowledge.services.forEach(s => scoreItem(s, 'Student Services'));
  campusKnowledge.academic.forEach(a => scoreItem(a, 'Academic Resources'));

  matched.sort((a, b) => b.score - a.score);
  return matched.slice(0, 4);
}

export async function generateRAGAnswer(userQuery, profile = {}) {
  const retrieved = retrieveContext(userQuery);
  const profileLine = profile?.department
    ? `The student is in ${profile.year || 'a'} year of ${profile.department}${profile.name ? ` (name: ${profile.name})` : ''}. Personalize when relevant.`
    : '';
  if (retrieved.length === 0) {
    return {
      answer: "I could not find verified information regarding your query in the GM University knowledge base. Please check with the respective department office.",
      sources: []
    };
  }

  const contextText = retrieved.map((r, i) => `[Source ${i + 1}: ${r.category}]\n${JSON.stringify(r.data, null, 2)}`).join('\n\n');
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return generateDeterministicFallback(userQuery, retrieved);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: 'You are the official GM University AI Campus Assistant. Use ONLY the supplied Context to answer accurately, concisely, and professionally. Offer a short next-step recommendation when helpful.'
    });

    const prompt = `${profileLine}\n\nContext:\n${contextText}\n\nQuestion: "${userQuery}"\nAnswer:`;
    const result = await model.generateContent(prompt);
    const response = await result.response;

    return { answer: response.text().trim(), sources: retrieved.map(r => r.category) };
  } catch (err) {
    return generateDeterministicFallback(userQuery, retrieved);
  }
}

function generateDeterministicFallback(query, retrieved) {
  const top = retrieved[0];
  const d = top.data;
  let formatted = '';

  if (top.category === 'Departments') formatted = `The **${d.name} (${d.code})** is headed by **${d.hod}**. Location: **${d.location}**. Contact: ${d.contactEmail}.`;
  else if (top.category === 'Faculty') formatted = `**${d.name}** is **${d.designation}** in **${d.department}**. Office: ${d.office}. Hours: ${d.availableHours}.`;
  else if (top.category === 'Facilities') formatted = `**${d.name}** is located at **${d.location}**.\n\n* Timings: ${d.timings}\n* Contact: ${d.contact}`;
  else if (top.category === 'Student Services') formatted = `For **${d.name}**, visit **${d.office}**.\n\n* **Procedure:** ${d.procedure}\n* **Fee:** ${d.fee}\n* **Processing Time:** ${d.processingTime}`;
  else if (top.category === 'Events') formatted = `**${d.title}** (${d.category})\n\n* **Date:** ${d.date}\n* **Venue:** ${d.venue}\n* **Details:** ${d.description}`;
  else if (top.category === 'Notices') formatted = `**[${d.priority}] ${d.title}** (${d.date})\n\n${d.content}`;
  else formatted = `**${d.title || d.name}**: ${d.description || JSON.stringify(d)}`;

  return { answer: formatted, sources: retrieved.map(r => r.category) };
}
