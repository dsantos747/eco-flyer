export class emissionsError extends Error {
  //We're making a custom error, by extending the Error tool and adding our own flair
  constructor(message = 'Error retrieving emissions data') {
    super(message);
    this.name = 'emissionsError';
  }
}
