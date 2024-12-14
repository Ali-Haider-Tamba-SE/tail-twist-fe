import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateStoryPrompt = async (userInput?: string) => {
  const systemPrompt = userInput
    ? "Continue the story based on the user's choice. Provide 3 options for the next part."
    : 'Start an engaging interactive story. Provide 3 options for what happens next.';

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: systemPrompt,
      },
      {
        role: 'user',
        content: userInput || 'Start a new story',
      },
    ],
    functions: [
      {
        name: 'formatStoryResponse',
        description: 'Format the story response with content and choices',
        parameters: {
          type: 'object',
          properties: {
            content: {
              type: 'string',
              description: 'The story content',
            },
            choices: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Three choices for the next part of the story',
            },
          },
          required: ['content', 'choices'],
        },
      },
    ],
    function_call: { name: 'formatStoryResponse' },
  });

  const functionCall = response.choices[0].message.function_call;
  if (functionCall?.arguments) {
    return JSON.parse(functionCall.arguments);
  }

  throw new Error('Failed to generate story response');
};
