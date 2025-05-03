interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '',
  ...props 
}: ButtonProps) => {
  const baseStyles = 'rounded-xl font-medium transition-all duration-200 flex items-center justify-center';
  
  const variants = {
    primary: 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg hover:from-indigo-600 hover:to-purple-700',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700',
    outline: 'border-2 border-indigo-500 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-gray-800'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};