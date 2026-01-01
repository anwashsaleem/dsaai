import icon from "figma:asset/0348d9e9327b591ee91c3e4786b4248b8d3db9ac.png";

export default function IconLogo({ className }: { className?: string }) {
  return (
    <img 
      src={icon} 
      alt="dsaai icon" 
      className={`w-full h-auto object-contain ${className || ''}`}
    />
  );
}
