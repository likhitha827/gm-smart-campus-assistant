const KEY = 'gm-student-profile';

export const emptyProfile = {
  name: '',
  department: '',
  year: '',
  interest: ''
};

export function getProfile() {
  try {
    return { ...emptyProfile, ...JSON.parse(localStorage.getItem(KEY) || '{}') };
  } catch {
    return { ...emptyProfile };
  }
}

export function saveProfile(profile) {
  localStorage.setItem(KEY, JSON.stringify(profile));
}
