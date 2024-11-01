import { blobToBase64 } from '../../shared/utils/blobToBase64';

export const blobUrlToBase64 = async ({ url }: { url: string }): Promise<string> => {
  const blob = await fetch(url).then((r) => r.blob());
  const base64 = await blobToBase64(blob);
  return base64;
};
