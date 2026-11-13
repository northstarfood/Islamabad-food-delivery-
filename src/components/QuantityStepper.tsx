import { colors } from '../ui';

interface QuantityStepperProps {
  quantity: number;
  itemName: string;
  onChange: (quantity: number) => void;
}

const buttonStyle = {
  width: 40,
  height: 40,
  borderRadius: 10,
  border: `1px solid ${colors.teal}`,
  background: 'white',
  color: colors.teal,
  fontSize: 22,
  fontWeight: 700,
  cursor: 'pointer',
  lineHeight: 1,
} as const;

export default function QuantityStepper({ quantity, itemName, onChange }: QuantityStepperProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <button type="button" style={buttonStyle} aria-label={`Decrease ${itemName}`} onClick={() => onChange(quantity - 1)}>
        −
      </button>
      <span style={{ minWidth: 24, textAlign: 'center', fontWeight: 700 }} aria-live="polite">
        {quantity}
      </span>
      <button type="button" style={buttonStyle} aria-label={`Increase ${itemName}`} onClick={() => onChange(quantity + 1)}>
        +
      </button>
    </div>
  );
}
