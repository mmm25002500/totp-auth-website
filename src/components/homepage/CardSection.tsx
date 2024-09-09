import Card from "@/components/homepage/Card";
import { faBolt, faClock, faShieldHalved } from "@fortawesome/free-solid-svg-icons";

const CardSection = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <Card
        title="安全性"
        description="使用 Google Authenticator 一樣的演算法，讓您的帳戶更安全。"
        icon={faShieldHalved}
      ></Card>
      <Card
        title="方便性"
        description="使用 QR Code 掃描，並且透過跨平台機制，讓您的可以在任何地方使用。"
        icon={faClock}
      ></Card>
      <Card
        title="功能強大"
        description="支援基於 OTP、TOTP、HOTP 一次性密碼演算法的驗證碼。"
        icon={faBolt}
      ></Card>
    </div>
  )
}

export default CardSection;