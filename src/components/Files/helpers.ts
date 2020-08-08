export const getClientIdFromOwnerId = (ownerId: string) => {
  if (ownerId && ownerId.length) {
    const ownerIdStaged = ownerId.split('/');
    if (ownerIdStaged.length >= 2) {
      return ownerIdStaged[2];
    }
  }

  return '';
};

export const getCompanyIdFromOwnerId = (ownerId: string) => {
  if (ownerId && ownerId.length) {
    const ownerIdStaged = ownerId.split('/');
    if (ownerIdStaged.length >= 1) {
      return ownerIdStaged[1];
    }
  }

  return '';
};

export const getFileNameFromFileKey = (fileKey: string) => {
  if (fileKey && fileKey.length) {
    const fileKeyStaged = fileKey.split('/');
    if (fileKeyStaged.length >= 2) {
      return fileKeyStaged[2].replace(/\.[^/.]+$/, '');
    }
  }

  return '';
};
