interface LinkCardProps {
  title: string;
  url: string;
}

export const LinkCard = ({ title, url }: LinkCardProps) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
    >
      <h3 className="text-lg font-medium text-center">{title}</h3>
    </a>
  );
};