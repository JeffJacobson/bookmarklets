export default class FormatError extends Error {
    constructor(value: string, expectedFormat: RegExp, options?: ErrorOptions) {
        super(`Value "${value}" does not match expected format ${expectedFormat}`, options);
    }
}