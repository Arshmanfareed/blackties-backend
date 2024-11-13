const terms = {
  en: {
    resetpasswordSubject: 'Password Reset Link',
    resetpasswordBody: 'Please click on this link to reset your password',
    emailVerificationSubject: 'Email Verification Link',
    emailVerificationBody: 'Please click on this link to activate your account',
  },
  ar: {
    resetpasswordSubject: 'رابط إعادة تعيين كلمة المرور',
    resetpasswordBody: 'الرجاء الضغط على هذا الرابط لإعادة تعيين كلمة المرور الخاصة بك',
    emailVerificationSubject: 'رابط التحقق من البريد الإلكتروني',
    emailVerificationBody: 'الرجاء الضغط على هذا الرابط لتفعيل حسابك',
  },
};
const translate = (term, lang) => {
  if (terms[lang]) {
    return terms[lang][term] || 'Term not found';
  }
  return 'Term not found';
};

module.exports = {
  translate,
  terms,
};
