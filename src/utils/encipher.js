import JSEncrypt from 'jsencrypt'

// 对称加密
export const getEncryptPwd = (password) => {
  const encrypt = new JSEncrypt()
  encrypt.setPublicKey(process.env.VUE_APP_PUBLIC_KEY);
  return encrypt.encrypt(password)
}
