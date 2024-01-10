export const simpleRestApi = async (
  ip: string,
  endpoint: string,
  params?: Record<string, string | number>
) => {
  const queryParams = params
    ? Object.keys(params).map((key, idx) => {
        return `${key}=${params[key]}${
          Object.keys(params).length - 1 === idx ? "" : "&"
        }`;
      })
    : "";

  const response = await fetch(
    `http://${ip}/${endpoint}${params ? `?${queryParams}` : ""}`,
    {
      mode: "no-cors",
      headers: {
        "Access-Control-Allow-Origin": "*"
      }
    }
  );
  const text = await response.text();

  return text ? JSON.parse(text) : null;
};
