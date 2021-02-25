export async function handler(event) {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "Go Serverless! Your function executed successfully!",
        input: event,
      },
      null,
      2
    ),
  };
}
