const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy_key'
});

const classifyComplaint = async (description) => {
  try {
    const prompt = `You are an AI civic issue analyzer for a system called Antigravity.

Analyze the citizen complaint and return structured JSON.

Tasks:
1 Classify the complaint category
2 Identify responsible department
3 Detect urgency level
4 Generate short official summary
5 Suggest resolution workflow
6 Estimate resolution time

Return ONLY JSON in this format:

{
  "category":"",
  "department":"",
  "urgency":"",
  "summary":"",
  "resolution_workflow":[
    "complaint_received",
    "department_assigned",
    "inspection_scheduled",
    "work_in_progress",
    "resolved"
  ],
  "estimated_resolution_time":""
}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: "Complaint description:\n" + description }
      ],
      temperature: 0.1,
      response_format: { type: "json_object" }
    });

    const resultText = response.choices[0].message.content;
    const aiResult = JSON.parse(resultText);
    
    return {
      category: aiResult.category || "other",
      department: aiResult.department || "unassigned",
      urgency: aiResult.urgency || "normal",
      summary: aiResult.summary || description.substring(0, 100),
      resolution_workflow: aiResult.resolution_workflow || ["complaint_received", "department_assigned", "inspection_scheduled", "work_in_progress", "resolved"],
      estimated_resolution_time: aiResult.estimated_resolution_time || "48 hours"
    };
  } catch (error) {
    console.error("AI Analysis error:", error);
    // Fallback if AI fails
    return {
      category: "other",
      department: "unassigned",
      urgency: "normal",
      summary: description.substring(0, 100),
      resolution_workflow: ["complaint_received", "department_assigned", "inspection_scheduled", "work_in_progress", "resolved"],
      estimated_resolution_time: "48 hours"
    };
  }
};

module.exports = { classifyComplaint };
