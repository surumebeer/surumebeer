interface TagBadgeProps {
  tag: string;
  variant?: 'default' | 'secondary' | 'outline';
  size?: 'sm' | 'md';
}

export function TagBadge({ tag, variant = 'default', size = 'sm' }: TagBadgeProps) {
  const baseClasses = 'inline-flex items-center rounded-full font-medium transition-colors';
  
  const sizeClasses = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm'
  };

  const variantClasses = {
    default: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
    secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50'
  };

  return (
    <span className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]}`}>
      {tag}
    </span>
  );
}

interface TagListProps {
  tags: string[];
  variant?: 'default' | 'secondary' | 'outline';
  size?: 'sm' | 'md';
}

export function TagList({ tags, variant = 'default', size = 'sm' }: TagListProps) {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag, index) => (
        <TagBadge key={index} tag={tag} variant={variant} size={size} />
      ))}
    </div>
  );
}