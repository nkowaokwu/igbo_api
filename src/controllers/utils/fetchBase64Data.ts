/**
 * Fetches the audio from the url and returns its base64 string
 * @param url
 * @returns base64 string of audio
 */
export const fetchBase64Data = async (url: string) => {
  const fetchedAudio = await fetch(url);
  const data = await fetchedAudio.arrayBuffer();
  const base64 = btoa(String.fromCharCode(...new Uint8Array(data)));
  return base64;
};
