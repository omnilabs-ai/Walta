export async function generateKeyPair(): Promise<{ publicKey: string; privateKey: string }> {
    const keyPair = await window.crypto.subtle.generateKey(
      {
        name: "ECDSA",
        namedCurve: "P-256",
      },
      true,
      ["sign", "verify"]
    );
  
    const publicRaw = await window.crypto.subtle.exportKey("raw", keyPair.publicKey); // 65 bytes
    const privatePkcs8 = await window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey); // ~138 bytes
  
    const publicKey = btoa(String.fromCharCode(...new Uint8Array(publicRaw)));
    const privateKey = btoa(String.fromCharCode(...new Uint8Array(privatePkcs8)));
  
    return { publicKey, privateKey };
  }
  