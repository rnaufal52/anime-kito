export type PlaybackMode = 'proxy' | 'iframe' | 'direct';

interface PlaybackStrategy {
  mode: PlaybackMode;
  url: string;
  sandbox?: string;
  referrerPolicy?: React.HTMLAttributeReferrerPolicy;
}

export function getPlaybackStrategy(url: string, providerName: string = ""): PlaybackStrategy {
  const lowerUrl = url.toLowerCase();
  
  // 1. Known Iframe-only providers
  // Mega.nz must be embedded via iframe
  if (lowerUrl.includes("mega.nz")) {
    // Transform file link to embed link
    // Input: https://mega.nz/file/ID#KEY
    // Output: https://mega.nz/embed/ID#KEY
    const embedUrl = url.replace("/file/", "/embed/");
    
    return {
      mode: 'iframe',
      url: embedUrl,
      // Mega needs full permissions (Blob/Storage), so NO sandbox attribute is best.
      // It also prefers no-referrer.
      sandbox: undefined,
      referrerPolicy: "no-referrer"
    };
  }

  // 2. Direct Video Files (MP4, MKV, etc.)
  // DISABLED PROXY: User reports issues. Reverting to direct iframe/video usage.
  // Many of these links might be IP-locked or require cookies, so server proxy fails.
  /*
  if (/\.(mp4|mkv|webm|ogg)(\?.*)?$/i.test(lowerUrl)) {
    return {
      mode: 'proxy',
      url: `/api/stream?url=${encodeURIComponent(url)}`
    };
  }
  */

  // 3. Provider-specific heuristics
  
  // Gofile - usually best as iframe if it's a page link
  if (lowerUrl.includes("gofile.io")) {
     return { mode: 'iframe', url };
  }

  // KrakenFiles - Convert view links to embed links
  // Pattern: krakenfiles.com/view/{id}/file.html -> krakenfiles.com/embed-video/{id}
  if (lowerUrl.includes("krakenfiles.com")) {
      const match = url.match(/krakenfiles\.com\/view\/([a-zA-Z0-9]+)/i);
      if (match && match[1]) {
          return {
              mode: 'iframe',
              url: `https://krakenfiles.com/embed-video/${match[1]}`
          };
      }
      return { mode: 'iframe', url };
  }

  // Movie-specific or random embed providers that often fail with 'origin' referrer
  // These often have aggressive ads/redirects, so we use a protective but functional sandbox.
  if (lowerUrl.includes("odvidhide.com") || lowerUrl.includes("vidhide") || lowerUrl.includes("embed") || lowerUrl.includes("wish")) {
      return {
          mode: 'iframe',
          url: url,
          referrerPolicy: "no-referrer",
          // Relaxed sandbox: allows player to work and bypasses the "sandboxed" check 
          // while still blocking automatic (non-user) top-level navigation.
          sandbox: "allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation"
      };
  }

  // ACEFILE, PDFRAIN, ODFILES, KFILE
  // Default to iframe without sandbox restrictions.
  return {
    mode: 'iframe',
    url: url,
    referrerPolicy: "origin"
  };
}
