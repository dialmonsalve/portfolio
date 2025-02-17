import type { ImageOptimized } from "./interfaces";

export class DownLoadImages {
  private static crcTable: Uint32Array;
  constructor() {}

  simple(link: HTMLAnchorElement) {
    const $img = document.querySelector("#converted-image") as HTMLImageElement;

    if (!$img) return;
    const name = $img.getAttribute("data-name");
    link.href = $img?.src;
    if (!name) return;
    link.download = name;
  }

  async multiple(images: ImageOptimized[]): Promise<Blob> {
    const zip = DownLoadImages.createZipBlob(images);

    return zip;
  }

  private static makeCRCTable(): Uint32Array {
    let c: number;
    const crcTable: number[] = [];
    for (let n = 0; n < 256; n++) {
      c = n;
      for (let k = 0; k < 8; k++) {
        c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      }
      crcTable[n] = c;
    }
    return new Uint32Array(crcTable);
  }

  private static crc32(bytes: Uint8Array): number {
    if (!this.crcTable) this.crcTable = this.makeCRCTable();
    let crc = 0 ^ -1;
    for (let i = 0; i < bytes.length; i++) {
      crc = (crc >>> 8) ^ this.crcTable[(crc ^ bytes[i]) & 0xff];
    }
    return (crc ^ -1) >>> 0;
  }

  private static createLocalHeader(
    fileName: string,
    crc: number,
    length: number
  ): Uint8Array {
    const encoder = new TextEncoder();
    const fileNameBytes = encoder.encode(fileName);
    const buffer = new ArrayBuffer(30 + fileNameBytes.length);
    const view = new DataView(buffer);

    view.setUint32(0, 0x04034b50, true);
    view.setUint16(4, 0x0a00, true);
    view.setUint16(6, 0, true);
    view.setUint16(8, 0, true);
    view.setUint16(10, 0, true);
    view.setUint16(12, 0, true);
    view.setUint32(14, crc, true);
    view.setUint32(18, length, true);
    view.setUint32(22, length, true);
    view.setUint16(26, fileNameBytes.length, true);
    view.setUint16(28, 0, true);

    const headerBytes = new Uint8Array(buffer);
    headerBytes.set(fileNameBytes, 30);
    return new Uint8Array(buffer);
  }

  private static createCentralDirectoryEntry(
    fileName: string,
    crc: number,
    length: number,
    offset: number
  ): Uint8Array {
    const encoder = new TextEncoder();
    const fileNameBytes = encoder.encode(fileName);
    const buffer = new ArrayBuffer(46 + fileNameBytes.length);
    const view = new DataView(buffer);

    view.setUint32(0, 0x02014b50, true);
    view.setUint16(4, 0x0a00, true);
    view.setUint16(6, 0x0a00, true);
    view.setUint16(8, 0, true);
    view.setUint16(10, 0, true);
    view.setUint16(12, 0, true);
    view.setUint16(14, 0, true);
    view.setUint32(16, crc, true);
    view.setUint32(20, length, true);
    view.setUint32(24, length, true);
    view.setUint16(28, fileNameBytes.length, true);
    view.setUint16(30, 0, true);
    view.setUint16(32, 0, true);
    view.setUint16(34, 0, true);
    view.setUint16(36, 0, true);
    view.setUint32(38, 0, true);
    view.setUint32(42, offset, true);

    const entryBytes = new Uint8Array(buffer);
    entryBytes.set(fileNameBytes, 46);
    return new Uint8Array(buffer);
  }

  private static createEndOfCentralDirectory(
    numEntries: number,
    centralDirSize: number,
    offsetCentralDir: number
  ): Uint8Array {
    const buffer = new ArrayBuffer(22);
    const view = new DataView(buffer);

    view.setUint32(0, 0x06054b50, true);
    view.setUint16(4, 0, true);
    view.setUint16(6, 0, true);
    view.setUint16(8, numEntries, true);
    view.setUint16(10, numEntries, true);
    view.setUint32(12, centralDirSize, true);
    view.setUint32(16, offsetCentralDir, true);
    view.setUint16(20, 0, true);

    return new Uint8Array(buffer);
  }

  private static async createZipBlob(images: ImageOptimized[]): Promise<Blob> {
    const parts: Blob[] = [];
    const centralDirEntries: Uint8Array[] = [];
    let offset = 0;

    for (const image of images) {
      const data = await this.blobToUint8Array(image.urlObj);
      const fileName = `${image.fileName}.${image.ext}`;
      const crc = this.crc32(data);

      const localHeader = this.createLocalHeader(fileName, crc, data.length);
      parts.push(new Blob([localHeader]));
      parts.push(new Blob([data]));

      const centralEntry = this.createCentralDirectoryEntry(
        fileName,
        crc,
        data.length,
        offset
      );
      centralDirEntries.push(centralEntry);

      offset += localHeader.byteLength + data.length;
    }

    const centralDirBlob = new Blob(centralDirEntries);
    parts.push(centralDirBlob);

    const endRecord = this.createEndOfCentralDirectory(
      images.length,
      centralDirBlob.size,
      offset
    );
    parts.push(new Blob([endRecord]));

    return new Blob(parts, { type: "application/zip" });
  }

  private static async blobToUint8Array(blobUrl: string): Promise<Uint8Array> {
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result instanceof ArrayBuffer) {
          resolve(new Uint8Array(reader.result));
        } else {
          reject(new Error("Failed to read blob"));
        }
      };
      reader.onerror = () => reject(new Error("FileReader error"));
      reader.readAsArrayBuffer(blob);
    });
  }
}
