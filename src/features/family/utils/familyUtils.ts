const INVITE_CODE_LENGTH = 8;
const INVITE_CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excluding similar looking characters

export const generateInviteCode = (): string => {
  let code = '';
  for (let i = 0; i < INVITE_CODE_LENGTH; i++) {
    const randomIndex = Math.floor(Math.random() * INVITE_CODE_CHARS.length);
    code += INVITE_CODE_CHARS[randomIndex];
  }
  return code;
}; 