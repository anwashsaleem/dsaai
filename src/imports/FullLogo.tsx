import logo from "figma:asset/596555e5dc3429e747867a3763bba0c20b82aca2.png";

export default function FullLogo({ className }: { className?: string }) {
  return (
    <img 
      src={logo} 
      alt="dsaai logo" 
      className={`w-full h-auto object-contain ${className || ''}`}
    />
  );
}