import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateStoryPrompt = async (
  userInput?: string,
  messageCount = 0
) => {
  const systemPrompt = !userInput
    ? 'Start an engaging interactive story. Give it a creative title. Provide 3 options for what happens next.'
    : messageCount >= 4
    ? "Conclude the story with a satisfying ending based on the user's choice. No options needed."
    : "Continue the story based on the user's choice. Provide 3 options for the next part.";

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
        description:
          'Format the story response with content, choices, and title',
        parameters: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              description: 'The title of the story (only for new stories)',
            },
            content: {
              type: 'string',
              description: 'The story content',
            },
            choices: {
              type: 'array',
              items: {
                type: 'string',
              },
              description:
                'Three choices for the next part of the story (except for ending)',
            },
          },
          required: ['content'],
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
