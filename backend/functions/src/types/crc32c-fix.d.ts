// Override the problematic Int32Array definition in @google-cloud/storage
declare module "@google-cloud/storage" {
  interface Int32ArrayConstructor {
    new(buffer: ArrayBuffer): Int32Array;
    new(length: number): Int32Array;
  }
}
