import { Link } from 'react-router-dom';
import { colors } from '../ui';

interface PageHeaderProps {
  title: string;
  backTo?: string;
  backLabel?: string;
}

export default function PageHeader({ title, backTo = '/', backLabel = '← Back' }: PageHeaderProps) {
  return (
    <header style={{ padding: '18px 6%', background: colors.teal, color: 'white' }}>
      <Link to={backTo} style={{ color: 'white', textDecoration: 'none', fontSize: 15 }}>
        {backLabel}
      </Link>
      <h2 style={{ margin: '8px 0 0' }}>{title}</h2>
    </header>
  );
}
