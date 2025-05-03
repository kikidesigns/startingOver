interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ children, className = '' }: CardProps) => {
  return (
    <div className={`
      bg-white/60 dark:bg-gray-800/60 
      backdrop-blur-lg 
      rounded-2xl 
      shadow-xl 
      p-6 
      transition-all 
      duration-300 
      hover:shadow-2xl 
      hover:transform 
      hover:-translate-y-1
      ${className}
    `}>
      {children}
    </div>
  );
};