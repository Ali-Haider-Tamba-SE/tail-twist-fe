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
    ? `Start an engaging interactive story. The response MUST include:
       1. A creative title
       2. A vivid and descriptive story content
       3. Exactly three distinct choices for what happens next
       Format the response using the formatStoryResponse function.`
    : messageCount >= 4
    ? "Conclude the story with a satisfying ending based on the user's choice. Make it visually descriptive."
    : `Continue the story based on the user's choice. The response MUST include:
       1. A vivid and descriptive continuation
       2. Exactly three distinct choices for what happens next
       Format the response using the formatStoryResponse function.`;

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
          required: ['content', 'choices'],
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
              minItems: 3,
              maxItems: 3,
              description:
                'Exactly three choices for the next part of the story (except for ending)',
            },
          },
        },
      },
    ],
    function_call: { name: 'formatStoryResponse' },
  });

  const functionCall = response.choices[0].message.function_call;
  if (!functionCall?.arguments) {
    throw new Error('No function call arguments received');
  }

  const result = JSON.parse(functionCall.arguments);
  console.log('OpenAI Response:', result);
  return result;
};

export const generateStoryImage = async (prompt: string) => {
  try {
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: `Create a vivid, story-book style illustration for this scene: ${prompt}`,
      n: 1,
      size: '1024x1024',
    });

    return response.data[0].url;
  } catch (error) {
    console.error('Failed to generate image:', error);
    return null;
  }
};
